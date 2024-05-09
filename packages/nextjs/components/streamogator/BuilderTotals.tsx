"use client";

import { gql, useQuery } from "@apollo/client";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { formatDate } from "~~/utils/helpers";

const QUERY = gql`
  query BuildersByTotalCollected {
    builders(orderBy: "totalCollected", orderDirection: "desc", limit: 10) {
      items {
        id
        date
        streamCap
        totalCollected
      }
    }
  }
`;

export const BuilderTotals = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log("data", data);
  return (
    <div>
      <h3 className="text-center text-2xl font-bold">Builder Totals</h3>
      <div className="overflow-x-auto w-full">
        <table className="table text-lg">
          <thead>
            <tr className="text-xl">
              <th>Buidler</th>
              <th>Start</th>
              {/* <th>Cap</th> */}
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.builders.items.map((builder: any) => (
              <tr key={builder.id}>
                <td>
                  <Address size="xl" address={builder.id} />
                </td>
                <td>{formatDate(builder.date)}</td>
                {/* <td>Ξ {formatEther(builder.streamCap)}</td> */}
                <td>Ξ {Number(formatEther(builder.totalCollected)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
