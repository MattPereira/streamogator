"use client";

// import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import "chart.js/auto";
import type { NextPage } from "next";
import { Bar } from "react-chartjs-2";
import { formatEther } from "viem";
import { SkeletonLoader } from "~~/components/streamogator";

const options = {
  responsive: true,
  maintainAspectRatio: true, // Adjust this to control the chart's height relative to its width
  scales: {
    x: {
      grid: {
        color: "rgba(201, 203, 207, 0.3)",
      },
    },
    y: {
      grid: {
        color: "rgba(201, 203, 207, 0.3)",
      },
    },
  },
};

const STREAMS = gql`
  query Streams {
    streams(orderBy: "totalWithdrawals", orderDirection: "desc") {
      items {
        name
        buildersCount
        totalWithdrawals
      }
    }
  }
`;

const Charts: NextPage = () => {
  const { data, loading, error } = useQuery(STREAMS, {
    fetchPolicy: "network-only", // Ensures fresh server-side fetch
  });

  if (error) return <div className="text-red-500 text-center my-10">Error : {error.message}</div>;

  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-10 my-14">
        <div className="relative">
          <div className="absolute left-0 text-5xl mt-2">📊</div>
          <h1 className="text-6xl mb-0 font-paytone px-16">Charts</h1>
        </div>
        <div className="text-2xl">Vizualize stream contract data with interactive charts</div>

        {loading ? (
          <div className="w-[888px] h-[440px]">
            <SkeletonLoader />
          </div>
        ) : (
          <ChartDisplay data={data} />
        )}
      </div>
    </section>
  );
};

const ChartDisplay = ({ data }: { data: any }) => {
  const labels = data.streams.items.map((stream: any) => stream.name);

  return (
    <div className="w-[333px] lg:w-[888px]">
      <div className="mb-10">
        <Bar
          options={options}
          data={{
            labels: labels,
            datasets: [
              {
                label: "ETH Allocated",
                data: data.streams.items.map((stream: any) => formatEther(stream.totalWithdrawals)),
                backgroundColor: ["rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgb(54, 162, 235)"],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
      <div>
        <Bar
          options={options}
          data={{
            labels: labels,
            datasets: [
              {
                label: "Number of Builders",
                data: data.streams.items.map((stream: any) => stream.buildersCount),
                backgroundColor: ["rgba(153, 102, 255, 0.2)"],
                borderColor: ["rgba(153, 102, 255)"],
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Charts;
