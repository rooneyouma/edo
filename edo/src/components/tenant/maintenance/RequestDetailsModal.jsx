import React from "react";
import { X } from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
} from "../../../utils/maintenanceUtils";

const RequestDetailsModal = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500/50 dark:bg-gray-900/50 z-40">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 w-full">
            {/* Close button */}
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="mt-4 sm:mt-6 space-y-5">
              {/* Property Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Property Information
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {request.property} - {request.unit}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Description
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {request.description}
                </p>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Priority
                  </h4>
                  <p
                    className={`mt-1 text-sm ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Status
                  </h4>
                  <p
                    className={`mt-1 text-sm ${getStatusColor(request.status)}`}
                  >
                    {request.status}
                  </p>
                </div>
              </div>

              {/* Assigned Information - Only show if assigned */}
              {request.assignedTo && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Assigned To
                  </h4>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {request.assignedTo}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Contact: {request.contact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
