"use client";

// import Link from "next/link";
// import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
// import { formatEther } from "viem";
// import { Address } from "~~/components/scaffold-eth";
// import { SkeletonLoader, Table } from "~~/components/streamogator";
// import { formatDate } from "~~/utils/helpers";
import { Table } from "~~/components/streamogator";

const Contracts: NextPage = () => {
  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <div>
          <h1 className="text-5xl mb-0 font-paytone">Streams</h1>
        </div>
        <div className="text-2xl">📜 Aggregate data for each Buidl Guidl stream contract</div>

        <Table headers={["Address", "Name", "Start", "Balance", "Builders", "Total Streamed"]} rows={[[""]]} />
      </div>
    </section>
  );
};

export default Contracts;
