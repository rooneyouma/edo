import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Transition from "../utils/Transition";

function DropdownNotifications({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600/80 rounded-full"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-current text-gray-500 dark:text-gray-400"
            d="M6.5 0C4.8 0 3.3.8 2.3 2H.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h.5V7l-1 3v2a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-2l-1-3V3h.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1.8c-1-1.2-2.5-2-4.2-2zm-5 4v9l2-2h8l2 2V4H1.5zM8 1c1.2 0 2.3.5 3.1 1.4-.9.2-1.8.3-2.7.3-.9 0-1.8-.1-2.7-.3.8-.9 1.9-1.4 3.1-1.4zm4 11l-1-1H5l-1 1H4z"
          />
        </svg>
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase pt-1.5 pb-2 px-3">
            Notifications
          </div>
          <ul>
            <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
              <Link
                className="block py-2 px-3 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                href="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    New property added
                  </span>{" "}
                  - Your new property listing has been approved.
                </span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                  2 hours ago
                </span>
              </Link>
            </li>
            <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
              <Link
                className="block py-2 px-3 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                href="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    Maintenance request
                  </span>{" "}
                  - A new maintenance request has been submitted.
                </span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                  4 hours ago
                </span>
              </Link>
            </li>
            <li className="border-b border-gray-200 dark:border-gray-700/60 last:border-0">
              <Link
                className="block py-2 px-3 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                href="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block">
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    Payment received
                  </span>{" "}
                  - You've received a payment of $2,400.
                </span>
                <span className="block text-xs font-normal text-gray-500 dark:text-gray-400 mt-1">
                  1 day ago
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownNotifications;
