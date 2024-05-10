"use client";

import { gql, useQuery } from "@apollo/client";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
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

  if (error) return <div className="text-red-500">Error : {error.message}</div>;

  return (
    <div>
      <h3 className="text-center text-4xl mb-3">Builder Totals</h3>

      {loading ? (
        <div className="w-[551px] h-[602px]">
          <SkeletonLoader />
        </div>
      ) : (
        <Table
          headers={["Builder", "Start", "Amount"]}
          rows={data.builders.items.map((builder: any) => [
            <Address size="xl" address={builder.id} key={builder.id} />,
            formatDate(builder.date),
            `Ξ ${Number(formatEther(builder.totalCollected)).toFixed(2)}`,
          ])}
        />
      )}
    </div>
  );
};
