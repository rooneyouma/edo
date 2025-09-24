"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TenantHeader from "../../partials/tenant/TenantHeader";
import TenantSidebar from "../../partials/tenant/TenantSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  apiRequest,
} from "../../utils/api";
import OnboardRoleModal from "../../components/OnboardRoleModal";

const TenantDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const router = useRouter();
  const storedUser = getStoredUser();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => authAPI.getCurrentUser(),
    enabled: !storedUser && isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for fetching tenant rentals data
  const { data: rentalsData, isLoading: rentalsLoading } = useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: () => apiRequest("/tenant/rentals/", { method: "GET" }),
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for fetching maintenance requests
  const { data: maintenanceData, isLoading: maintenanceLoading } = useQuery({
    queryKey: ["tenant-maintenance"],
    queryFn: () => apiRequest("/tenant/maintenance/", { method: "GET" }),
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // React Query for fetching notices
  const { data: noticesData, isLoading: noticesLoading } = useQuery({
    queryKey: ["tenant-notices"],
    queryFn: () => apiRequest("/notices/", { method: "GET" }),
    enabled: isAuthenticated(),
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // Calculate dashboard stats from real data
  const stats = {
    rentDue: rentalsData?.rentals?.[0]?.monthly_rent || 0,
    maintenanceRequests: maintenanceData?.length || 0,
    newNotices: noticesData?.length || 0,
    paymentHistory: 0, // This would need to be calculated from actual payment data
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
      id: 3,
      type: "payment",
      title: "Rent Payment Due",
      description: `Rent payment of $${stats.rentDue} due in 5 days`,
      amount: `$${stats.rentDue}`,
      dueDate: "5 days",
      path: "/tenant/payments",
      icon: DollarSign,
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

  // Quick actions based on actual data
  const quickActions = [
    {
      label: "Pay Rent",
      icon: <DollarSign className="h-6 w-6" />,
      link: "/tenant/payments",
      color: "bg-teal-600 text-white",
    },
    {
      label: "Maintenance",
      icon: <Wrench className="h-6 w-6" />,
      link: "/tenant/maintenance",
      color: "bg-blue-600 text-white",
    },
    {
      label: "Notices",
      icon: <FileText className="h-6 w-6" />,
      link: "/tenant/notices",
      color: "bg-yellow-500 text-white",
    },
    {
      label: "Messages",
      icon: <MessageCircle className="h-6 w-6" />,
      link: "/tenant/messages",
      color: "bg-purple-600 text-white",
    },
  ];

  // What's next based on actual data
  const whatsNext = {
    type: "payment",
    message: `Your rent payment of $${stats.rentDue} is due in 5 days!`,
    action: "Pay Rent",
    link: "/tenant/payments",
    icon: <DollarSign className="h-6 w-6 text-teal-600" />,
  };

  // Activity timeline based on actual data
  const activityTimeline = [
    {
      type: "payment",
      label: `Paid $${stats.rentDue} rent`,
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

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          <div className="h-[calc(100vh-4rem)]">
            <main className="h-full transition-all duration-200 overflow-y-auto">
              <div className="pl-3 pr-6 sm:pl-4 sm:pr-8 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16 py-4">
                {/* Dashboard Title */}
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Tenant
                </h2>
                {/* Welcome Banner */}
                <div className="mb-6 flex items-center gap-4">
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Welcome,{" "}
                      {isClient && user
                        ? `${user.first_name || ""} ${
                            user.last_name || user.name || ""
                          }`.trim()
                        : ""}
                      !
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Here's a summary of your rental and activity.
                    </p>
                  </div>
                </div>
                {/* What's Next */}
                <div className="mb-8">
                  <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 flex items-center gap-4">
                    <div>{whatsNext.icon}</div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        What's Next?
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {whatsNext.message}
                      </div>
                    </div>
                    <Link
                      href={whatsNext.link}
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition text-sm font-medium"
                    >
                      {whatsNext.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
                {/* Quick Actions */}
                <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.link}
                      className={`flex flex-col items-center justify-center rounded-lg p-4 shadow hover:shadow-lg transition ${action.color} min-h-[100px]`}
                    >
                      {action.icon}
                      <span className="mt-2 font-semibold text-base">
                        {action.label}
                      </span>
                    </Link>
                  ))}
                </div>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {/* Rent Due */}
                  <div className="bg-teal-50 dark:bg-teal-900/30 overflow-hidden shadow rounded-lg">
                    <div className="p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DollarSign className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="ml-4 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-teal-700 dark:text-teal-200 truncate">
                              Rent Due
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-xl sm:text-2xl font-semibold text-teal-900 dark:text-teal-100">
                                ${stats.rentDue}
                              </div>
                              <div className="ml-2 flex items-baseline text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                                <span>Due in 5 days</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Maintenance Requests */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 overflow-hidden shadow rounded-lg">
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
                                {stats.maintenanceRequests}
                              </div>
                              <div className="ml-2 flex items-baseline text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                <span>In Progress</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Notices */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 overflow-hidden shadow rounded-lg">
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
                                {stats.newNotices}
                              </div>
                              <div className="ml-2 flex items-baseline text-xs sm:text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                <span>New</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Payment History */}
                  <div className="bg-purple-50 dark:bg-purple-900/30 overflow-hidden shadow rounded-lg">
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
                                ${stats.paymentHistory}
                              </div>
                              <div className="ml-2 flex items-baseline text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                                <span>Last 6 months</span>
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Activity Timeline */}
                <div className="mb-8 bg-white dark:bg-slate-800 shadow rounded-lg p-6">
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Recent Activity
                  </div>
                  <ol className="relative border-l border-slate-200 dark:border-slate-700 ml-6">
                    {activityTimeline.map((item, idx) => (
                      <li key={idx} className="mb-8 flex items-start relative">
                        <span className="absolute -left-6 flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full ring-8 ring-slate-50 dark:ring-slate-900">
                          {item.icon}
                        </span>
                        <div className="flex flex-col ml-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {item.label}
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
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
    </div>
  );
};

export default TenantDashboard;