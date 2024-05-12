"use client";

// import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate } from "~~/utils/helpers";

const QUERY = gql`
  query RecentWithdrawals {
    withdrawals(orderBy: "date", orderDirection: "desc") {
      items {
        id
        date
        to
        amount
        network
        contract
        gas
      }
    }
  }
`;

const Withdrawals: NextPage = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <div>
          <h1 className="text-5xl mb-0 font-paytone">WITHDRAWALS</h1>
        </div>
        <div className="text-2xl">
          💰 List of all the withdrawals accross all stream contracts on Ethereum and Optimism
        </div>

        {loading ? (
          <div className="w-[551px] h-[602px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            headers={["Builder", "Date", "Amount", "Transaction", "Contract", "Gas"]}
            rows={data.withdrawals.items.map((withdrawal: any, idx: number) => [
              <Address size="xl" address={withdrawal.to} key={idx} />,
              formatDate(withdrawal.date),
              `Ξ ${Number(formatEther(withdrawal.amount)).toFixed(2)}`,
              abbreviateHex(withdrawal.id),
              <Address size="xl" address={withdrawal.contract} key={idx} />,
              withdrawal.gas,
            ])}
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
