"use client";

// import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { SkeletonLoader, Table } from "~~/components/streamogator";
import { formatDate } from "~~/utils/helpers";

const QUERY = gql`
  query BuildersBytotalWithdrawals {
    builders(orderBy: "totalWithdrawals", orderDirection: "desc") {
      items {
        id
        date
        streamCap
        totalWithdrawals
        withdrawalsCount
      }
    }
  }
`;

const BuilderTotals: NextPage = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-10">
        <div>
          <h1 className="text-5xl mb-0 font-paytone">BUILDERS</h1>
        </div>
        <div className="text-2xl">🏗️ Data for each builder that has pulled from a Buidl Guidl stream contract</div>

        {loading ? (
          <div className="w-[750px] h-[999px]">
            <SkeletonLoader />
          </div>
        ) : (
          <Table
            headers={["Builder", "Start", "Pulls", "Cap", "Total", "Average", "Contract"]}
            rows={data.builders.items.map((builder: any) => [
              <Address size="xl" address={builder.id} key={builder.id} />,
              formatDate(builder.date),
              builder.withdrawalsCount,
              `Ξ ${Number(formatEther(builder.streamCap)).toFixed(2)}`,
              `Ξ ${Number(formatEther(builder.totalWithdrawals)).toFixed(2)}`,
              builder.withdrawalsCount > 0
                ? `Ξ ${Number(formatEther(BigInt(builder.totalWithdrawals) / BigInt(builder.withdrawalsCount))).toFixed(
                    2,
                  )}`
                : "Ξ 0.00",
              ,
            ])}
          />
        )}
      </div>
    </section>
  );
};

export default BuilderTotals;
