"use client";

// import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";

const POOLS_QUERY = gql`
  query BuildersByTotalCollected {
    builders(orderBy: "totalCollected", orderDirection: "desc") {
      items {
        id
        streamCap
        totalCollected
      }
    }
  }
`;

const Home: NextPage = () => {
  const { data, loading, error } = useQuery(POOLS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log("data", data);
  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-10">
        <div>
          <h1 className="text-5xl mb-0">Streamogator</h1>
        </div>
        <div>Data analytics for all Buidl Guidl stream contracts deployed on Ethereum and Optimism</div>

        <div className="overflow-x-auto w-full">
          <table className="table text-lg">
            <thead>
              <tr className="text-xl">
                <th>Buidler</th>
                <th>StreamCap</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {data.builders.items.map((builder: any) => (
                <tr key={builder.id}>
                  <td>
                    <Address size="xl" address={builder.id} />
                  </td>
                  <td>{formatEther(builder.streamCap)}</td>
                  <td>{formatEther(builder.totalCollected)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Home;
