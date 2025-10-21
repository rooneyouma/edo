import React, { useState, useEffect, useRef } from "react";

const EvictionNoticeForm = ({ onSubmit, onCancel, tenants = [] }) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    property: "",
    unit: "",
    reason: "",
    moveOutDeadline: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Filter tenants based on search query
  const filteredTenants = tenants.filter(
    (tenant) =>
      (tenant.name &&
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tenant.property &&
        tenant.property.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tenant.unit &&
        tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()))
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

    if (name === "tenantName") {
      setSearchQuery(value);
      setShowDropdown(true);
    }
  };

  const handleTenantSelect = (tenant) => {
    setFormData((prev) => ({
      ...prev,
      tenantName: tenant.name,
      property: tenant.property,
      unit: tenant.unit || "",
    }));
    setSearchQuery(tenant.name);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative" ref={dropdownRef}>
        <label
          htmlFor="tenantName"
          className="block text-sm font-medium text-gray-700"
        >
          Tenant
        </label>
        <input
          type="text"
          id="tenantName"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search by tenant name, unit or property"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
          required
        />
        {showDropdown && searchQuery && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
            {filteredTenants.length > 0 ? (
              <ul className="max-h-60 overflow-auto py-1">
                {filteredTenants.map((tenant) => (
                  <li
                    key={tenant.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTenantSelect(tenant)}
                  >
                    <div className="text-sm text-gray-900">{tenant.name}</div>
                    <div className="text-xs text-gray-500">
                      {tenant.property} {tenant.unit && `- Unit ${tenant.unit}`}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No tenants found
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="property"
          className="block text-sm font-medium text-gray-700"
        >
          Property
        </label>
        <input
          type="text"
          id="property"
          name="property"
          value={formData.property}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="unit"
          className="block text-sm font-medium text-gray-700"
        >
          Unit
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700"
        >
          Reason
        </label>
        <textarea
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="moveOutDeadline"
          className="block text-sm font-medium text-gray-700"
        >
          Move-out Deadline
        </label>
        <input
          type="date"
          id="moveOutDeadline"
          name="moveOutDeadline"
          value={formData.moveOutDeadline}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Send Notice
        </button>
      </div>
    </form>
  );
};

export default EvictionNoticeForm;
