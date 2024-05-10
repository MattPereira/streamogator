// import Link from "next/link";
import type { NextPage } from "next";
import { BuilderTotals, RecentWithdrawals } from "~~/components/streamogator";

const Home: NextPage = () => {
  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <div>
          <h1 className="text-6xl mb-0 font-paytone text-primary">STREAMOGATOR</h1>
        </div>
        <div className="text-2xl">
          🕵️ Data analytics for all Buidl Guidl stream contracts deployed on Ethereum and Optimism
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-14">
          <BuilderTotals />
          <RecentWithdrawals />
        </div>
      </div>
    </section>
  );
};

export default Home;
