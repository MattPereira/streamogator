import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

type TableHeader = {
  label: string; // Human-readable label for the header
  key: string; // Key corresponding to the data field
  isSortable: boolean; // Whether the column is sortable
};

interface TableProps {
  headers: TableHeader[];
  rows: any[][]; // You may want to define this type more strictly based on your data
  setOrderDirection: (key: string) => void;
  orderBy: string;
  orderDirection: "asc" | "desc";
}

/**
 * 1. Consolidate table styles here
 * 2. Allows for sorting by column in both directions
 */
export const Table = ({ headers, rows, orderDirection, setOrderDirection, orderBy }: TableProps) => {
  return (
    <div className="overflow-x-auto w-full border border-neutral-600 rounded-xl">
      <table className="table text-lg">
        <thead>
          <tr className="text-xl border-neutral-600 border-b">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`${header.isSortable ? "cursor-pointer" : "cursor-not-allowed"}  ${
                  orderBy === header.key && header.isSortable ? "text-accent bg-base-200" : ""
                }`}
                onClick={() => header.isSortable && setOrderDirection(header.key)}
              >
                {header.label}
                {header.isSortable &&
                  orderBy === header.key &&
                  (orderDirection === "asc" ? (
                    <ChevronUpIcon className="ml-1 mb-1 h-5 w-5 inline" />
                  ) : (
                    <ChevronDownIcon className="ml-1 mb-1 h-5 w-5 inline" />
                  ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any[], idx: number) => (
            <tr
              key={idx}
              className={`hover:bg-base-100 hover:cursor-pointer ${
                idx !== rows.length - 1 && "border-neutral-600 border-b"
              }`}
            >
              {row.map((cell, cellIdx) => (
                <td
                  className="max-w-80 overflow-hidden overflow-x-auto min-w-max text-nowrap hide-scrollbar"
                  key={cellIdx}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
