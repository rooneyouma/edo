import React from "react";

const MaintenanceTable = ({
  requests,
  hasMultipleProperties,
  onRequestClick,
  getStatusColor,
  getPriorityColor,
}) => {
  return (
    <div className="mt-6 sm:mt-8">
      {/* Mobile view - stacked cards */}
      <div className="sm:hidden space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border border-gray-200 dark:border-gray-700"
            onClick={() => onRequestClick(request)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {request.subject}
                </h3>
                {hasMultipleProperties && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {request.property} - {request.unit}
                  </p>
                )}
              </div>
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                  request.priority
                )}`}
              >
                {request.priority}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                  request.status
                )}`}
              >
                {request.status}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {request.date}
              </span>
            </div>
            {request.assignedTo && (
              <div className="mt-3 text-sm">
                <p className="text-gray-600 dark:text-gray-300">Assigned to:</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {request.assignedTo}
                </p>
                {request.contact && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {request.contact}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop view - table */}
      <div className="hidden sm:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {hasMultipleProperties && (
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6"
                >
                  Property & Unit
                </th>
              )}
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Subject
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onRequestClick(request)}
              >
                {hasMultipleProperties && (
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                    {request.property} - {request.unit}
                  </td>
                )}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.subject}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.date}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {request.assignedTo ? (
                    <div>
                      <div>{request.assignedTo}</div>
                      <div className="text-xs text-gray-400">
                        {request.contact}
                      </div>
                    </div>
                  ) : (
                    "Not Assigned"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;
