"use client";

// import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate, streamDirectory } from "~~/utils/helpers";

const QUERY = gql`
  query RecentWithdrawals {
    withdrawals(orderBy: "date", orderDirection: "desc") {
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
  const { data, loading, error } = useQuery(QUERY);
  console.log("data", data);

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <div>
          <h1 className="text-5xl mb-0 font-paytone">WITHDRAWALS</h1>
        </div>
        <div className="text-2xl">👇 Select a withdrawal to see the full details for a transaction</div>

        {loading || data.withdrawals.items.length < 1 ? (
          <div className="w-[551px] h-[602px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            headers={["Builder", "Date", "Amount", "Transaction", "Stream"]}
            rows={data.withdrawals.items.map((withdrawal: any, idx: number) => {
              const builderAddress = withdrawal.to;
              const date = formatDate(withdrawal.date);
              const transactionHash = abbreviateHex(withdrawal.id);
              const streamName = streamDirectory[withdrawal.streamContract]?.name || "N/A";

              return [
                <Address size="xl" address={builderAddress} key={idx} />,
                date,
                `Ξ ${Number(formatEther(withdrawal.amount)).toFixed(2)}`,
                transactionHash,
                streamName,
              ];
            })}
          />
        )}
      </div>
    </section>
  );
};

export default Withdrawals;

const abbreviateHex = (string: string) => {
  return `${string.slice(0, 6)}...${string.slice(-4)}`;
};
