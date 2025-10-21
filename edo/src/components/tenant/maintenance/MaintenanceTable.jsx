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
            className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 cursor-pointer border border-gray-200 transition-all"
            onClick={() => onRequestClick(request)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {request.subject}
                </h3>
                {hasMultipleProperties && (
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {request.property} - {request.unit}
                  </p>
                )}
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${getPriorityColor(
                  request.priority
                )}`}
              >
                {request.priority}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${getStatusColor(
                  request.status
                )}`}
              >
                {request.status}
              </span>
              <span className="text-xs text-gray-500">{request.date}</span>
            </div>
            {request.assignedTo && (
              <div className="mt-3 text-sm border-t border-gray-100 pt-2">
                <p className="text-gray-600 text-xs">Assigned to:</p>
                <p className="font-medium text-gray-900 truncate">
                  {request.assignedTo}
                </p>
                {request.contact && (
                  <p className="text-xs text-gray-500 truncate">
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
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {hasMultipleProperties && (
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Property & Unit
                </th>
              )}
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Subject
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onRequestClick(request)}
              >
                {hasMultipleProperties && (
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {request.property} - {request.unit}
                  </td>
                )}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.subject}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {request.date}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
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
