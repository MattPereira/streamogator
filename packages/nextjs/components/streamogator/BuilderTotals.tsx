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
    <div className="">
      <h3 className="text-center text-3xl mb-3 font-cubano">Builder Totals</h3>
      <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
        <table className="table text-lg">
          <thead>
            <tr className="text-xl text-primary border-neutral-600 border-b font-cubano font-normal">
              <th className="font-normal">Buidler</th>
              <th className="font-normal">Start</th>
              {/* <th>Cap</th> */}
              <th className="font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.builders.items.map((builder: any, idx: number) => (
              <tr
                key={builder.id}
                className={` ${idx !== data.builders.items.length - 1 && "border-neutral-600 border-b"}`}
              >
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
