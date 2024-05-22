"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { PageTitle, SkeletonLoader, Table } from "~~/components/streamogator";
import { type Stream } from "~~/types/streamogator";
import { timestampToIsoDate } from "~~/utils/helpers";

const STREAMS = gql`
  query Streams($orderBy: String!, $orderDirection: String!) {
    streams(orderBy: $orderBy, orderDirection: $orderDirection) {
      items {
        id
        name
        chainId
        timestamp
        buildersCount
        withdrawalsCount
        totalWithdrawals
      }
    }
  }
`;

const Streams: NextPage = () => {
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState("timestamp");

  const { data, loading, error } = useQuery(STREAMS, {
    variables: { orderBy, orderDirection },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  const toggleOrderDirection = (key: string) => {
    if (orderBy === key) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(key);
      setOrderDirection("desc"); // Default to descending when changing key
    }
  };

  const headers = [
    { label: "Name", key: "name", isSortable: true },
    { label: "Address", key: "id", isSortable: true },
    { label: "Start", key: "timestamp", isSortable: true },
    { label: "Builders", key: "buildersCount", isSortable: true },
    { label: "Pulls", key: "withdrawalsCount", isSortable: true },
    { label: "Total", key: "totalWithdrawals", isSortable: true },
    { label: "Chain", key: "chainId", isSortable: true },
  ];

  return (
    <section className="flex flex-col justify-center lg:items-center gap-10 my-14">
      <PageTitle title="Streams" emoji="🏞️" description="Sort by column name and select a stream to see more details" />
      <div>
        {loading ? (
          <div className="w-[1052px] h-[762px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            setOrderDirection={toggleOrderDirection}
            orderDirection={orderDirection}
            orderBy={orderBy}
            headers={headers}
            hrefPrefix={"/streams"}
            rows={data?.streams?.items.map((stream: Stream) => {
              const address = <Address disableAddressLink size="lg" address={stream.id} />;
              const name = stream.name;
              const start = timestampToIsoDate(Number(stream.timestamp));
              const buildersCount = stream.buildersCount;
              const withdrawalsCount = stream.withdrawalsCount;
              const totalWithdrawals = `Ξ ${Number(formatEther(stream.totalWithdrawals)).toFixed(2)}`;
              const chainId = stream.chainId;

              return [stream.id, name, address, start, buildersCount, withdrawalsCount, totalWithdrawals, chainId];
            })}
          />
        )}
      </div>
    </section>
  );
};

export default Streams;
