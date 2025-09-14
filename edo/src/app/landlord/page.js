"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../partials/dashboard/LandlordSidebar";
import Header from "../../partials/dashboard/LandlordHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Wrench,
  DollarSign,
  FileText,
  MessageCircle,
  Plus,
  BarChart2,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  isAuthenticated,
  authAPI,
  getStoredUser,
  getToken,
  storeUser,
} from "../../utils/api";
import OnboardRoleModal from "../../components/OnboardRoleModal";

const quickActions = [
  {
    label: "Add Property",
    icon: <Plus className="h-6 w-6" />,
    link: "/landlord/properties",
    color: "bg-teal-600 text-white",
  },
  {
    label: "View Properties",
    icon: <Home className="h-6 w-6" />,
    link: "/landlord/properties",
    color: "bg-blue-600 text-white",
  },
  {
    label: "Tenants",
    icon: <Users className="h-6 w-6" />,
    link: "/landlord/tenants",
    color: "bg-yellow-500 text-white",
  },
  {
    label: "Payments",
    icon: <DollarSign className="h-6 w-6" />,
    link: "/landlord/payments",
    color: "bg-purple-600 text-white",
  },
  {
    label: "Maintenance",
    icon: <Wrench className="h-6 w-6" />,
    link: "/landlord/maintenance",
    color: "bg-pink-600 text-white",
  },
  {
    label: "Notices",
    icon: <FileText className="h-6 w-6" />,
    link: "/landlord/notices",
    color: "bg-green-600 text-white",
  },
];

const analyticsStats = [
  {
    label: "Total Properties",
    value: 24,
    icon: <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    color: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-100",
  },
  {
    label: "Occupied",
    value: 18,
    icon: <Users className="h-6 w-6 text-green-600 dark:text-green-400" />,
    color: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-900 dark:text-green-100",
  },
  {
    label: "Vacant",
    value: 6,
    icon: <Home className="h-6 w-6 text-red-600 dark:text-red-400" />,
    color: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-900 dark:text-red-100",
  },
  {
    label: "Tenants",
    value: 144,
    icon: <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
    color: "bg-yellow-50 dark:bg-yellow-900/30",
    text: "text-yellow-900 dark:text-yellow-100",
  },
  {
    label: "Maintenance",
    value: 8,
    icon: <Wrench className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
    color: "bg-pink-50 dark:bg-pink-900/30",
    text: "text-pink-900 dark:text-pink-100",
  },
  {
    label: "Payments (This Month)",
    value: "$100,000",
    icon: (
      <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
    ),
    color: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-900 dark:text-purple-100",
  },
  {
    label: "Occupancy Rate",
    value: "75%",
    icon: <BarChart2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
    color: "bg-teal-50 dark:bg-teal-900/30",
    text: "text-teal-900 dark:text-teal-100",
  },
];

const activityTimeline = [
  {
    type: "tenant",
    label: "New tenant added: John Doe",
    date: "Jul 3, 2024",
    icon: <Users className="h-5 w-5 text-yellow-500" />,
  },
  {
    type: "payment",
    label: "Received $2,400 rent",
    date: "Jul 2, 2024",
    icon: <DollarSign className="h-5 w-5 text-green-500" />,
  },
  {
    type: "maintenance",
    label: "Maintenance completed: AC repair",
    date: "Jul 1, 2024",
    icon: <Wrench className="h-5 w-5 text-pink-500" />,
  },
  {
    type: "notice",
    label: "Notice sent: Lease renewal",
    date: "Jun 30, 2024",
    icon: <FileText className="h-5 w-5 text-blue-500" />,
  },
];

const LandlordDashboard = () => {
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const storedUser = getStoredUser();

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getStoredUser(),
    enabled: !!getToken() && !!storedUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check authentication and roles on mount
  useEffect(() => {
    if (!getToken() || !user) {
      router.push("/auth/signin");
      return;
    }

    // Check for landlord role
    if (!user.roles || !user.roles.includes("landlord")) {
      setShowOnboardModal(true);
    }
  }, [router, user]);

  const handleOnboardSuccess = (updatedRoles) => {
    // Update user roles in state and localStorage
    const updatedUser = { ...user, roles: updatedRoles };
    storeUser(updatedUser);
    setShowOnboardModal(false);
  };

  // Construct display name with proper null checks
  const displayName = user
    ? user.first_name || user.last_name
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : user.email || "Landlord"
    : "Landlord";

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="h-[calc(100vh-4rem)]">
        <main className="h-full transition-all duration-200 lg:ml-64 overflow-y-auto">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Dashboard Title */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Property Manager
            </h2>
            {/* Welcome Banner */}
            <div className="mb-6 flex items-center gap-4">
              {user && user.avatar && (
                <img
                  src={user.avatar}
                  alt={displayName}
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome, {displayName}!
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Here's a summary of your properties and activity.
                </p>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
            {/* Analytics Grid */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsStats.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-center rounded-lg p-4 shadow hover:shadow-lg transition ${stat.color}`}
                >
                  <div className="mr-4">{stat.icon}</div>
                  <div>
                    <div className={`text-lg font-bold ${stat.text}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
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
      <OnboardRoleModal
        roleName="landlord"
        open={showOnboardModal}
        onClose={() => router.push("/")}
        onSuccess={handleOnboardSuccess}
        user={user ? { ...user, token: getToken() } : null}
      />
    </div>
  );
};

export default LandlordDashboard;
