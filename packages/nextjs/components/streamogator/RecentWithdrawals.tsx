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
      <h3 className="text-center text-2xl font-bold">Recent Withdrawals</h3>

      <div className="overflow-x-auto w-full">
        <table className="table text-lg">
          <thead>
            <tr className="text-xl">
              <th>Buidler</th>
              <th>Date</th>
              {/* <th>Tx</th> */}
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.withdrawals.items.map((withdrawal: any) => (
              <tr key={withdrawal.id}>
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
