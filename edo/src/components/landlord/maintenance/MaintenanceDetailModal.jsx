import React from "react";
import Modal from "../../../partials/Modal";

const MaintenanceDetailModal = ({
  request,
  onClose,
  onAssignClick,
  onMarkComplete,
  onCancel,
  onReopen,
}) => {
  if (!request) return null;

  return (
    <Modal isOpen={!!request} onClose={onClose} maxWidth="sm:max-w-2xl">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {request.subject}
            </h3>
            <p className="text-sm text-gray-500">{request.date}</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1 text-sm text-gray-900">{request.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Tenant</h4>
              <p className="mt-1 text-sm text-gray-900">{request.tenant}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Property & Unit
              </h4>
              <p className="mt-1 text-sm text-gray-900">
                {request.property} - {request.unit}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Priority</h4>
              <p className="mt-1 text-sm text-gray-900">{request.priority}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <p className="mt-1 text-sm text-gray-900">{request.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
              <p className="mt-1 text-sm text-gray-900">{request.assignedTo}</p>
            </div>
          </div>

          {/* Image Gallery */}
          {request.images && request.images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {request.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Maintenance issue ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          {request.status === "In Progress" && (
            <button
              type="button"
              onClick={() => onMarkComplete(request)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mark as Complete
            </button>
          )}
          {(request.status === "Pending" ||
            request.status === "In Progress") && (
            <button
              type="button"
              onClick={() => onCancel(request)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Cancel
            </button>
          )}
          {(request.status === "Completed" ||
            request.status === "Cancelled") && (
            <button
              type="button"
              onClick={() => onReopen(request)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reopen
            </button>
          )}
          <button
            type="button"
            onClick={() => onAssignClick(request)}
            className={
              `inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ` +
              (request.status === "Completed"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : request.status === "Cancelled"
                ? "bg-[#0d9488] text-white opacity-60 cursor-not-allowed"
                : "bg-[#0d9488] text-white hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]")
            }
            disabled={
              request.status === "Completed" || request.status === "Cancelled"
            }
          >
            Assign
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MaintenanceDetailModal;
