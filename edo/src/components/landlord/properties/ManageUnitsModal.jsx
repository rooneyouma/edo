import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "../../../partials/Modal";
import AddUnitModal from "./AddUnitModal";
import { landlordPropertyAPI } from "../../../utils/api";
import { apiRequest } from "../../../utils/api";
import DeleteConfirmModal from "../notices/DeleteConfirmModal";

const EditIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditUnitModal = ({ isOpen, onClose, property, unit, onUnitUpdated }) => {
  const [formData, setFormData] = useState({
    unit_id: unit?.unit_id || "",
    floor: unit?.floor || "",
    bedrooms: unit?.bedrooms || 1,
    bathrooms: unit?.bathrooms || 1,
    rent_amount: unit?.rent_amount || "",
    security_deposit: unit?.security_deposit || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Always update form data when unit changes
  useEffect(() => {
    console.log("Unit changed, updating form data:", unit);
    setFormData({
      unit_id: unit?.unit_id || "",
      floor: unit?.floor || "",
      bedrooms: unit?.bedrooms || 1,
      bathrooms: unit?.bathrooms || 1,
      rent_amount: unit?.rent_amount || "",
      security_deposit: unit?.security_deposit || "",
    });
  }, [unit]);

  if (!isOpen || !property || !unit) return null;

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
        floor: formData.floor,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        rent_amount: formData.rent_amount ? Number(formData.rent_amount) : null,
        security_deposit: formData.security_deposit
          ? Number(formData.security_deposit)
          : null,
      };
      console.log("Updating unit with data:", unitData);
      await landlordPropertyAPI.updateUnit(unit, unitData, "PUT");

      if (onUnitUpdated) onUnitUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating unit:", err);
      setError("Failed to update unit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Edit Unit for {property.name}
          </h2>
        </div>
        <div>
          <label
            htmlFor="unit_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Unit ID
          </label>
          <input
            type="text"
            id="unit_id"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            required
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 sm:text-sm"
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
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ManageUnitsModal = ({
  isOpen,
  onClose,
  property: initialProperty,
  onUnitsUpdated,
}) => {
  const [property, setProperty] = useState(initialProperty);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [unitToEdit, setUnitToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingUnitId, setDeletingUnitId] = useState(null);
  const queryClient = useQueryClient();

  // React Query mutation for updating property data
  const updatePropertyMutation = useMutation({
    mutationFn: (propertyId) =>
      apiRequest(`/landlord/properties/${propertyId}/`, { method: "GET" }),
    onSuccess: (updatedProperty) => {
      setProperty(updatedProperty);
      if (onUnitsUpdated) onUnitsUpdated(updatedProperty);
      // Invalidate properties query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      console.error("Error updating property:", error);
    },
  });

  // React Query mutation for deleting units
  const deleteUnitMutation = useMutation({
    mutationFn: (unit) => landlordPropertyAPI.deleteUnit(unit),
    onSuccess: () => {
      updatePropertyMutation.mutate(property.id);
      setShowDeleteModal(false);
      setUnitToDelete(null);
    },
    onError: (error) => {
      setDeleteError("Failed to delete unit.");
      console.error("Error deleting unit:", error);
    },
  });

  useEffect(() => {
    setProperty(initialProperty);
  }, [initialProperty]);

  const handleEdit = (unit) => {
    setUnitToEdit(unit);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (unit) => {
    setUnitToDelete(unit);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!unitToDelete) return;
    setDeletingUnitId(unitToDelete.id);
    setDeleteLoading(true);
    setDeleteError(null);
    deleteUnitMutation.mutate(unitToDelete);
  };

  // Handler for after a unit is added
  const handleUnitAdded = async () => {
    updatePropertyMutation.mutate(property.id);
    setIsAddUnitModalOpen(false);
  };

  // Handler for after a unit is updated
  const handleUnitUpdated = async () => {
    updatePropertyMutation.mutate(property.id);
    setEditModalOpen(false);
  };

  if (!isOpen || !property) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      zIndex={60}
      maxWidth="sm:max-w-4xl"
    >
      <div className="space-y-6 w-full max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 relative mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            Manage Units for {property.name}
          </h2>
          <button
            onClick={() => setIsAddUnitModalOpen(true)}
            className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm font-medium"
          >
            + Add Unit
          </button>
        </div>
        {property.units && property.units.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedrooms
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bathrooms
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security Deposit
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {property.units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.unit_id || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.floor}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.bedrooms}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.bathrooms}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.rent_amount ? `Kes ${unit.rent_amount}` : "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                      {unit.security_deposit
                        ? `Kes ${unit.security_deposit}`
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 flex gap-2 items-center">
                      <button
                        className="text-violet-600 hover:text-violet-900 mr-2 cursor-pointer"
                        title="Edit Unit"
                        onClick={() => handleEdit(unit)}
                        aria-label="Edit Unit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        title="Delete Unit"
                        onClick={() => handleDeleteClick(unit)}
                        aria-label="Delete Unit"
                        disabled={deleteLoading && deletingUnitId === unit.id}
                      >
                        <DeleteIcon />
                      </button>
                      {deleteLoading && deletingUnitId === unit.id && (
                        <span className="ml-2 text-xs text-gray-500">
                          Deleting...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deleteError && (
              <div className="text-red-600 text-sm mt-2">{deleteError}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No units found for this property.
          </div>
        )}
        <AddUnitModal
          isOpen={isAddUnitModalOpen}
          onClose={() => setIsAddUnitModalOpen(false)}
          property={property}
          onUnitAdded={handleUnitAdded}
        />
        <EditUnitModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          property={property}
          unit={unitToEdit}
          onUnitUpdated={handleUnitUpdated}
        />
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setUnitToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Unit"
          message="Are you sure you want to delete this unit? This action cannot be undone."
        />
      </div>
    </Modal>
  );
};

export default ManageUnitsModal;
