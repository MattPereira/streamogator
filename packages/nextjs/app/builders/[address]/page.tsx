"use client";

import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { type Builder, type Withdrawal } from "~~/types/streamogator";
import { customFormatEther, streamDirectory, timestampToDate } from "~~/utils/helpers";

const BUILDER = gql`
  query SingleBuilder($id: String!) {
    builder(id: $id) {
      date
      id
      streamCap
      streamContracts
      totalWithdrawals
      withdrawalsCount
    }
    withdrawals(where: { to: $id }) {
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

  return (
    <section className="overflow-x-auto ">
      <div className="flex justify-center ">
        <div className="flex flex-col justify-center items-center gap-10 my-14 max-w-[1000px]">
          <Address size="3xl" address={params.address} />
          <Showcase builder={data?.builder} />
          <Withdrawals withdrawals={data?.withdrawals?.items} />
        </div>
      </div>
    </section>
  );
};

const Withdrawals = ({ withdrawals }: { withdrawals: Withdrawal[] }) => {
  return (
    <div>
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
                <td className="text-nowrap">{timestampToDate(withdrawal.date)}</td>
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

const Showcase = ({ builder }: { builder: Builder }) => {
  if (!builder) return null;

  const { withdrawalsCount, totalWithdrawals, streamCap, streamContracts, date } = builder;

  const average =
    withdrawalsCount > 0 ? customFormatEther(BigInt(totalWithdrawals) / BigInt(withdrawalsCount)) : "0.00";

  return (
    <>
      <div className="stats stats-vertical sm:stats-horizontal shadow ">
        <div className="stat place-items-center">
          <div className="stat-title">Withdrawals</div>
          <div className="stat-value">{withdrawalsCount}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Average Amt</div>
          <div className="stat-value">{average}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Total Amt</div>
          <div className="stat-value">{customFormatEther(totalWithdrawals)}</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">Monthly Cap</div>
          <div className="stat-value">{customFormatEther(streamCap)}</div>
        </div>
      </div>

      <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
        <table className="table text-xl">
          <tbody>
            {[
              { label: "Started", value: timestampToDate(date) },
              {
                label: "Streams",
                value: streamContracts.map(contract => streamDirectory[contract.toLowerCase()]?.name).join(", "),
              },
            ].map((item, index) => (
              <tr key={index} className="">
                <th>{item.label}:</th>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BuilderDetails;
