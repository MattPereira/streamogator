import Link from "next/link";
import type { NextPage } from "next";

const PAGES = [
  {
    emoji: "💰",
    title: "Withdrawals",
    href: "/withdrawals",
    description: "Explore list of withdrawals from all Buidl Guidl streams",
  },
  {
    emoji: "👷",
    title: "Builders",
    href: "/builders",
    description: "Explore aggregated data for all EOAs that have withdrawn from a stream",
  },

  {
    emoji: "🏞️",
    title: "Streams",
    href: "/streams",
    description: "Aggregate data for each stream contract deployed on Ethereum and Optimism",
  },
  {
    emoji: "📊",
    title: "Charts",
    href: "/charts",
    description: "Aggregate data for each stream contract deployed on Ethereum and Optimism",
  },
];

const Home: NextPage = () => {
  return (
    <section className="flex justify-center px-10">
      <div className="flex flex-col justify-center items-center gap-14 my-14">
        <div>
          <h1 className="text-6xl mb-0 font-paytone">STREAMOGATOR</h1>
        </div>
        <div className="text-2xl">
          🕵️ Data analytics for all Buidl Guidl stream contracts deployed on Ethereum and Optimism
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {PAGES.map(item => (
            <Link
              className="relative bg-base-200 hover:scale-105 hover:bg-base-100 text-2xl text-center p-8 rounded-3xl"
              key={item.href}
              href={item.href}
              passHref
            >
              <h3 className="text-4xl font-bold mb-10">{item.title}</h3>
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
