"use client";

import { gql, useQuery } from "@apollo/client";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log("data", data);
  return (
    <div>
      <h3 className="text-center text-3xl font-cubano mb-3">Recent Withdrawals</h3>

      <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
        <table className="table text-lg">
          <thead>
            <tr className="text-xl text-primary border-neutral-600 border-b">
              <th>Buidler</th>
              <th>Date</th>
              {/* <th>Tx</th> */}
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.withdrawals.items.map((withdrawal: any, idx: number) => (
              <tr
                key={withdrawal.id}
                className={` ${idx !== data.withdrawals.items.length - 1 && "border-neutral-600 border-b"}`}
              >
                <td>
                  <Address size="xl" address={withdrawal.to} />
                </td>
                <td>{formatDate(withdrawal.date)}</td>
                {/* <td>Ξ {formatEther(withdrawal.id)}</td> */}
                <td>Ξ {Number(formatEther(withdrawal.amount)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
