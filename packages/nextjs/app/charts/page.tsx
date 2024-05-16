"use client";

// import Link from "next/link";
// import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";

// import { formatEther } from "viem";
// import { Address } from "~~/components/scaffold-eth";
// import { SkeletonLoader, Table } from "~~/components/streamogator";
// import { timestampToDate } from "~~/utils/helpers";

const Charts: NextPage = () => {
  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="absolute left-0 text-5xl mt-2">📊</div>
          <h1 className="text-6xl mb-0 font-paytone px-16">Charts</h1>
        </div>
        <div className="text-2xl"> Visualizations for Buidl Guidl stream contract withdrawals</div>
      </div>
    </section>
  );
};

export default Charts;
