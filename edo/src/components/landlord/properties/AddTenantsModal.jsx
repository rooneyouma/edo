import React, { useState, React,useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../../utils/api";
import Modal from "../../../partials/Modal";

const AddTenantsModal = ({ isOpen, onClose, property }) => {
  const [tenants, setTenants] = useState([{ name: "", email: "", phone: "" }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  // React Query mutation for adding tenants
  const addTenantsMutation = useMutation({
    mutationFn: (payload) => apiRequest(`/landlord/properties/${property.id}/add-tenants/`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    onSuccess: () => {
      setSuccess(true);
      // Invalidate properties query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setTimeout(() => {
        onClose();
      }, 1200);
    },
    onError: (err) => {
      setError(
        err?.response?.message || err?.message || "Failed to add tenants."
      );
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      setTenants([{ name: "", email: "", phone: "" }]);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen || !property) return null;

  const handleChange = (idx, field, value) => {
    setTenants((prev) =>
      prev.map((tenant, i) =>
        i === idx ? { ...tenant, [field]: value } : tenant
      )
    );
  };

  const addRow = () =>
    setTenants((prev) => [...prev, { name: "", email: "", phone: "" }]);
  const removeRow = (idx) =>
    setTenants((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const payload = tenants
      .filter((tenant) => tenant.name.trim() && tenant.email.trim())
      .map((tenant) => ({
        name: tenant.name.trim(),
        email: tenant.email.trim(),
        phone: tenant.phone.trim() || null,
      }));

    if (payload.length === 0) {
      setError("Please enter at least one tenant with name and email.");
      return;
    }

    addTenantsMutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Add Tenant(s) to {property.name}
          </h2>
        </div>
        {tenants.map((tenant, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-2 items-center mb-2"
          >
            <input
              type="text"
              placeholder="Name"
              value={tenant.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
              required
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm px-2 py-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={tenant.email}
              onChange={(e) => handleChange(idx, "email", e.target.value)}
              required
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm px-2 py-1"
            />
            <input
              type="text"
              placeholder="Phone (optional)"
              value={tenant.phone}
              onChange={(e) => handleChange(idx, "phone", e.target.value)}
              className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm px-2 py-1"
            />
            {tenants.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="text-red-500 hover:text-red-700 ml-2"
                tabIndex={-1}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-[#0d9488] hover:text-[#0f766e] font-medium"
        >
          + Add another tenant
        </button>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 dark:text-green-400 text-sm">
            Tenants added!
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
            disabled={addTenantsMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addTenantsMutation.isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-60"
          >
            {addTenantsMutation.isLoading ? "Adding..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTenantsModal;
