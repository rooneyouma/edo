"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TenantHeader from "../../partials/tenant/TenantHeader";
import TenantSidebar from "../../partials/tenant/TenantSidebar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  AlertTriangle,
  Wrench,
  DollarSign,
  FileText,
  Calendar,
  MessageCircle,
  LifeBuoy,
  Gift,
  CheckCircle,
  ArrowRight,
  Home,
  Users,
  BarChart2,
  TrendingUp,
  PieChart,
  CreditCard,
  Plus,
  Bell,
} from "lucide-react";
import {
  isAuthenticated,
  authAPI,
  getStoredUser,
  becomeTenant,
  storeUser,
  tenantAPI,
  apiRequest,
} from "../../utils/api";
import OnboardRoleModal from "../../components/OnboardRoleModal";
import NewRequestModal from "../../components/tenant/maintenance/NewRequestModal";
import PayRentModal from "../../components/tenant/payments/PayRentModal";
import VacateNoticeModal from "../../components/tenant/notices/VacateNoticeModal";

// Modern Analytics Card Component
const AnalyticsCard = ({ title, value, icon, color, trend, subtitle }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-2 sm:p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
    {trend && (
      <div className="mt-2 sm:mt-3 flex items-center">
        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
        <span className="text-xs sm:text-sm text-green-600 ml-1">{trend}</span>
      </div>
    )}
  </div>
);

// Financial Summary Card Component
const FinancialCard = ({ title, amount, change, icon, color }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mt-1">
          {amount}
        </h3>
      </div>
      <div className={`p-2 sm:p-3 rounded-lg ${color}`}>{icon}</div>
    </div>
    {change && (
      <div className="mt-2 sm:mt-3">
        <span
          className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${
            change.type === "positive"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {change.value}
        </span>
      </div>
    )}
  </div>
);

const quickActions = [
  {
    label: "Pay Rent",
    icon: <DollarSign className="h-5 w-5" />,
    action: "openPayRent",
  },
  {
    label: "Request Maintenance",
    icon: <Wrench className="h-5 w-5" />,
    action: "openMaintenanceRequest",
  },
  {
    label: "Submit Vacate Notice",
    icon: <FileText className="h-5 w-5" />,
    action: "openVacateNotice",
  },
];

const activityTimeline = [
  {
    type: "payment",
    label: "Paid $1,200 rent",
    date: "Jul 1, 2024",
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
  },
  {
    type: "maintenance",
    label: "Submitted maintenance request",
    date: "Jul 2, 2024",
    icon: <Wrench className="h-5 w-5 text-blue-600" />,
  },
  {
    type: "notice",
    label: "Received building notice",
    date: "Jul 3, 2024",
    icon: <FileText className="h-5 w-5 text-yellow-600" />,
  },
  {
    type: "message",
    label: "Messaged landlord",
    date: "Jul 4, 2024",
    icon: <MessageCircle className="h-5 w-5 text-purple-600" />,
  },
];

const TenantDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showMaintenanceRequestModal, setShowMaintenanceRequestModal] =
    useState(false);
  const [maintenanceFormData, setMaintenanceFormData] = useState({});
  const [maintenanceErrors, setMaintenanceErrors] = useState({});
  const [submittingMaintenance, setSubmittingMaintenance] = useState(false);
  const [showPayRentModal, setShowPayRentModal] = useState(false);
  const [submittingPayRent, setSubmittingPayRent] = useState(false);
  const [showVacateNoticeModal, setShowVacateNoticeModal] = useState(false);
  const [submittingVacateNotice, setSubmittingVacateNotice] = useState(false);
  const router = useRouter();
  const storedUser = getStoredUser();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // React Query for fetching tenant properties
  const { data: propertiesData } = useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: async () => {
      try {
        const data = await tenantAPI.getRentals();
        const properties =
          data.rentals?.map((rental) => ({
            id: rental.id,
            name: rental.property_name,
            unit: rental.unit_number,
            propertyId: rental.property_id,
            unitId: rental.unit_id,
          })) || [];
        return properties;
      } catch (err) {
        console.error("Failed to load tenant properties:", err);
        return [];
      }
    },
    enabled: isAuthenticated(),
  });

  // Use React Query for fetching vacate requests
  const {
    data: vacateRequests = [],
    isLoading: vacateRequestsLoading,
    error: vacateRequestsError,
  } = useQuery({
    queryKey: ["vacateRequests"],
    queryFn: async () => {
      const data = await apiRequest("/vacate-requests/", { method: "GET" });
      if (Array.isArray(data)) {
        return data.map((request) => ({
          id: request.id,
          property: request.property_name,
          unit: request.unit_number,
          requestDate: request.created_at
            ? new Date(request.created_at).toLocaleDateString()
            : "",
          moveOutDate: request.move_out_date,
          reason: request.reason,
          status:
            request.status.charAt(0).toUpperCase() + request.status.slice(1), // Capitalize first letter
        }));
      }
      return [];
    },
    enabled: isAuthenticated(),
  });

  // Check for query parameters to open modals
  useEffect(() => {
    if (isClient) {
      const openPayRent = searchParams.get("openPayRent");
      const openVacateNotice = searchParams.get("openVacateNotice");

      if (openPayRent === "true") {
        setShowPayRentModal(true);
      }

      if (openVacateNotice === "true") {
        setShowVacateNoticeModal(true);
      }
    }
  }, [isClient, searchParams]);

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !storedUser && isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check authentication and roles on mount
  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push("/auth/signin?role=tenant&next=/tenant");
      return;
    }

    // Check for tenant role
    if (user && (!user.roles || !user.roles.includes("tenant"))) {
      setShowOnboardModal(true);
    }
  }, [router, user, isClient]);

  const handleOnboardSuccess = (updatedRoles) => {
    // Update user roles in state and localStorage
    const updatedUser = { ...user, roles: updatedRoles };
    storeUser(updatedUser);
    setShowOnboardModal(false);
  };

  const toggleSidebar = (open) => {
    setIsSidebarOpen(open !== undefined ? open : !isSidebarOpen);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // Enhanced search results with more context and proper navigation
  const searchResults = [
    {
      id: 1,
      type: "eviction",
      title: "Eviction Notice",
      description: "Notice of eviction proceedings for non-payment",
      date: "2 days ago",
      priority: "Urgent",
      path: "/tenant/notices",
      icon: AlertTriangle,
    },
    {
      id: 2,
      type: "maintenance",
      title: "Maintenance Request #123",
      description: "Plumbing issue in bathroom - In Progress",
      status: "In Progress",
      date: "3 days ago",
      path: "/tenant/maintenance",
      icon: Wrench,
    },
    {
      id: 4,
      type: "notice",
      title: "Building Maintenance Notice",
      description: "Annual building maintenance scheduled for next week",
      priority: "High",
      date: "1 day ago",
      path: "/tenant/notices",
      icon: FileText,
    },
  ];

  const filteredResults = searchResults.filter((result) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchableText =
      `${result.title} ${result.description} ${result.type}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  const handleResultClick = (result) => {
    setShowSearchResults(false);
    setSearchQuery("");
    router.push(result.path);
  };

  const handleMaintenanceSubmit = async (formData) => {
    setSubmittingMaintenance(true);
    setMaintenanceErrors({});

    try {
      // TODO: Implement actual API call to submit maintenance request
      console.log("Submitting maintenance request:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setShowMaintenanceRequestModal(false);

      // Reset form
      setMaintenanceFormData({});

      // Show success message (you might want to add a toast notification here)
      console.log("Maintenance request submitted successfully");
    } catch (error) {
      // Handle errors
      setMaintenanceErrors({
        general: "Failed to submit maintenance request. Please try again.",
      });
    } finally {
      setSubmittingMaintenance(false);
    }
  };

  const handlePayRentSubmit = async (formData) => {
    setSubmittingPayRent(true);

    try {
      // TODO: Implement actual API call to submit payment
      console.log("Submitting payment:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setShowPayRentModal(false);

      // Show success message (you might want to add a toast notification here)
      console.log("Payment submitted successfully");
    } catch (error) {
      // Handle errors
      console.error("Failed to submit payment:", error);
    } finally {
      setSubmittingPayRent(false);
    }
  };

  // Mutation for submitting vacate requests
  const createVacateRequestMutation = useMutation({
    mutationFn: (requestData) =>
      apiRequest("/vacate-requests/", {
        method: "POST",
        body: JSON.stringify(requestData),
      }),
    onSuccess: (newRequest) => {
      // Update the vacate requests list
      const formattedRequest = {
        id: newRequest.id,
        property: newRequest.property_name,
        unit: newRequest.unit_number,
        requestDate: newRequest.created_at
          ? new Date(newRequest.created_at).toLocaleDateString()
          : new Date().toLocaleDateString(),
        moveOutDate: newRequest.move_out_date,
        reason: newRequest.reason,
        status:
          newRequest.status.charAt(0).toUpperCase() +
          newRequest.status.slice(1),
      };

      // Update the query cache
      queryClient.setQueryData(["vacateRequests"], (oldData = []) => [
        ...oldData,
        formattedRequest,
      ]);

      // Close the form and reset
      setShowVacateNoticeModal(false);
    },
    onError: (error) => {
      console.error("Failed to submit vacate request:", error);
      // Display backend validation errors as styled messages
      // First check if the response is a direct array
      if (Array.isArray(error.response)) {
        // Handle array of errors
        console.error("Validation errors:", error.response);
      } else if (error && error.message) {
        console.error("Error message:", error.message);
      } else if (error && error.response) {
        if (typeof error.response === "object") {
          // Handle object with detail property
          if (error.response.detail) {
            console.error("Detail error:", error.response.detail);
          } else if (Array.isArray(error.response.non_field_errors)) {
            // Handle Django REST Framework validation errors
            console.error(
              "Non-field errors:",
              error.response.non_field_errors[0]
            );
          } else {
            // Handle other object formats
            const errorMessages = Object.values(error.response).flat();
            console.error(
              "Other errors:",
              Array.isArray(errorMessages)
                ? errorMessages[0]
                : errorMessages.join(" ")
            );
          }
        } else {
          console.error("Response error:", error.response);
        }
      } else {
        console.error(
          "General error:",
          "Failed to submit vacate request. Please try again."
        );
      }
    },
  });

  const handleVacateNoticeSubmit = async (formData) => {
    setSubmittingVacateNotice(true);

    try {
      // Submit the request using React Query mutation
      await createVacateRequestMutation.mutateAsync({
        move_out_date: formData.move_out_date,
        reason: formData.reason,
      });

      // Show success message (you might want to add a toast notification here)
      console.log("Vacate notice submitted successfully");
    } catch (error) {
      // Handle errors
      console.error("Failed to submit vacate notice:", error);
    } finally {
      setSubmittingVacateNotice(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        <TenantHeader toggleSidebar={toggleSidebar} />
        <main className="h-full transition-all duration-200 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
            {/* Welcome Banner with Profile Picture */}
            <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 w-full">
              {isClient && user && user.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt={user.first_name || user.name}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {isClient &&
                    user &&
                    (user.first_name
                      ? user.first_name.charAt(0)
                      : user.name
                      ? user.name.charAt(0)
                      : "U")}
                  {!isClient && "U"}
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  Welcome,{" "}
                  {isClient && user
                    ? `${user.first_name || ""} ${
                        user.last_name || user.name || ""
                      }`.trim()
                    : ""}
                  !
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Here's a summary of your rental activity.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 text-center">
                Quick Actions
              </h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (action.action === "openPayRent") {
                        setShowPayRentModal(true);
                      } else if (action.action === "openMaintenanceRequest") {
                        setShowMaintenanceRequestModal(true);
                      } else if (action.action === "openVacateNotice") {
                        setShowVacateNoticeModal(true);
                      }
                    }}
                    className="flex items-center gap-2 bg-teal-700 rounded-lg px-3 py-3 sm:px-4 sm:py-4 transition-colors hover:bg-teal-800 cursor-pointer flex-1 min-w-[140px] sm:min-w-[200px] max-w-[250px]"
                  >
                    <div className="text-white">{action.icon}</div>
                    <span className="font-medium text-xs sm:text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis">
                      {action.label}
                    </span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Analytics Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                Rental Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <AnalyticsCard
                  title="Active Rentals"
                  value={propertiesData?.length || "0"}
                  icon={
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  }
                  color="bg-blue-100"
                  trend="+1 from last month"
                />
                <AnalyticsCard
                  title="Maintenance Requests"
                  value="2"
                  icon={
                    <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  }
                  color="bg-indigo-100"
                  trend="1 in progress"
                />
                <AnalyticsCard
                  title="Notices"
                  value="1"
                  subtitle="New notice"
                  icon={
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  }
                  color="bg-green-100"
                  trend="1 unread"
                />
                <AnalyticsCard
                  title="Payment History"
                  value="$7,200"
                  icon={
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  }
                  color="bg-orange-100"
                  trend="Last 6 months"
                />
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                Financial Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                <FinancialCard
                  title="Monthly Rent"
                  amount="$1,200"
                  icon={
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  }
                  color="bg-purple-100"
                />
                <FinancialCard
                  title="Last Payment"
                  amount="$1,200"
                  icon={
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  }
                  color="bg-green-100"
                  change={{
                    type: "positive",
                    value: "On time",
                  }}
                />
                <FinancialCard
                  title="Next Due"
                  amount="$1,200"
                  icon={
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  }
                  color="bg-yellow-100"
                  change={{ type: "negative", value: "Due in 5 days" }}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                Recent Activity
              </h3>
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5">
                <ul className="space-y-3 sm:space-y-4">
                  {activityTimeline.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 sm:mr-3 mt-0.5 sm:mt-1">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-800">
                          {activity.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
                          {activity.date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Onboard Role Modal */}
      <OnboardRoleModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={handleOnboardSuccess}
        roleName="tenant"
      />

      {/* Maintenance Request Modal */}
      <NewRequestModal
        isOpen={showMaintenanceRequestModal}
        onClose={() => {
          setShowMaintenanceRequestModal(false);
          setMaintenanceErrors({});
        }}
        onSubmit={handleMaintenanceSubmit}
        formData={maintenanceFormData}
        setFormData={setMaintenanceFormData}
        errors={maintenanceErrors}
        submitting={submittingMaintenance}
      />

      {/* Pay Rent Modal */}
      <PayRentModal
        isOpen={showPayRentModal}
        onClose={() => setShowPayRentModal(false)}
        onSubmit={handlePayRentSubmit}
        submitting={submittingPayRent}
      />

      {/* Vacate Notice Modal */}
      <VacateNoticeModal
        isOpen={showVacateNoticeModal}
        onClose={() => setShowVacateNoticeModal(false)}
        tenantProperties={propertiesData || []}
        onSubmit={handleVacateNoticeSubmit}
        submitting={submittingVacateNotice}
      />
    </div>
  );
};

export default TenantDashboard;
