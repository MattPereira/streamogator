/**
 * Consolidate table styles here
 */
export const Table = ({ headers, rows }: { headers: any[]; rows: any[] }) => {
  return (
    <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
      <table className="table text-lg">
        <thead>
          <tr className="text-xl border-neutral-600 border-b">
            {headers.map((header: any[], idx: number) => (
              <th key={idx} className="">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any[], idx: number) => (
            <tr key={idx} className={` ${idx !== rows.length - 1 && "border-neutral-600 border-b"}`}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
