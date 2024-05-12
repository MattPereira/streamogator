"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate } from "~~/utils/helpers";

const QUERY = gql`
  query BuildersBytotalWithdrawals($limit: Int!, $after: String, $orderBy: String!, $orderDirection: String!) {
    builders(limit: $limit, after: $after, orderBy: $orderBy, orderDirection: $orderDirection) {
      pageInfo {
        endCursor
        hasNextPage
      }
      items {
        id
        date
        streamCap
        totalWithdrawals
        withdrawalsCount
        contract
      }
    }
  }
`;

const BuilderTotals: NextPage = () => {
  const [limit] = useState(10);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);

  const { data, loading, error } = useQuery(QUERY, {
    variables: { limit, after: afterCursor, orderBy: "totalWithdrawals", orderDirection: "desc" },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (data) {
    console.log(data.builders.items);
  }

  const loadNextItems = () => {
    if (data.builders.pageInfo.hasNextPage) {
      const newCursor = data.builders.pageInfo.endCursor;
      setCursorHistory([...cursorHistory, newCursor]); // Save current cursor before fetching next
      setAfterCursor(newCursor);
    }
  };

  const loadPreviousItems = () => {
    if (cursorHistory.length > 0) {
      const newHistory = [...cursorHistory];
      newHistory.pop(); // Remove the current cursor
      const previousCursor = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      setCursorHistory(newHistory);
      setAfterCursor(previousCursor);
    }
  };

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-10">
        <div>
          <h1 className="text-5xl mb-0 font-paytone">BUILDERS</h1>
        </div>
        <div className="text-2xl">🏗️ Data for each builder that has pulled from a Buidl Guidl stream contract</div>

        {loading ? (
          <div className="w-[1051px] h-[602px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            headers={["Builder", "Start", "Pulls", "Cap", "Total", "Average", "Contract"]}
            rows={data.builders.items.map((builder: any) => [
              <Address size="xl" address={builder.id} key={builder.id} />,
              formatDate(builder.date),
              builder.withdrawalsCount,
              `Ξ ${Number(formatEther(builder.streamCap)).toFixed(2)}`,
              `Ξ ${Number(formatEther(builder.totalWithdrawals)).toFixed(2)}`,
              builder.withdrawalsCount > 0
                ? `Ξ ${Number(formatEther(BigInt(builder.totalWithdrawals) / BigInt(builder.withdrawalsCount))).toFixed(
                    2,
                  )}`
                : "Ξ 0.00",
              ,
              <Address size="xl" address={builder.contract} key={builder.id} />,
            ])}
          />
        )}
        <div className="flex justify-end gap-5 w-full">
          <button className="btn btn-accent" onClick={loadPreviousItems} disabled={!cursorHistory.length}>
            Prev 10
          </button>
          <button className="btn btn-primary" onClick={loadNextItems} disabled={!data?.builders?.pageInfo?.hasNextPage}>
            Next 10
          </button>
        </div>
      </div>
    </section>
  );
};

export default BuilderTotals;
