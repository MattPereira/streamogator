"use client";

// import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
// import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { timestampToDate } from "~~/utils/helpers";

type Stream = {
  id: `0x${string}`; // contract address
  name: string;
  chainId: string;
  startBlock: number;
};

const STREAMS = gql`
  query Withdrawals($orderBy: String!, $orderDirection: String!) {
    streams(orderBy: $orderBy, orderDirection: $orderDirection) {
      items {
        id
        name
        chainId
        startBlock
      }
    }
  }
`;

const Streams: NextPage = () => {
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState("startBlock");

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
    { label: "Start", key: "startBlock", isSortable: true },
    { label: "Network", key: "chainId", isSortable: true },
    // { label: "Balance", key: "???", isSortable: true },
    // { label: "Builders", key: "???", isSortable: true },
    // { label: "Total Streamed", key: "???", isSortable: true },
  ];

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="absolute left-0 text-5xl">🏞️</div>
          <h1 className="text-5xl mb-0 font-paytone px-16">Streams</h1>
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
                const startBlock = timestampToDate(stream.startBlock);
                const chainId = stream.chainId;

                return [address, name, startBlock, chainId];
              })}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Streams;
