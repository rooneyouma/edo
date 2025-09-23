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

  // Mock tenant data - in a real app, this would come from an API
  const mockTenants = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      property: "Sunset Apartments",
      unit_number: "A-101",
      rent: 1200,
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 987-6543",
      property: "Mountain View Condos",
      unit_number: "B-205",
      rent: 1800,
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "m.brown@example.com",
      phone: "(555) 456-7890",
      property: "Riverside Townhomes",
      unit_number: "C-302",
      rent: 2200,
      status: "Pending",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 234-5678",
      property: "Downtown Lofts",
      unit_number: "D-404",
      rent: 1500,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "r.wilson@example.com",
      phone: "(555) 876-5432",
      property: "Garden Villas",
      unit_number: "E-501",
      rent: 2000,
      status: "Active",
    },
    {
      id: 6,
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@example.com",
      phone: "(555) 345-6789",
      property: "Sunset Apartments",
      unit_number: "A-103",
      rent: 1300,
      status: "Active",
    },
    {
      id: 7,
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "(555) 567-8901",
      property: "Mountain View Condos",
      unit_number: "B-204",
      rent: 1600,
      status: "Pending",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "(555) 789-0123",
      property: "Riverside Townhomes",
      unit_number: "C-301",
      rent: 2100,
      status: "Active",
    },
    {
      id: 9,
      name: "James Thompson",
      email: "james.t@example.com",
      phone: "(555) 901-2345",
      property: "Downtown Lofts",
      unit_number: "D-405",
      rent: 1700,
      status: "Inactive",
    },
    {
      id: 10,
      name: "Amanda Chen",
      email: "amanda.chen@example.com",
      phone: "(555) 012-3456",
      property: "Garden Villas",
      unit_number: "E-502",
      rent: 1950,
      status: "Active",
    },
    {
      id: 11,
      name: "Kevin Wright",
      email: "kevin.wright@example.com",
      phone: "(555) 234-5670",
      property: "Sunset Apartments",
      unit_number: "A-104",
      rent: 1250,
      status: "Pending",
    },
    {
      id: 12,
      name: "Jennifer Lopez",
      email: "jennifer.lopez@example.com",
      phone: "(555) 456-7801",
      property: "Mountain View Condos",
      unit_number: "B-301",
      rent: 1850,
      status: "Active",
    },
  ];

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getStoredUser(),
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
  const filteredTenants = mockTenants
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

      // Refresh the tenant list (you might want to use React Query here)
      console.log("Tenant updated successfully");

      setShowEditTenantModal(false);
      setTenantToEdit(null);
      // TODO: Refresh the tenant data
    } catch (error) {
      console.error("Error updating tenant:", error);
      // TODO: Show error notification
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting tenant:", tenantToDelete.id);

      await landlordTenantAPI.delete(tenantToDelete.id);

      console.log("Tenant deleted successfully");

      setShowDeleteModal(false);
      setTenantToDelete(null);
      // TODO: Refresh the tenant data
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

  const handleAddTenantSubmit = () => {
    setShowAddTenantModal(false);
    // The form will handle API calls and data refresh
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Tenants
              </h2>
              <button
                onClick={handleAddTenant}
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
                Add Tenant
              </button>
            </div>

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
            <TenantPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageInputValue={pageInputValue}
              onPageChange={handlePageChange}
              onPageInputChange={handlePageInputChange}
              onPageInputBlur={handlePageInputBlur}
            />
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
