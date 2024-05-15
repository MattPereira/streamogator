"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate, streamDirectory } from "~~/utils/helpers";

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
        streamContracts
        totalWithdrawals
        withdrawalsCount
      }
    }
  }
`;

type Builder = {
  streamContracts: `0x${string}`[];
  date: number;
  id: `0x${string}`;
  streamCap: bigint;
  totalWithdrawals: bigint;
  withdrawalsCount: number;
};

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
        <div className="text-2xl">👇 Select a builder to see the full details of their withdrawal history</div>

        {loading || !data.builders.items ? (
          <div className="w-[1051px] h-[602px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            headers={["Builder", "Start", "Pulls", "Average", "Total", "Cap", "Stream"]}
            rows={data.builders.items.map((builder: Builder) => {
              const builderAddress = builder.id;
              const startDate = formatDate(builder.date);
              const averageWithdrawalAmount =
                builder.withdrawalsCount > 0
                  ? `Ξ ${Number(
                      formatEther(BigInt(builder.totalWithdrawals) / BigInt(builder.withdrawalsCount)),
                    ).toFixed(2)}`
                  : "Ξ 0.00";
              const streamCap = `Ξ ${Number(formatEther(builder.streamCap)).toFixed(2)}`;
              const totalWithdrawals = `Ξ ${Number(formatEther(builder.totalWithdrawals)).toFixed(2)}`;
              const streamContract = builder.streamContracts[0].toLowerCase();
              return [
                <Address size="xl" address={builderAddress} key={builder.id} />,
                startDate,
                builder.withdrawalsCount,
                averageWithdrawalAmount,
                totalWithdrawals,
                streamCap,
                streamDirectory[streamContract]?.name || "N/A",
                ,
              ];
            })}
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
