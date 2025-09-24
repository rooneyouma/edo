import React, { useState, useEffect } from "react";
import {
  getPropertyTypeConfig,
  getDefaultFormData,
  getFieldLayout,
} from "../../../utils/propertyTypeConfigs";
import {
  validateUnitForm,
  getPropertyTypeTips,
  getFieldHelpText,
} from "../../../utils/unitValidators";

const DynamicUnitForm = ({
  propertyType,
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  error = null,
  submitButtonText = "Save Unit",
  isEdit = false,
}) => {
  const config = getPropertyTypeConfig(propertyType);
  const [formData, setFormData] = useState(() => {
    const defaults = getDefaultFormData(propertyType);
    return { ...defaults, ...initialData };
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [validationWarnings, setValidationWarnings] = useState({});
  const [showTips, setShowTips] = useState(false);

  // Update form data when propertyType or initialData changes
  useEffect(() => {
    const defaults = getDefaultFormData(propertyType);
    const newFormData = { ...defaults, ...initialData };
    setFormData(newFormData);
    setValidationErrors({});
    setValidationWarnings({});
  }, [propertyType]);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (isEdit && initialData && Object.keys(initialData).length > 0) {
      const defaults = getDefaultFormData(propertyType);
      const newFormData = { ...defaults, ...initialData };
      setFormData(newFormData);
    }
  }, [
    isEdit,
    propertyType,
    initialData.unit_id,
    initialData.bedrooms,
    initialData.bathrooms,
    initialData.rent_amount,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear validation errors and warnings for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (validationWarnings[name]) {
      setValidationWarnings((prev) => {
        const newWarnings = { ...prev };
        delete newWarnings[name];
        return newWarnings;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data using advanced validator
    const validation = validateUnitForm(formData, propertyType);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Set warnings if any
    if (validation.hasWarnings) {
      setValidationWarnings(validation.warnings);
    }

    // Transform data for API (remove empty strings, convert numbers)
    const transformedData = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        // Skip empty values for optional fields
        const fieldConfig = config.fields[key];
        if (!fieldConfig?.required) {
          return;
        }
      }

      // Convert numbers
      const fieldConfig = config.fields[key];
      if (
        fieldConfig &&
        (fieldConfig.min !== undefined || fieldConfig.max !== undefined) &&
        fieldConfig.type !== "boolean"
      ) {
        transformedData[key] = value === "" ? null : Number(value);
      } else if (fieldConfig?.type === "boolean") {
        transformedData[key] = Boolean(value);
      } else {
        transformedData[key] = value;
      }
    });

    onSubmit(transformedData);
  };

  const renderField = (fieldName, fieldConfig, className = "") => {
    const hasError = validationErrors[fieldName];
    const hasWarning = validationWarnings[fieldName];
    const helpText = getFieldHelpText(fieldName, propertyType);
    const baseInputClass = `mt-1 block w-full rounded-md border shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 py-2 px-3 sm:text-sm ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : hasWarning
        ? "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
        : "border-slate-300 dark:border-slate-600"
    }`;

    const renderInput = () => {
      if (fieldConfig.type === "boolean") {
        return (
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={formData[fieldName] || false}
              onChange={handleChange}
              className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 rounded"
            />
            <label
              htmlFor={fieldName}
              className="ml-2 block text-sm text-gray-900 dark:text-gray-100"
            >
              {fieldConfig.label}
            </label>
          </div>
        );
      }

      if (fieldName === "status") {
        return (
          <select
            id={fieldName}
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleChange}
            required={fieldConfig.required}
            className={baseInputClass}
          >
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
        );
      }

      if (fieldName === "rent_amount" || fieldName === "security_deposit") {
        return (
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">Kes</span>
            </div>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              value={formData[fieldName] || ""}
              onChange={handleChange}
              min={fieldConfig.min}
              max={fieldConfig.max}
              step={fieldConfig.step || "0.01"}
              required={fieldConfig.required}
              className={`${baseInputClass} pl-12`}
            />
          </div>
        );
      }

      if (fieldConfig.min !== undefined || fieldConfig.max !== undefined) {
        return (
          <input
            type="number"
            id={fieldName}
            name={fieldName}
            value={formData[fieldName] || ""}
            onChange={handleChange}
            min={fieldConfig.min}
            max={fieldConfig.max}
            step={fieldConfig.step || "1"}
            required={fieldConfig.required}
            className={baseInputClass}
          />
        );
      }

      return (
        <input
          type="text"
          id={fieldName}
          name={fieldName}
          value={formData[fieldName] || ""}
          onChange={handleChange}
          required={fieldConfig.required}
          placeholder={
            fieldName === "unit_id"
              ? config.unitIdPlaceholder
              : fieldName === "floor"
              ? config.floorPlaceholder
              : ""
          }
          readOnly={isEdit && fieldName === "unit_id"}
          className={`${baseInputClass} ${
            isEdit && fieldName === "unit_id"
              ? "bg-gray-100 dark:bg-gray-600"
              : ""
          }`}
        />
      );
    };

    if (fieldConfig.type === "boolean") {
      return (
        <div key={fieldName} className={className}>
          {renderInput()}
          {hasError && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors[fieldName]}
            </p>
          )}
          {hasWarning && (
            <p className="mt-1 text-sm text-yellow-600">
              {validationWarnings[fieldName]}
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={fieldName} className={className}>
        <label
          htmlFor={fieldName}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {fieldConfig.label}
          {helpText && (
            <span className="ml-2 text-xs text-gray-500 italic">
              ({helpText})
            </span>
          )}
        </label>
        {renderInput()}
        {hasError && (
          <p className="mt-1 text-sm text-red-600">
            {validationErrors[fieldName]}
          </p>
        )}
        {hasWarning && (
          <p className="mt-1 text-sm text-yellow-600">
            {validationWarnings[fieldName]}
          </p>
        )}
      </div>
    );
  };

  const fieldLayout = getFieldLayout(propertyType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Property Type Indicator */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#0d9488] rounded-full"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {config.name} Unit Configuration
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showTips ? "Hide Tips" : "Show Tips"}
          </button>
        </div>

        {showTips && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
              Tips for {config.name} Units:
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              {getPropertyTypeTips(propertyType).map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dynamic Fields Layout */}
      {fieldLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-6 ${
            row.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {row.map((fieldName) => {
            const fieldConfig = config.fields[fieldName];
            if (!fieldConfig) return null;

            return renderField(
              fieldName,
              fieldConfig,
              row.length === 1 ? "md:col-span-1" : ""
            );
          })}
        </div>
      ))}

      {/* Validation Warnings */}
      {Object.keys(validationWarnings).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">
                Suggestions for improvement:
              </h4>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                {Object.entries(validationWarnings).map(([field, warning]) =>
                  field === "general" ? (
                    Array.isArray(warning) ? (
                      warning.map((w, idx) => (
                        <li
                          key={`${field}-${idx}`}
                          className="flex items-start"
                        >
                          <span className="mr-2">•</span>
                          <span>{w}</span>
                        </li>
                      ))
                    ) : (
                      <li key={field} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{warning}</span>
                      </li>
                    )
                  ) : (
                    <li key={field} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        <strong>{config.fields[field]?.label}:</strong>{" "}
                        {warning}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Validation Error Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
            {Object.values(validationErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Updating..." : "Adding..."}
            </div>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicUnitForm;
