import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageInputValue,
  setPageInputValue,
}) => {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInputValue}
              onChange={(e) => {
                const value = e.target.value;
                setPageInputValue(value);
                const page = parseInt(value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              onBlur={() => {
                const page = parseInt(pageInputValue);
                if (page < 1) {
                  setPageInputValue("1");
                  onPageChange(1);
                } else if (page > totalPages) {
                  setPageInputValue(totalPages.toString());
                  onPageChange(totalPages);
                }
              }}
              className="w-12 h-6 text-xs text-center rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center p-1.5 text-xs font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
