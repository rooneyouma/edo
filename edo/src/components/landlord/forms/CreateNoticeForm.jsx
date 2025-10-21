import React, { useState } from "react";

const CreateNoticeForm = ({
  onSubmit,
  onClose,
  hideContainer = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          title: initialData.title || "",
          type: initialData.notice_type || initialData.type || "general",
          priority: initialData.priority || "normal",
          content: initialData.message || "",
          startDate: initialData.effective_date || initialData.startDate || "",
          endDate: initialData.endDate || "",
          targetAudience: initialData.targetAudience || "all", // 'all', 'property', 'tenant'
          selectedProperties: initialData.selectedProperties || [],
          selectedTenants: initialData.selectedTenants || [],
        }
      : {
          title: "",
          type: "general",
          priority: "normal",
          content: "",
          startDate: "",
          endDate: "",
          targetAudience: "all", // 'all', 'property', 'tenant'
          selectedProperties: [],
          selectedTenants: [],
        }
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data from your backend
  const mockProperties = [
    { id: 1, name: "Sunset Apartments", address: "123 Main St" },
    { id: 2, name: "Ocean View Condos", address: "456 Beach Ave" },
    { id: 3, name: "Mountain View Homes", address: "789 Hill Rd" },
    { id: 4, name: "Downtown Lofts", address: "321 City St" },
    { id: 5, name: "Garden Apartments", address: "654 Park Ave" },
  ];

  const mockTenants = [
    { id: 1, name: "John Doe", property: "Sunset Apartments", unit: "A101" },
    { id: 2, name: "Jane Smith", property: "Ocean View Condos", unit: "B202" },
    {
      id: 3,
      name: "Bob Johnson",
      property: "Mountain View Homes",
      unit: "C303",
    },
    { id: 4, name: "Alice Brown", property: "Downtown Lofts", unit: "D404" },
    {
      id: 5,
      name: "Charlie Wilson",
      property: "Garden Apartments",
      unit: "E505",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePropertySelect = (propertyId) => {
    setFormData((prev) => ({
      ...prev,
      selectedProperties: (prev.selectedProperties || []).includes(propertyId)
        ? (prev.selectedProperties || []).filter((id) => id !== propertyId)
        : [...(prev.selectedProperties || []), propertyId],
    }));
  };

  const handleTenantSelect = (tenantId) => {
    setFormData((prev) => ({
      ...prev,
      selectedTenants: (prev.selectedTenants || []).includes(tenantId)
        ? (prev.selectedTenants || []).filter((id) => id !== tenantId)
        : [...(prev.selectedTenants || []), tenantId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const filteredProperties = mockProperties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTenants = mockTenants.filter(
    (tenant) =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Notice Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Notice Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        >
          <option value="general">General</option>
          <option value="maintenance">Maintenance</option>
          <option value="payment">Payment</option>
          <option value="emergency">Emergency</option>
          <option value="policy">Policy Change</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Notice Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={formData.content}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Target Audience
        </label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="all"
              name="targetAudience"
              value="all"
              checked={formData.targetAudience === "all"}
              onChange={handleChange}
              className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300"
            />
            <label
              htmlFor="all"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              All Tenants
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="property"
              name="targetAudience"
              value="property"
              checked={formData.targetAudience === "property"}
              onChange={handleChange}
              className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300"
            />
            <label
              htmlFor="property"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Specific Properties
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="tenant"
              name="targetAudience"
              value="tenant"
              checked={formData.targetAudience === "tenant"}
              onChange={handleChange}
              className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300"
            />
            <label
              htmlFor="tenant"
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              Specific Tenants
            </label>
          </div>
        </div>
      </div>

      {(formData.targetAudience === "property" ||
        formData.targetAudience === "tenant") && (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={`Search ${
                formData.targetAudience === "property"
                  ? "properties"
                  : "tenants"
              }...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] bg-white text-gray-900 py-2 px-3 sm:text-sm"
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {formData.targetAudience === "property" ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={(formData.selectedProperties || []).includes(
                            property.id
                          )}
                          onChange={() => handlePropertySelect(property.id)}
                          className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.address}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={(formData.selectedTenants || []).includes(
                            tenant.id
                          )}
                          onChange={() => handleTenantSelect(tenant.id)}
                          className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tenant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tenant.property}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tenant.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          {initialData ? "Save Changes" : "Create Notice"}
        </button>
      </div>
    </form>
  );

  if (hideContainer) {
    return formContent;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? "Edit Notice" : "Create Notice"}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {formContent}
    </div>
  );
};

export default CreateNoticeForm;
