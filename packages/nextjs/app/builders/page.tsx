"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table, TableControls } from "~~/components/streamogator";
import { type Builder } from "~~/types/streamogator";
import { streamDirectory, timestampToDate } from "~~/utils/helpers";

const BUILDERS = gql`
  query Builders($limit: Int!, $after: String, $orderBy: String!, $orderDirection: String!) {
    builders(limit: $limit, after: $after, orderBy: $orderBy, orderDirection: $orderDirection) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
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

const BuilderTotals: NextPage = () => {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState("totalWithdrawals");
  const [limit, setLimit] = useState<number>(10);

  const { data, loading, error } = useQuery(BUILDERS, {
    variables: { limit, after: afterCursor, orderBy, orderDirection },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

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

  const toggleOrderDirection = (key: string) => {
    if (orderBy === key) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
      setAfterCursor(null); // Reset cursor on sort order change
      setCursorHistory([]); // Clear history as the old cursors are not valid
    } else {
      setOrderBy(key);
      setOrderDirection("desc"); // Default to descending when changing key
      setAfterCursor(null); // Reset cursor on column change
      setCursorHistory([]); // Clear history as the old cursors are not valid
    }
  };

  const headers = [
    { label: "Builder", key: "id", isSortable: true },
    { label: "Start", key: "date", isSortable: true },
    { label: "Pulls", key: "withdrawalsCount", isSortable: true },
    { label: "Average", key: "averageWithdrawal", isSortable: false }, // Currently computed on frontend
    { label: "Total", key: "totalWithdrawals", isSortable: true },
    { label: "Cap", key: "streamCap", isSortable: true },
    { label: "Streams", key: "streamContracts", isSortable: true },
  ];

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="absolute left-0 text-5xl mt-1">🏗️</div>
          <h1 className="text-6xl mb-0 font-paytone px-16">Builders</h1>
        </div>
        <div className="text-2xl">Sort by column name and select a builder to see their full details</div>

        <div>
          <TableControls
            limit={limit}
            setLimit={setLimit}
            loadPreviousItems={loadPreviousItems}
            loadNextItems={loadNextItems}
            cursorHistory={cursorHistory}
            hasNextPage={data?.builders?.pageInfo?.hasNextPage}
          />

          {loading ? (
            <div className="w-[954px] h-[602px]">
              <SkeletonLoader />
            </div>
          ) : (
            <Table
              setOrderDirection={toggleOrderDirection}
              orderDirection={orderDirection}
              orderBy={orderBy}
              headers={headers}
              hrefPrefix={"/builders/"}
              rows={data.builders.items.map((builder: Builder) => {
                const builderAddress = <Address size="xl" address={builder.id} key={builder.id} />;
                const startDate = timestampToDate(builder.date);
                const averageWithdrawalAmount =
                  builder.withdrawalsCount > 0
                    ? `Ξ ${Number(
                        formatEther(BigInt(builder.totalWithdrawals) / BigInt(builder.withdrawalsCount)),
                      ).toFixed(2)}`
                    : "Ξ 0.00";
                const streamCap = `Ξ ${Number(formatEther(builder.streamCap)).toFixed(2)}`;
                const totalWithdrawals = `Ξ ${Number(formatEther(builder.totalWithdrawals)).toFixed(2)}`;
                const streamContracts = builder.streamContracts
                  .map(contract => streamDirectory[contract.toLowerCase()]?.name)
                  .join(", ");
                return [
                  builder.id,
                  builderAddress,
                  startDate,
                  builder.withdrawalsCount,
                  averageWithdrawalAmount,
                  totalWithdrawals,
                  streamCap,
                  streamContracts || "N/A",
                  ,
                ];
              })}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default BuilderTotals;
