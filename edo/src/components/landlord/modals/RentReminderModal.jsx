import React, { useState } from "react";
import ConsistentModal from "./ConsistentModal";

const RentReminderModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    dueDate: "",
    reminderDate: "",
    priority: "normal",
    targetAudience: "all", // 'all', 'property', 'tenant'
    selectedProperties: [],
    selectedTenants: [],
  });

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
      selectedProperties: prev.selectedProperties.includes(propertyId)
        ? prev.selectedProperties.filter((id) => id !== propertyId)
        : [...prev.selectedProperties, propertyId],
    }));
  };

  const handleTenantSelect = (tenantId) => {
    setFormData((prev) => ({
      ...prev,
      selectedTenants: prev.selectedTenants.includes(tenantId)
        ? prev.selectedTenants.filter((id) => id !== tenantId)
        : [...prev.selectedTenants, tenantId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Rent reminder data:", formData);
    // Close the modal after submission
    onClose();
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

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Rent Reminder"
      maxWidth="sm:max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Reminder Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="reminderDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reminder Date
            </label>
            <input
              type="date"
              id="reminderDate"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="all"
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="property"
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 dark:border-gray-600"
              />
              <label
                htmlFor="tenant"
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 py-2 px-3 sm:text-sm"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {formData.targetAudience === "property" ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProperties.map((property) => (
                      <tr key={property.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={formData.selectedProperties.includes(
                              property.id
                            )}
                            onChange={() => handlePropertySelect(property.id)}
                            className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 dark:border-gray-600 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {property.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {property.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tenant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Unit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={formData.selectedTenants.includes(
                              tenant.id
                            )}
                            onChange={() => handleTenantSelect(tenant.id)}
                            className="h-4 w-4 text-[#0d9488] focus:ring-[#0d9488] border-gray-300 dark:border-gray-600 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {tenant.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {tenant.property}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
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
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
          >
            Send Reminder
          </button>
        </div>
      </form>
    </ConsistentModal>
  );
};

export default RentReminderModal;
