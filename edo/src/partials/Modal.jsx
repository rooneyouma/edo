import React from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  zIndex = 50,
  maxWidth = "sm:max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[${zIndex}] overflow-y-auto`}
      style={{ zIndex }}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/30 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full ${maxWidth}`}
        >
          {/* Close button - styled and positioned like in LandlordNotices.jsx */}
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          <div className="px-4 pt-12 pb-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
