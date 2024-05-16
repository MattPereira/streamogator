"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { timestampToDate } from "~~/utils/helpers";

type Stream = {
  id: `0x${string}`; // contract address
  name: string;
  chainId: string;
  startBlock: number;
  buildersCount: number;
  withdrawalsCount: number;
  totalWithdrawals: bigint;
  timestamp: string;
};

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
    { label: "Address", key: "id", isSortable: true },
    { label: "Name", key: "name", isSortable: true },
    { label: "Start", key: "timestamp", isSortable: true },
    { label: "Builders", key: "buildersCount", isSortable: true },
    { label: "Pulls", key: "withdrawalsCount", isSortable: true },
    { label: "Total", key: "totalWithdrawals", isSortable: true },
    { label: "Chain", key: "chainId", isSortable: true },
  ];

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="absolute left-0 text-5xl mt-2">🏞️</div>
          <h1 className="text-6xl mb-0 font-paytone px-16">Streams</h1>
        </div>
        <div className="text-2xl">Sort by column name and select a stream to see more details</div>

        <div>
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
              rows={data?.streams?.items.map((stream: Stream) => {
                const address = <Address size="xl" address={stream.id} />;
                const name = stream.name;
                const start = timestampToDate(Number(stream.timestamp));
                const buildersCount = stream.buildersCount;
                const withdrawalsCount = stream.withdrawalsCount;
                const totalWithdrawals = `Ξ ${Number(formatEther(stream.totalWithdrawals)).toFixed(2)}`;
                const chainId = stream.chainId;

                return [address, name, start, buildersCount, withdrawalsCount, totalWithdrawals, chainId];
              })}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Streams;
