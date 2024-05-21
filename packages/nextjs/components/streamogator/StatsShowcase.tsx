interface StatShowcaseProps {
  data: { label: string; value: string }[];
}

export const StatsShowcase: React.FC<StatShowcaseProps> = ({ data }) => {
  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow">
      {data.map((item, index) => (
        <div key={index} className="stat place-items-center">
          <div className="stat-title">{item.label}</div>
          <div className="stat-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};
