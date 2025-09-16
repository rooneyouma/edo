import React, { useState, useRef, useEffect } from "react";

const RecordPaymentForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tenant: "",
    property: "",
    unit: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
    paymentType: "",
    referenceNumber: "",
    notes: "",
  });

  const [tenantSearchQuery, setTenantSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Mock tenant data - This should be replaced with actual API data
  const mockTenants = [
    {
      id: 1,
      name: "John Doe",
      property: "Sunset Apartments",
      unit: "A101",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      property: "Mountain View Condos",
      unit: "B202",
      email: "jane.smith@example.com",
    },
    {
      id: 3,
      name: "Bob Johnson",
      property: "Riverside Townhomes",
      unit: "C303",
      email: "bob.johnson@example.com",
    },
  ];

  // Filter tenants based on search query
  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(tenantSearchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(tenantSearchQuery.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "tenant") {
      setTenantSearchQuery(value);
      setShowDropdown(true);
    }
  };

  const handleTenantSelect = (tenant) => {
    setFormData({
      ...formData,
      tenant: tenant.name,
      property: tenant.property,
      unit: tenant.unit,
    });
    setTenantSearchQuery(tenant.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const paymentMethods = [
    "Cash",
    "Check",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Online Payment",
  ];

  const paymentTypes = [
    "Rent",
    "Security Deposit",
    "Late Fee",
    "Maintenance Fee",
    "Utility Bill",
    "Other",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Record Payment
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="tenant"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tenant
          </label>
          <div className="mt-1 relative" ref={dropdownRef}>
            <input
              type="text"
              id="tenant"
              name="tenant"
              value={tenantSearchQuery}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
              placeholder="Search by tenant name, property, or unit..."
              required
            />
            {showDropdown &&
              tenantSearchQuery &&
              filteredTenants.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {filteredTenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleTenantSelect(tenant)}
                    >
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {tenant.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {tenant.property} - Unit {tenant.unit}
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        <div>
          <label
            htmlFor="property"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Property
          </label>
          <input
            type="text"
            id="property"
            name="property"
            value={formData.property}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Unit
          </label>
          <input
            type="text"
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="paymentDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment Date
          </label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          >
            <option value="">Select Method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="paymentType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Payment Type
          </label>
          <select
            id="paymentType"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            required
          >
            <option value="">Select Type</option>
            {paymentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="referenceNumber"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Reference Number
          </label>
          <input
            type="text"
            id="referenceNumber"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Record Payment
        </button>
      </div>
    </form>
  );
};

export default RecordPaymentForm;
