"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import {
  isAuthenticated,
  authAPI,
  getStoredUser,
  becomeTenant,
  storeUser,
} from "../../utils/api";
import OnboardRoleModal from "../../components/OnboardRoleModal";
import NewRequestModal from "../../components/tenant/maintenance/NewRequestModal";
import PayRentModal from "../../components/tenant/payments/PayRentModal";
import VacateNoticeModal from "../../components/tenant/notices/VacateNoticeModal";

const sampleTenant = {
  name: "John Tenant",
  avatar: null,
};

const quickActions = [
  {
    label: "Pay Rent",
    icon: <DollarSign className="h-6 w-6" />,
    action: "openPayRent",
  },
  {
    label: "Send Maintenance Request",
    icon: <Wrench className="h-6 w-6" />,
    action: "openMaintenanceRequest",
  },
  {
    label: "Submit Vacate Notice",
    icon: <FileText className="h-6 w-6" />,
    action: "openVacateNotice",
  },
];

const activityTimeline = [
  {
    type: "payment",
    label: "Paid $1,200 rent",
    date: "Jul 1, 2024",
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
  },
  {
    type: "maintenance",
    label: "Submitted maintenance request",
    date: "Jul 2, 2024",
    icon: <Wrench className="h-5 w-5 text-blue-500" />,
  },
  {
    type: "notice",
    label: "Received building notice",
    date: "Jul 3, 2024",
    icon: <FileText className="h-5 w-5 text-yellow-500" />,
  },
  {
    type: "message",
    label: "Messaged landlord",
    date: "Jul 4, 2024",
    icon: <MessageCircle className="h-5 w-5 text-purple-500" />,
  },
];

const banner = {
  message: "Refer a friend and get a rent discount!",
  icon: <Gift className="h-8 w-8 text-pink-500" />,
  action: "Invite Now",
  link: "/tenant/referrals",
};

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

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleVacateNoticeSubmit = async (formData) => {
    setSubmittingVacateNotice(true);
    
    try {
      // TODO: Implement actual API call to submit vacate notice
      console.log("Submitting vacate notice:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      setShowVacateNoticeModal(false);

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
    <div className="h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          <div className="h-[calc(100vh-4rem)]">
            <main className="h-full transition-all duration-200 overflow-y-auto">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                {/* Dashboard Title */}

                {/* Welcome Banner */}
                <div className="mb-6 flex items-center gap-4 w-full">
                  {isClient && user && user.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.first_name || user.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold">
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
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Welcome,{" "}
                      {isClient && user
                        ? `${user.first_name || ""} ${
                            user.last_name || user.name || ""
                          }`.trim()
                        : ""}
                      !
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Here's a summary of your rental activity.
                    </p>
                  </div>
                </div>
                {/* Quick Actions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                    {quickActions.map((action, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (action.action === "openPayRent") {
                            setShowPayRentModal(true);
                          } else if (
                            action.action === "openMaintenanceRequest"
                          ) {
                            setShowMaintenanceRequestModal(true);
                          } else if (action.action === "openVacateNotice") {
                            setShowVacateNoticeModal(true);
                          }
                        }}
                        className="bg-teal-500/10 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-800 rounded-md p-3 flex flex-col items-center justify-center transition-colors hover:opacity-90 cursor-pointer min-h-[80px]"
                      >
                        <div className="text-teal-700 dark:text-teal-300">
                          {action.icon}
                        </div>
                        <span className="mt-2 font-medium text-xs text-slate-700 dark:text-slate-300 text-center">
                          {action.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                  {/* Maintenance Requests */}
                  <div
                    onClick={() => router.push("/tenant/maintenance")}
                    className="bg-blue-50 dark:bg-blue-900/30 overflow-hidden shadow-sm rounded-md hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-blue-700 dark:text-blue-200 truncate">
                              Maintenance Requests
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100">
                                2
                              </div>
                              <div className="ml-2 flex items-baseline text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                                <span>In Progress</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Notices */}
                  <div
                    onClick={() => router.push("/tenant/notices")}
                    className="bg-yellow-50 dark:bg-yellow-900/30 overflow-hidden shadow-sm rounded-md hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-yellow-700 dark:text-yellow-200 truncate">
                              New Notices
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-xl sm:text-2xl font-semibold text-yellow-900 dark:text-yellow-100">
                                1
                              </div>
                              <div className="ml-2 flex items-baseline text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                                <span>New</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Payment History */}
                  <div
                    onClick={() => router.push("/tenant/payments")}
                    className="bg-purple-50 dark:bg-purple-900/30 overflow-hidden shadow-sm rounded-md hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-purple-700 dark:text-purple-200 truncate">
                              Payment History
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-xl sm:text-2xl font-semibold text-purple-900 dark:text-purple-100">
                                $7,200
                              </div>
                              <div className="ml-2 flex items-baseline text-xs font-semibold text-purple-600 dark:text-purple-400">
                                <span>Last 6 months</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Recent Activity
                  </h3>
                  <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-md">
                    <div className="p-3">
                      <ul className="space-y-3">
                        {activityTimeline.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-0.5 flex-shrink-0">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight">
                                {item.label}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {item.date}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
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
        onSubmit={handleVacateNoticeSubmit}
        submitting={submittingVacateNotice}
      />
    </div>
  );
};

export default TenantDashboard;
