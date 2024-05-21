"use client";

import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader } from "~~/components/streamogator";
import { abbreviateHex, customFormatEther, timestampToIsoDate } from "~~/utils/helpers";

const WITHDRAWAL = gql`
  query SingleWithdrawal($id: String!) {
    withdrawal(id: $id) {
      id
      date
      to
      amount
      chainId
      streamContract
      reason
    }
  }
`;

interface PageProps {
  params: {
    hash: string;
  };
}

const WithdrawalDetails: NextPage<PageProps> = ({ params }) => {
  const { data, loading, error } = useQuery(WITHDRAWAL, {
    variables: { id: params.hash },
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  const skeleton = (
    <div className="w-96 h-10">
      <SkeletonLoader />
    </div>
  );

  return (
    <section className="overflow-x-auto ">
      <div className="flex justify-center ">
        <div className="flex flex-col justify-center items-center gap-10 my-14 max-w-[1000px]">
          <div className="relative">
            <div className="mt-1 absolute left-0 text-4xl">🧾</div>
            <h1 className="text-5xl mb-0 font-paytone px-12">Withdrawal</h1>
          </div>

          <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
            <table className="table text-xl">
              <tbody>
                {[
                  { label: "Date", value: loading ? skeleton : timestampToIsoDate(data?.withdrawal?.date) },
                  {
                    label: "From",
                    value: loading ? skeleton : <Address size="xl" address={data?.withdrawal?.streamContract} />,
                  },
                  { label: "To", value: loading ? skeleton : <Address size="xl" address={data?.withdrawal?.to} /> },
                  { label: "Amount", value: loading ? skeleton : `${customFormatEther(data?.withdrawal?.amount)} ETH` },
                  { label: "ChainId", value: loading ? skeleton : data?.withdrawal?.chainId },
                  { label: "Tx Hash", value: loading ? skeleton : abbreviateHex(data?.withdrawal?.id) },
                  { label: "Reason", value: loading ? skeleton : data?.withdrawal?.reason },
                ].map((item, index) => (
                  <tr key={index}>
                    <th>{item.label}:</th>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WithdrawalDetails;
