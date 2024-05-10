"use client";

import { gql, useQuery } from "@apollo/client";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate } from "~~/utils/helpers";

const QUERY = gql`
  query RecentWithdrawals {
    withdrawals(orderBy: "date", orderDirection: "desc", limit: 10) {
      items {
        id
        date
        to
        amount
      }
    }
  }
`;

export const RecentWithdrawals = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (error) return <div className="text-red-500">Error : {error.message}</div>;
  return (
    <div>
      <h3 className="text-center text-3xl font-cubano mb-3">Recent Withdrawals</h3>

      {loading ? (
        <div className="w-[551px] h-[602px]">
          <SkeletonLoader />
        </div>
      ) : (
        <Table
          headers={["Builder", "Start", "Amount"]}
          rows={data.withdrawals.items.map((withdrawal: any, idx: number) => [
            <Address size="xl" address={withdrawal.to} key={idx} />,
            formatDate(withdrawal.date),
            `Ξ ${Number(formatEther(withdrawal.amount)).toFixed(2)}`,
          ])}
        />
      )}
    </div>
  );
};
