import React from "react";
import { X, Calendar, Clock } from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
} from "../../../utils/maintenanceUtils";

const RequestDetailsModal = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/30 z-40">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header with title and close button */}
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {request.subject}
              </h3>
              <button
                type="button"
                className="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {/* Date and Time */}
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>{request.date}</span>
                </div>
                {request.time && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{request.time}</span>
                  </div>
                )}
              </div>

              {/* Property Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Property Information
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {request.property} - {request.unit}
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Description
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Priority
                  </h4>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {request.priority}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Status
                  </h4>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
              </div>

              {/* Assigned Information - Only show if assigned */}
              {request.assignedTo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Assigned To
                  </h4>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {request.assignedTo}
                    </p>
                    {request.contact && (
                      <p className="text-sm text-gray-500 mt-1">
                        Contact: {request.contact}
                      </p>
                    )}
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
