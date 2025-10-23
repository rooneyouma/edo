import React, { useState, useEffect, useRef } from "react";
import { Filter } from "lucide-react";

/**
 * StyledDropdown Component
 *
 * A reusable custom dropdown/select component that replaces native select elements.
 *
 * @param {Array} options - Array of option objects with value and label properties
 * @param {*} value - Current selected value
 * @param {Function} onChange - Callback function when selection changes
 * @param {string} placeholder - Placeholder text when no option is selected
 * @param {string} label - Optional label text to display above the dropdown
 * @param {string} id - HTML id attribute for the select element
 */
const StyledDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get display name for current value
  const getDisplayValue = (currentValue) => {
    if (!currentValue) return placeholder || "Select an option";

    const option = options.find((opt) => opt.value === currentValue);
    return option ? option.label : currentValue;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="w-full">
        <button
          type="button"
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 px-4 py-2"
          title={label}
        >
          <span className="truncate">{getDisplayValue(value)}</span>
          <Filter className="h-5 w-5 ml-2 flex-shrink-0 text-gray-400" />
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    value === option.value
                      ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyledDropdown;
