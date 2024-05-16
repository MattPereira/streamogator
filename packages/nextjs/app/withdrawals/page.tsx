"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table, TableControls } from "~~/components/streamogator";
import { streamDirectory, timestampToDate } from "~~/utils/helpers";

type Withdrawal = {
  id: `0x${string}`; // txHash
  date: number;
  to: `0x${string}`;
  amount: bigint;
  network: string;
  streamContract: `0x${string}`;
  reason: string;
};

const WITHDRAWALS = gql`
  query Withdrawals($limit: Int!, $after: String, $orderBy: String!, $orderDirection: String!) {
    withdrawals(limit: $limit, after: $after, orderBy: $orderBy, orderDirection: $orderDirection) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        date
        to
        amount
        network
        streamContract
        reason
      }
    }
  }
`;

const Withdrawals: NextPage = () => {
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [limit, setLimit] = useState(10);

  const { data, loading, error } = useQuery(WITHDRAWALS, {
    variables: { limit, after: afterCursor, orderBy, orderDirection },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  const pageInfo = data?.withdrawals?.pageInfo;

  const loadNextItems = () => {
    if (pageInfo.hasNextPage) {
      const newCursor = pageInfo.endCursor;
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
    { label: "Builder", key: "to", isSortable: true },
    { label: "Date", key: "date", isSortable: true },
    { label: "Amount", key: "amount", isSortable: true },
    { label: "Transaction", key: "id", isSortable: true },
    { label: "Stream", key: "streamContract", isSortable: true },
    { label: "Reason", key: "reason", isSortable: true },
  ];

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="mt-2 absolute left-0 text-5xl">💰</div>
          <h1 className="text-6xl mb-0 font-paytone px-16">Withdrawals</h1>
        </div>
        <div className="text-2xl">Sort by column name and select a withdrawal to see the full details</div>

        <div>
          <TableControls
            limit={limit}
            setLimit={setLimit}
            loadPreviousItems={loadPreviousItems}
            loadNextItems={loadNextItems}
            cursorHistory={cursorHistory}
            hasNextPage={pageInfo?.hasNextPage}
          />

          {loading ? (
            <div className="w-[1052px] h-[602px]">
              <SkeletonLoader />
            </div>
          ) : (
            <Table
              setOrderDirection={toggleOrderDirection}
              orderDirection={orderDirection}
              orderBy={orderBy}
              headers={headers}
              rows={data.withdrawals.items.map((withdrawal: Withdrawal) => {
                const builder = <Address size="xl" address={withdrawal.to} key={withdrawal.id} />;
                const date = timestampToDate(withdrawal.date);
                const amount = `Ξ ${Number(formatEther(withdrawal.amount)).toFixed(2)}`;
                const transaction = abbreviateHex(withdrawal.id);
                const stream = streamDirectory[withdrawal.streamContract]?.name || "N/A";
                const reason = withdrawal.reason;

                // must match the order from headers
                return [builder, date, amount, transaction, stream, reason];
              })}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Withdrawals;

const abbreviateHex = (string: string) => {
  return `${string.slice(0, 6)}...${string.slice(-4)}`;
};
