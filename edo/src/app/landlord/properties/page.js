"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import AddPropertyForm from "../../../components/landlord/forms/AddPropertyForm";
import PropertyList from "../../../components/landlord/properties/PropertyList";
import PropertyFilters from "../../../components/landlord/properties/PropertyFilters";
import DeleteConfirmModal from "../../../components/landlord/notices/DeleteConfirmModal";
import Modal from "../../../partials/Modal";
import { isAuthenticated, landlordPropertyAPI } from "../../../utils/api";
import { useRouter, usePathname } from "next/navigation";

const Properties = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // React Query for fetching properties
  const {
    data: properties = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => landlordPropertyAPI.list(),
    enabled: isAuthenticated(),
  });

  // React Query mutation for deleting properties
  const deletePropertyMutation = useMutation({
    mutationFn: (propertyId) => landlordPropertyAPI.delete(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsDeleteConfirmModalOpen(false);
      setPropertyToDelete(null);
    },
    onError: (err) => {
      console.error("Error deleting property:", err);
    },
  });

  // Handle error state from React Query
  const error = queryError ? "Failed to load properties." : null;

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
        <button
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          onClick={() =>
            router.push(
              `/auth/signin?role=landlord&next=${encodeURIComponent(pathname)}`
            )
          }
        >
          Proceed
        </button>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Improved filtering with useMemo for performance
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    return properties.filter((property) => {
      // Ensure we have valid data to filter on
      const propertyName = (property.name || "").toLowerCase();
      const propertyAddress = (property.address || "").toLowerCase();
      const propertyType = (property.type || "").toLowerCase();
      const search = (searchQuery || "").toLowerCase();

      // If no search query, only filter by type
      if (!search) {
        return (
          typeFilter === "all" || propertyType === typeFilter.toLowerCase()
        );
      }

      // Check if any property field matches the search query
      const matchesSearch =
        propertyName.includes(search) ||
        propertyAddress.includes(search) ||
        propertyType.includes(search);

      // Check if property matches type filter
      const matchesType =
        typeFilter === "all" || propertyType === typeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [properties, searchQuery, typeFilter]);

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    deletePropertyMutation.mutate(propertyToDelete.id);
  };

  const handleAddProperty = async (formData) => {
    // Transform formData to match backend model
    const propertyData = {
      name: formData.name,
      type: formData.type,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zip_code: formData.address.zipCode,
      description: formData.description,
    };
    try {
      const newProperty = await landlordPropertyAPI.create(propertyData);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsAddPropertyModalOpen(false);
      // Reset form data
      setSearchQuery("");
      setTypeFilter("all");
    } catch (err) {
      console.error("Error adding property:", err);
    }
  };

  const handleEditProperty = async (formData) => {
    if (!propertyToEdit) return;
    // Transform formData to match backend model
    const propertyData = {
      name: formData.name,
      type: formData.type,
      street: formData.address.street,
      city: formData.address.city,
      state: formData.address.state,
      zip_code: formData.address.zipCode,
      description: formData.description,
    };
    try {
      const updatedProperty = await landlordPropertyAPI.update(
        propertyToEdit.id,
        propertyData
      );
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setIsEditPropertyModalOpen(false);
      setPropertyToEdit(null);
    } catch (err) {
      console.error("Error updating property:", err);
    }
  };

  // Add this handler to update a property in the properties array
  const handleUnitsUpdated = (updatedProperty) => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        {/* Site header */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="grow">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Page header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Properties
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your properties and units
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => setIsAddPropertyModalOpen(true)}
                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto"
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Property</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <PropertyFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />

            {/* Property List or No Properties Message */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0d9488]"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Loading properties...
                </p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No properties found
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchQuery || typeFilter !== "all"
                    ? "No properties match your search criteria."
                    : "Get started by adding a new property."}
                </p>
                {!searchQuery && typeFilter === "all" && (
                  <div className="mt-6">
                    <button
                      onClick={() => setIsAddPropertyModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Property
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto">
                <PropertyList
                  properties={filteredProperties}
                  onPropertyClick={() => {}}
                  onEdit={(property) => {
                    setPropertyToEdit(property);
                    setIsEditPropertyModalOpen(true);
                  }}
                  onDelete={(property) => {
                    setPropertyToDelete(property);
                    setIsDeleteConfirmModalOpen(true);
                  }}
                  onUnitsUpdated={handleUnitsUpdated}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {propertyToEdit ? "Edit Property" : "Add New Property"}
            </h2>
          </div>
          <AddPropertyForm
            property={propertyToEdit}
            onSubmit={handleAddProperty}
            onClose={() => setIsAddPropertyModalOpen(false)}
          />
        </div>
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEditPropertyModalOpen}
        onClose={() => {
          setIsEditPropertyModalOpen(false);
          setPropertyToEdit(null);
        }}
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Edit Property
            </h2>
          </div>
          <AddPropertyForm
            property={propertyToEdit}
            onSubmit={handleEditProperty}
            onClose={() => {
              setIsEditPropertyModalOpen(false);
              setPropertyToEdit(null);
            }}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={handleDeleteProperty}
        title="Delete Property"
        message={`Are you sure you want to delete ${
          propertyToDelete?.name || "this property"
        }? This action cannot be undone.`}
      />
    </div>
  );
};

export default Properties;
