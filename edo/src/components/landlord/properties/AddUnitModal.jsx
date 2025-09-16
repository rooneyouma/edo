import React, { useState } from "react";
import Modal from "../../../partials/Modal";
import { landlordPropertyAPI } from "../../../utils/api";

const AddUnitModal = ({ isOpen, onClose, property, onUnitAdded }) => {
  const [formData, setFormData] = useState({
    unit_id: "",
    floor: "",
    bedrooms: 1,
    bathrooms: 1,
    rent_amount: "",
    security_deposit: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !property) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const unitData = {
        property: property.id,
        unit_id: formData.unit_id,
        floor: formData.floor,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        rent_amount: formData.rent_amount ? Number(formData.rent_amount) : null,
        security_deposit: formData.security_deposit
          ? Number(formData.security_deposit)
          : null,
      };
      // Use the /units/ endpoint
      const response = await landlordPropertyAPI.createUnit(unitData);
      if (onUnitAdded) onUnitAdded(response);
      onClose();
    } catch (err) {
      setError("Failed to add unit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Added consistent modal container with proper background styling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Add Unit to {property.name}
            </h2>
          </div>
          <div>
            <label
              htmlFor="unit_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Unit
            </label>
            <input
              type="text"
              id="unit_id"
              name="unit_id"
              value={formData.unit_id}
              onChange={handleChange}
              required
              placeholder="e.g. A101, B-2, Penthouse#1"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Floor
            </label>
            <input
              type="text"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="bathrooms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="rent_amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Rent Amount
            </label>
            <input
              type="number"
              id="rent_amount"
              name="rent_amount"
              value={formData.rent_amount}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="security_deposit"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Security Deposit
            </label>
            <input
              type="number"
              id="security_deposit"
              name="security_deposit"
              value={formData.security_deposit}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
            />
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Unit"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUnitModal;
