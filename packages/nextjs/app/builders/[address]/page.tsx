"use client";

import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { StatsShowcase } from "~~/components/streamogator";
import { type Withdrawal } from "~~/types/streamogator";
import { customFormatEther, streamDirectory, timestampToFormattedDate, timestampToIsoDate } from "~~/utils/helpers";

const BUILDER = gql`
  query Builder($id: String!) {
    builder(id: $id) {
      date
      id
      streamCap
      streamContracts
      totalWithdrawals
      withdrawalsCount
    }
    withdrawals(where: { to: $id }, orderBy: "date", orderDirection: "desc") {
      items {
        amount
        chainId
        date
        reason
        id
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

const BuilderDetails: NextPage<PageProps> = ({ params }) => {
  const { data, loading, error } = useQuery(BUILDER, {
    variables: { id: params.address },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (loading) return <div className="text-center my-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  const { withdrawalsCount, totalWithdrawals, streamCap, streamContracts, date } = data.builder;

  return (
    <section className="flex flex-col justify-center lg:items-center gap-10 my-14 text-center">
      <div className="flex justify-center">
        <Address size="3xl" address={params.address} />
      </div>

      <StatsShowcase
        data={[
          { label: "Monthly Cap", value: customFormatEther(streamCap) },
          { label: "Withdrawals", value: withdrawalsCount },
          {
            label: "Average",
            value:
              withdrawalsCount > 0 ? customFormatEther(BigInt(totalWithdrawals) / BigInt(withdrawalsCount)) : "0.00",
          },
          {
            label: "Total",
            value: customFormatEther(totalWithdrawals),
          },
        ]}
      />

      <div className="text-xl md:text-2xl">
        {streamContracts.map((contract: string) => streamDirectory[contract.toLowerCase()]?.name).join(", ")} since{" "}
        {timestampToFormattedDate(date)}
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
              <th>Date</th>
              <th>Amount</th>
              <th>Stream</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(withdrawal => (
              <tr key={withdrawal.id}>
                <td className="text-nowrap">{timestampToIsoDate(withdrawal.date)}</td>
                <td className="text-nowrap">{customFormatEther(withdrawal.amount)}</td>
                <td>{streamDirectory[withdrawal.streamContract.toLowerCase()]?.name}</td>
                <td>{withdrawal.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuilderDetails;
