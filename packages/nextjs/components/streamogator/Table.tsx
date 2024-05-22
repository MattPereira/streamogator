import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

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
  hrefPrefix?: string;
}

/**
 * 1. Consolidate table styles here
 * 2. Allows for sorting by column in both directions
 */
export const Table = ({ headers, rows, orderDirection, setOrderDirection, orderBy, hrefPrefix }: TableProps) => {
  const router = useRouter();
  return (
    <div className="overflow-x-auto border border-neutral-600 rounded-xl flex">
      <table className="table text-lg">
        <thead>
          <tr className="text-lg border-neutral-600 border-b">
            <th>
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </th>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`hover:text-accent ${header.isSortable ? "cursor-pointer" : "cursor-not-allowed"}  ${
                  orderBy === header.key && header.isSortable ? "text-primary bg-base-200" : ""
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
              className={`hover:bg-base-200 hover:text-primary hover:cursor-pointer ${
                idx !== rows.length - 1 && "border-neutral-600 border-b"
              }`}
              // Hacky fix to allow for links to details pages
              onClick={() => router.push(`${hrefPrefix}/${row[0]}`)}
            >
              <td>
                <div className="flex justify-center border border-base-200 p-1 rounded-lg hover:bg-primary hover:text-accent-content">
                  <EyeIcon className="w-5 h-5" />
                </div>
              </td>
              {row.map((data, index) => {
                // Hacky fix to skip over idx 0 which is "id" which allows for links to details pages
                if (index !== 0) {
                  return (
                    <td
                      className="max-w-80 overflow-hidden overflow-x-auto min-w-max text-nowrap hide-scrollbar"
                      key={index}
                    >
                      {data}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
