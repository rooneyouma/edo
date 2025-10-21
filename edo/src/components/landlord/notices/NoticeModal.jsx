import React from "react";
import Modal from "../../../partials/Modal";

const NoticeModal = ({
  isOpen,
  onClose,
  notice,
  getTypeColor,
  getStatusColor,
  type = "general", // 'general' or 'eviction'
}) => {
  if (!notice) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {type === "general" ? notice.title : "Eviction Notice Details"}
            </h3>
            {type === "general" ? (
              <p className="text-sm text-gray-500">{notice.date}</p>
            ) : (
              <p className="text-sm text-gray-500">Sent on {notice.dateSent}</p>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {type === "general" ? (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Type</h4>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getTypeColor(
                      notice.type
                    )}`}
                  >
                    {notice.type}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Unit</h4>
                <p className="mt-1 text-sm text-gray-900">{notice.unit}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Audience</h4>
                <p className="mt-1 text-sm text-gray-900">{notice.audience}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tenant</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {notice.tenantName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Property</h4>
                <p className="mt-1 text-sm text-gray-900">{notice.property}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Reason</h4>
                <p className="mt-1 text-sm text-gray-900">{notice.reason}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Move-Out Deadline
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {notice.moveOutDeadline}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                      notice.status
                    )}`}
                  >
                    {notice.status}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NoticeModal;
