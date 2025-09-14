import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddUnitModal from "./AddUnitModal";
import Modal from "../../../partials/Modal";
import AddTenantForm from "../../forms/AddTenantForm";
import { apiRequest } from "../../../utils/api";
import ManageUnitsModal from "./ManageUnitsModal";

const PropertyList = ({
  properties,
  onPropertyClick,
  onEdit,
  onDelete,
  onUnitsUpdated,
}) => {
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isManageUnitsModalOpen, setIsManageUnitsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // React Query mutation for updating property data
  const updatePropertyMutation = useMutation({
    mutationFn: (propertyId) =>
      apiRequest(`/landlord/properties/${propertyId}/`, { method: "GET" }),
    onSuccess: (updatedProperty) => {
      if (onUnitsUpdated) {
        onUnitsUpdated(updatedProperty);
      }
      // Invalidate properties query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      console.error("Error updating property:", error);
    },
  });

  const handleAddUnitClick = (property, e) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setIsAddUnitModalOpen(true);
  };

  // Handler to refresh property units after adding a unit
  const handleUnitAdded = async (newUnit) => {
    if (!selectedProperty) return;
    updatePropertyMutation.mutate(selectedProperty.id);
  };

  return (
    <>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col group"
            onClick={() => onPropertyClick(property)}
          >
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-[#0d9488] dark:text-[#2dd4bf] mb-1 line-clamp-1">
                {property.name}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <span className="truncate">{property.address}</span>
              </p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                {property.type}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Units: {property.units?.length ?? 0}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                {property.description}
              </p>
              {/* Units List */}
              {false && property.units && property.units.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Units
                  </h4>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-900/40">
                    {property.units.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex flex-wrap items-center justify-between px-3 py-2 text-xs sm:text-sm"
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {unit.unit_number}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Floor: {unit.floor || "-"}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          {unit.bedrooms} bed / {unit.bathrooms} bath
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 font-semibold">
                          {unit.rent_amount ? `₦${unit.rent_amount}` : "-"}
                        </div>
                        <div className="text-gray-400 ml-2">
                          {unit.status
                            ? unit.status.charAt(0).toUpperCase() +
                              unit.status.slice(1)
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-3 border-t border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-slate-900/60">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property);
                }}
                className="cursor-pointer text-violet-600 hover:text-violet-900 dark:text-[#2dd4bf] dark:hover:text-[#0d9488] mr-2"
                title="Edit"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
                className="cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                title="Delete"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty(property);
                  setIsManageUnitsModalOpen(true);
                }}
                className="cursor-pointer text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 ml-2"
                title="Manage Units"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Add Tenant(s) Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty(property);
                  setIsAddTenantModalOpen(true);
                }}
                className="cursor-pointer text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 ml-2"
                title="Add Tenant(s)"
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
                    d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm6 8a6 6 0 00-12 0h12z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <ManageUnitsModal
        isOpen={isManageUnitsModalOpen}
        onClose={() => setIsManageUnitsModalOpen(false)}
        property={selectedProperty}
        onUnitsUpdated={onUnitsUpdated}
      />
      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        property={selectedProperty}
        onUnitAdded={handleUnitAdded}
      />
      {/* AddTenantsModal placeholder */}
      <Modal
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
      >
        <AddTenantForm
          onClose={() => setIsAddTenantModalOpen(false)}
          initialPropertyId={selectedProperty?.id}
          // Optionally pass initialUnitNumber if you want to pre-fill unit
          // initialUnitNumber={...}
          onSubmit={() => {
            // handle tenant submission
            setIsAddTenantModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default PropertyList;
