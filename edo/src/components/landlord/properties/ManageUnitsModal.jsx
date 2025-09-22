import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ConsistentModal from "../modals/ConsistentModal";
import AddUnitModal from "./AddUnitModal";
import AddTenantForm from "../forms/AddTenantForm";
import DynamicUnitForm from "./DynamicUnitForm";
import Modal from "../../../partials/Modal";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !property || !unit) return null;

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const unitData = {
        property: property.id,
        ...formData,
      };
      console.log("Updating unit with data:", unitData);
      await landlordPropertyAPI.updateUnit(unit, unitData, "PUT");

      if (onUnitUpdated) onUnitUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating unit:", err);
      setError("Failed to update unit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare initial data for the form
  const initialData = {
    unit_id: unit?.unit_id || "",
    floor: unit?.floor || "",
    bedrooms: unit?.bedrooms || 1,
    bathrooms: unit?.bathrooms || 1,
    rent_amount: unit?.rent_amount || "",
    security_deposit: unit?.security_deposit || "",
    status: unit?.status || "vacant",
  };

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Unit - ${property.name}`}
      maxWidth="max-w-4xl"
    >
      <DynamicUnitForm
        propertyType={property.type}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
        error={error}
        submitButtonText="Save Changes"
        isEdit={true}
      />
    </ConsistentModal>
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
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [selectedUnitForTenant, setSelectedUnitForTenant] = useState(null);
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

  const handleAddTenant = (unit) => {
    setSelectedUnitForTenant(unit);
    setShowAddTenantModal(true);
  };

  const handleAddTenantClose = () => {
    setShowAddTenantModal(false);
    setSelectedUnitForTenant(null);
  };

  const handleAddTenantSubmit = () => {
    setShowAddTenantModal(false);
    setSelectedUnitForTenant(null);
    // Refresh property data to update unit status
    updatePropertyMutation.mutate(property.id);
  };

  if (!isOpen || !property) return null;

  return (
    <ConsistentModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Units for ${property.name}`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-4 relative z-50">
        <div className="flex justify-end">
          <button
            onClick={() => setIsAddUnitModalOpen(true)}
            className="px-4 py-2 bg-[#0d9488] text-white rounded-md hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] text-sm font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Unit
          </button>
        </div>
        <div className="mt-4 space-y-4">
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
                      Status
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
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            unit.status === "vacant"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {unit.status === "vacant" ? "Vacant" : "Occupied"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 flex gap-2 items-center">
                        {unit.status === "vacant" && (
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-2 cursor-pointer"
                            title="Add Tenant"
                            onClick={() => handleAddTenant(unit)}
                            aria-label="Add Tenant"
                          >
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        )}
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

          {/* Add Tenant Modal */}
          <ConsistentModal
            isOpen={showAddTenantModal}
            onClose={handleAddTenantClose}
            title={`Add Tenant to Unit ${selectedUnitForTenant?.unit_id}`}
            maxWidth="max-w-4xl"
          >
            <AddTenantForm
              onClose={handleAddTenantClose}
              onSubmit={handleAddTenantSubmit}
              initialPropertyId={property?.id}
              initialUnitNumber={selectedUnitForTenant?.unit_id}
              initialUnitId={selectedUnitForTenant?.id}
            />
          </ConsistentModal>
        </div>
      </div>
    </ConsistentModal>
  );
};

export default ManageUnitsModal;
