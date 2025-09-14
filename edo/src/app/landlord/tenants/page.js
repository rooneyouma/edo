"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Sidebar from "../../../partials/dashboard/LandlordSidebar";
import Header from "../../../partials/dashboard/LandlordHeader";
import TenantList from "../../../components/landlord/tenants/TenantList";
import TenantFilters from "../../../components/landlord/tenants/TenantFilters";
import TenantPagination from "../../../components/landlord/tenants/TenantPagination";
import { isAuthenticated, getStoredUser, getToken } from "../../../utils/api";

const LandlordTenantsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [propertyFilter, setPropertyFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState(1);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [tenantForModal, setTenantForModal] = useState(null);
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
      router.push("/auth/signin");
      return;
    }

    // Check for landlord role
    if (!user.roles || !user.roles.includes("landlord")) {
      router.push("/");
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
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTenants = filteredTenants.slice(startIndex, endIndex);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInputValue(newPage);
    }
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setPageInputValue(value);
    }
  };

  const handlePageInputBlur = () => {
    if (pageInputValue >= 1 && pageInputValue <= totalPages) {
      setCurrentPage(pageInputValue);
    } else {
      setPageInputValue(currentPage);
    }
  };

  // Handle tenant options click
  const handleOptionsClick = (e, tenantId) => {
    e.stopPropagation();
    // Handle options menu for tenant
    console.log("Options clicked for tenant:", tenantId);
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

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="h-[calc(100vh-4rem)]">
        <main className="h-full transition-all duration-200 lg:ml-64 overflow-y-auto">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Page Title */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Tenants
            </h2>

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
                handleOptionsClick={handleOptionsClick}
              />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <TenantPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageInputValue={pageInputValue}
                onPageChange={handlePageChange}
                onPageInputChange={handlePageInputChange}
                onPageInputBlur={handlePageInputBlur}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandlordTenantsPage;
