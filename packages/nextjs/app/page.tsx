import Link from "next/link";
import type { NextPage } from "next";
import { PageTitle } from "~~/components/streamogator/";

const PAGES = [
  {
    emoji: "💰",
    title: "Withdrawals",
    href: "/withdrawals",
    description: "Explore compiled list of withdrawals from all stream contracts",
  },
  {
    emoji: "🏗️",
    title: "Builders",
    href: "/builders",
    description: "Explore aggregated data of withdrawals for each builder",
  },

  {
    emoji: "🏞️",
    title: "Streams",
    href: "/streams",
    description: "Explore aggregated data for each Buidl Guidl stream contract",
  },
  {
    emoji: "📊",
    title: "Charts",
    href: "/charts",
    description: "Visualize stream contract data with interactive charts",
  },
];

const Home: NextPage = () => {
  return (
    <section className="flex justify-center">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <PageTitle
          title="StreamoGator"
          description="🕵️ Data analytics for all Buidl Guidl stream cohorts deployed on Ethereum and Optimism"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {PAGES.map(item => (
            <Link
              className="relative bg-base-200 hover:scale-105 hover:bg-base-100 text-2xl text-center p-8 rounded-3xl"
              key={item.href}
              href={item.href}
              passHref
            >
              <h3 className="text-4xl font-bold mb-7">{item.title}</h3>
              <div className="text-8xl mb-10">{item.emoji}</div>
              <p className="text-xl mb-0">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
