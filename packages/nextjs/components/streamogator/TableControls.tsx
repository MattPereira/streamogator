import { ArrowLongLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";

interface TableControlsProps {
  limit: number;
  setLimit: (limit: number) => void;
  loadPreviousItems: () => void;
  loadNextItems: () => void;
  cursorHistory: string[];
  hasNextPage: boolean;
}

export const TableControls: React.FC<TableControlsProps> = ({
  limit,
  setLimit,
  loadPreviousItems,
  loadNextItems,
  cursorHistory,
  hasNextPage,
}) => {
  return (
    <div className="flex justify-between gap-5 w-full items-center mb-4 px-1">
      <div className="flex items-center gap-3">
        Show{" "}
        <div>
          <select
            className="select select-primary w-full max-w-xs rounded-md select-sm"
            value={limit}
            onChange={e => setLimit(parseInt(e.target.value))}
          >
            {[10, 25, 50, 100].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>{" "}
        of ? records
      </div>
      <div className="flex items-center gap-3">
        <button
          className="btn btn-primary btn-sm rounded-md"
          onClick={loadPreviousItems}
          disabled={!cursorHistory.length}
        >
          <ArrowLongLeftIcon className="w-5 h-5" />
        </button>
        <div className="">Page ? of ?</div>
        <button className="btn btn-primary btn-sm rounded-md" onClick={loadNextItems} disabled={!hasNextPage}>
          <ArrowLongRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
