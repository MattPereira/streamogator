"use client";

import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { StatsShowcase } from "~~/components/streamogator";
import { type Withdrawal } from "~~/types/streamogator";
import { customFormatEther, timestampToFormattedDate, timestampToIsoDate } from "~~/utils/helpers";

const STREAM = gql`
  query GetStreamData($id: String!) {
    stream(id: $id) {
      buildersCount
      chainId
      id
      name
      startBlock
      timestamp
      totalWithdrawals
      withdrawalsCount
    }
    builders(where: { streamContracts_has: $id }) {
      items {
        id
        date
        streamCap
        totalWithdrawals
        withdrawalsCount
        streamContracts
      }
    }
    withdrawals(where: { streamContract: $id }) {
      items {
        amount
        date
        id
        reason
        streamContract
        to
      }
    }
  }
`;

interface PageProps {
  params: {
    address: string;
  };
}

/**
 * @dev Stuck on getting list of builders for a stream. Query fine in GraphiQL playground
 * but can't figure out proper syntax for apollo client params or its a bug with Ponder???
 */
const StreamDetails: NextPage<PageProps> = ({ params }) => {
  const { data, loading, error } = useQuery(STREAM, {
    variables: {
      id: params.address,
      idArray: [params.address],
    },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (loading) return <div className="text-center my-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex flex-col justify-center lg:items-center gap-10 my-14 text-center">
      <div className="text-4xl md:text-5xl font-paytone">{data.stream.name}</div>
      <StatsShowcase
        data={[
          { label: "Builders", value: data.stream.buildersCount },
          { label: "Withdrawals", value: data.stream.withdrawalsCount },
          { label: "Total", value: customFormatEther(data.stream.totalWithdrawals) },
        ]}
      />

      <div className="flex flex-wrap justify-center gap-2 text-2xl">
        <Address size="2xl" address={params.address} /> deployed on {timestampToFormattedDate(data.stream.timestamp)}
      </div>
      <Withdrawals withdrawals={data?.withdrawals?.items} />
    </section>
  );
};

const Withdrawals = ({ withdrawals }: { withdrawals: Withdrawal[] }) => {
  return (
    <div className="max-w-[1000px]">
      <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
        <table className="table text-xl">
          <thead>
            <tr className="text-xl">
              <th>Builder</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(withdrawal => (
              <tr key={withdrawal.id}>
                <td>{<Address address={withdrawal.to} size="xl" />}</td>
                <td className="text-nowrap">{timestampToIsoDate(withdrawal.date)}</td>
                <td className="text-nowrap">{customFormatEther(withdrawal.amount)}</td>
                <td>{withdrawal.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StreamDetails;
