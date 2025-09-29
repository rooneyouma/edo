"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import TenantList from "../../../components/landlord/tenants/TenantList";
import TenantFilters from "../../../components/landlord/tenants/TenantFilters";
import TenantPagination from "../../../components/landlord/tenants/TenantPagination";
import TenantDetailModal from "../../../components/landlord/tenants/TenantDetailModal"; // Added import
import AddTenantForm from "../../../components/landlord/forms/AddTenantForm";
import EditTenantForm from "../../../components/landlord/forms/EditTenantForm";
import DeleteConfirmModal from "../../../components/landlord/notices/DeleteConfirmModal";
import ConsistentModal from "../../../components/landlord/modals/ConsistentModal";
import {
  isAuthenticated,
  getStoredUser,
  getToken,
  landlordTenantAPI,
} from "../../../utils/api";

const LandlordTenantsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantForModal, setTenantForModal] = useState(null);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [showEditTenantModal, setShowEditTenantModal] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const router = useRouter();
  const storedUser = getStoredUser();

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getStoredUser(),
    enabled: !!getToken() && !!storedUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for fetching tenants data
  const {
    data: tenantsData,
    isLoading: isTenantsLoading,
    isError: isTenantsError,
    error: tenantsError,
    refetch: refetchTenants,
  } = useQuery({
    queryKey: ["landlord-tenants"],
    queryFn: async () => {
      try {
        const data = await landlordTenantAPI.list();
        console.log("Tenants data received:", data);
        return data;
      } catch (error) {
        console.error("Error fetching tenants:", error);
        // Re-throw the error so React Query can handle it properly
        throw error;
      }
    },
    enabled: !!getToken() && !!storedUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check authentication on mount
  useEffect(() => {
    if (!getToken() || !user) {
      router.push("/auth/signin?role=landlord&next=/landlord/tenants");
      return;
    }

    // Check for landlord role
    if (!user.roles || !user.roles.includes("landlord")) {
      router.push("/landlord"); // Redirect to main landlord page for onboarding
    }
  }, [router, user]);

  // Filter and sort tenants
  const filteredTenants = (tenantsData?.results || tenantsData || [])
    .filter((tenant) => {
      const matchesSearch =
        !searchQuery ||
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.property.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;

      const matchesProperty =
        propertyFilter === "all" || tenant.property === propertyFilter;

      return matchesSearch && matchesStatus && matchesProperty;
    })
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return b.id - a.id;
      } else {
        return a.id - b.id;
      }
    });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = filteredTenants.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInputValue(newPage.toString());
    }
  };

  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  // Handle tenant actions
  const handleViewDetails = (tenant) => {
    setTenantForModal(tenant);
    setShowTenantModal(true);
  };

  const handleEditTenant = (tenant) => {
    setTenantToEdit(tenant);
    setShowEditTenantModal(true);
  };

  const handleDeleteTenant = (tenant) => {
    setTenantToDelete(tenant);
    setShowDeleteModal(true);
  };

  const handleEditTenantSubmit = async (formData) => {
    try {
      console.log("Updating tenant:", tenantToEdit.id, "with data:", formData);

      // Prepare the data for API call
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        property_id: formData.propertyId,
        unit_number: formData.unitNumber,
        rent_amount: parseFloat(formData.rentAmount) || 0,
        security_deposit: parseFloat(formData.securityDeposit) || 0,
        lease_type: formData.leaseType,
        lease_start_date: formData.startDate,
        lease_end_date: formData.endDate,
        emergency_contact_name: formData.emergencyContact.name,
        emergency_contact_phone: formData.emergencyContact.phone,
        emergency_contact_relationship: formData.emergencyContact.relationship,
      };

      await landlordTenantAPI.update(tenantToEdit.id, updateData);

      // Refresh the tenant list
      await refetchTenants();

      setShowEditTenantModal(false);
      setTenantToEdit(null);
    } catch (error) {
      console.error("Error updating tenant:", error);
      // TODO: Show error notification
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting tenant:", tenantToDelete.id);

      await landlordTenantAPI.delete(tenantToDelete.id);

      // Refresh the tenant list
      await refetchTenants();

      setShowDeleteModal(false);
      setTenantToDelete(null);
    } catch (error) {
      console.error("Error deleting tenant:", error);
      // TODO: Show error notification
    }
  };

  const handleAddTenant = () => {
    setShowAddTenantModal(true);
  };

  const handleAddTenantClose = () => {
    setShowAddTenantModal(false);
  };

  const handleAddTenantSubmit = async () => {
    setShowAddTenantModal(false);
    // Refresh the tenant data after adding a new tenant
    await refetchTenants();
  };

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the main component structure consistently to avoid hydration errors
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
            {/* Page Title and Add Button */}
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Tenants
                </h2>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                {/* Always render the button but conditionally disable it during loading */}
                <button
                  onClick={handleAddTenant}
                  disabled={isTenantsLoading}
                  className={`inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] w-full sm:w-auto ${
                    isTenantsLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4 fill-current opacity-50 shrink-0"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                  </svg>
                  <span className="ml-2">Add Tenant</span>
                </button>
              </div>
            </div>

            {/* Show badge if no tenants */}
            {!isTenantsLoading &&
              !isTenantsError &&
              filteredTenants.length === 0 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-blue-800 dark:text-blue-200">
                      {searchQuery ||
                      statusFilter !== "all" ||
                      propertyFilter !== "all"
                        ? "No tenants match your current filters."
                        : "You don't have any tenants yet. Add your first tenant to get started."}
                    </span>
                  </div>
                </div>
              )}

            {/* Loading state */}
            {isTenantsLoading && (
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    Loading tenants...
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {isTenantsError && (
              <div className="h-64 flex items-center justify-center">
                <div className="text-lg text-red-500 dark:text-red-400 text-center">
                  <p>Error loading tenants. Please try again later.</p>
                  {tenantsError && (
                    <p className="text-sm mt-2">
                      {tenantsError.message || "Unknown error occurred"}
                    </p>
                  )}
                  <button
                    onClick={() => refetchTenants()}
                    className="mt-4 px-4 py-2 bg-[#0d9488] text-white rounded-md hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] text-sm font-medium"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Main content when loaded */}
            {!isTenantsLoading && !isTenantsError && (
              <>
                {/* Filters */}
                <TenantFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  propertyFilter={propertyFilter}
                  setPropertyFilter={setPropertyFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />

                {/* Tenant List */}
                <div className="mt-6">
                  <TenantList
                    currentTenants={currentTenants}
                    getStatusColor={getStatusColor}
                    setTenantForModal={setTenantForModal}
                    setShowTenantModal={setShowTenantModal}
                    handleViewDetails={handleViewDetails}
                    handleEditTenant={handleEditTenant}
                    handleDeleteTenant={handleDeleteTenant}
                  />
                </div>

                {/* Pagination */}
                {filteredTenants.length > 0 && (
                  <TenantPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageInputValue={pageInputValue}
                    onPageChange={handlePageChange}
                    onPageInputChange={handlePageInputChange}
                    onPageInputBlur={handlePageInputBlur}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Tenant Detail Modal */}
      <TenantDetailModal
        tenant={tenantForModal}
        isOpen={showTenantModal}
        onClose={() => setShowTenantModal(false)}
      />

      {/* Add Tenant Modal */}
      <ConsistentModal
        isOpen={showAddTenantModal}
        onClose={handleAddTenantClose}
        title="Add New Tenant"
        maxWidth="max-w-4xl"
      >
        <AddTenantForm
          onClose={handleAddTenantClose}
          onSubmit={handleAddTenantSubmit}
        />
      </ConsistentModal>

      {/* Edit Tenant Modal */}
      <ConsistentModal
        isOpen={showEditTenantModal}
        onClose={() => {
          setShowEditTenantModal(false);
          setTenantToEdit(null);
        }}
        title="Edit Tenant"
        maxWidth="max-w-4xl"
      >
        <EditTenantForm
          tenant={tenantToEdit}
          onClose={() => {
            setShowEditTenantModal(false);
            setTenantToEdit(null);
          }}
          onSubmit={handleEditTenantSubmit}
        />
      </ConsistentModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTenantToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Tenant"
        message={`Are you sure you want to delete ${tenantToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default LandlordTenantsPage;
