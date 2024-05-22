"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { PageTitle, PaginationControls, SkeletonLoader, Table } from "~~/components/streamogator";
import { type Withdrawal } from "~~/types/streamogator";
import { customFormatEther, streamDirectory, timestampToIsoDate } from "~~/utils/helpers";

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
        chainId
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

  console.log("data", data);

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
    { label: "Builder", key: "to", isSortable: true, showMobile: true },
    { label: "Date", key: "date", isSortable: true, showMobile: true },
    { label: "Amount", key: "amount", isSortable: true, showMobile: true },
    { label: "Stream", key: "streamContract", isSortable: true, showMobile: false },
    { label: "Chain", key: "network", isSortable: true, showMobile: false },
  ];

  return (
    <section className="flex flex-col justify-center lg:items-center gap-10 my-14">
      <PageTitle
        title="Withdrawals"
        emoji="💰"
        description="Sort by column name and select a withdrawal to see the full details"
      />

      <div className="max-w-[1111px]">
        {loading ? (
          <div className="min-w-[828px] h-[602px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            setOrderDirection={toggleOrderDirection}
            orderDirection={orderDirection}
            orderBy={orderBy}
            headers={headers}
            hrefPrefix="/withdrawals/"
            rows={data.withdrawals.items.map((withdrawal: Withdrawal) => {
              const builder = <Address size="xl" disableAddressLink address={withdrawal.to} key={withdrawal.id} />;
              const date = timestampToIsoDate(withdrawal.date);
              const amount = customFormatEther(withdrawal.amount);
              const id = withdrawal.id;
              const stream = streamDirectory[withdrawal.streamContract]?.name || "N/A";
              const chain = withdrawal.chainId;

              // id is not displayed (only used for details page link)
              // must match the order from headers
              return [id, builder, date, amount, stream, chain];
            })}
          />
        )}

        <PaginationControls
          limit={limit}
          setLimit={setLimit}
          loadPreviousItems={loadPreviousItems}
          loadNextItems={loadNextItems}
          cursorHistory={cursorHistory}
          hasNextPage={pageInfo?.hasNextPage}
        />
      </div>
    </section>
  );
};

export default Withdrawals;
