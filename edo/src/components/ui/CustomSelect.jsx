import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * CustomSelect Component
 *
 * A reusable custom dropdown/select component that replaces native select elements.
 * Note: This component does NOT render labels internally. Labels should be provided
 * externally by parent components to avoid double labels.
 *
 * @param {Array} options - Array of option objects with value and label properties
 * @param {*} value - Current selected value
 * @param {Function} onChange - Callback function when selection changes
 * @param {string} placeholder - Placeholder text when no option is selected
 * @param {string} id - HTML id attribute for the select element
 * @param {boolean} disabled - Whether the select is disabled
 * @param {string} className - Additional CSS classes to apply
 */
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  id,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the dropdown trigger AND the options dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update dropdown position when it opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const optionsHeight = Math.min(options.length * 40, 200); // Estimate height

      // Calculate position
      let top, bottom;
      if (spaceBelow < optionsHeight && rect.top > optionsHeight) {
        // Show above
        bottom = window.innerHeight - rect.top;
        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          width: rect.width,
          bottom: `${bottom}px`,
          marginBottom: "0.5rem",
          zIndex: 1000,
        });
      } else {
        // Show below
        top = rect.bottom;
        setDropdownStyle({
          position: "fixed",
          left: rect.left,
          width: rect.width,
          top: `${top}px`,
          marginTop: "0.5rem",
          zIndex: 1000,
        });
      }
    }
  }, [isOpen, options.length]);

  // Get display name for current value
  const getDisplayValue = (currentValue) => {
    if (!currentValue) return placeholder || "Select an option";

    const option = options.find((opt) => opt.value == currentValue); // Use == for type coercion
    return option ? option.label : currentValue;
  };

  // Handle selection change
  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="w-full">
        <button
          type="button"
          id={id}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between rounded-lg border bg-white text-gray-700 transition-colors duration-200 px-4 py-2 text-left ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#0d9488] focus:ring-opacity-20"
          }`}
        >
          <span className="truncate">{getDisplayValue(value)}</span>
          {isOpen ? (
            <svg
              className="h-5 w-5 ml-2 flex-shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: "rotate(180deg)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 ml-2 flex-shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
        {isOpen &&
          !disabled &&
          createPortal(
            <div
              ref={optionsRef}
              className="rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5"
              style={dropdownStyle}
            >
              <div
                className="py-1 max-h-60 overflow-y-auto"
                role="menu"
                aria-orientation="vertical"
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button" // Explicitly set type to prevent form submission
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      value == option.value // Use == for type coercion
                        ? "text-[#0d9488] bg-[#f0fdfa] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default CustomSelect;
