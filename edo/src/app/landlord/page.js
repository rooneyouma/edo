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
  Bell,
} from "lucide-react";
import {
  isAuthenticated,
  authAPI,
  getStoredUser,
  getToken,
  storeUser,
} from "../../utils/api";
import OnboardRoleModal from "../../components/OnboardRoleModal";
import RentReminderModal from "../../components/landlord/modals/RentReminderModal";
import AddPropertyModal from "../../components/landlord/modals/AddPropertyModal";
import SendNoticeModal from "../../components/landlord/modals/SendNoticeModal";

const quickActions = [
  {
    label: "Add Property",
    icon: <Plus className="h-6 w-6" />,
    action: "openAddProperty",
  },
  {
    label: "Rent Reminders",
    icon: <Bell className="h-6 w-6" />,
    action: "openRentReminder",
  },
  {
    label: "Send Notice",
    icon: <FileText className="h-6 w-6" />,
    action: "openSendNotice",
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
  const [isClient, setIsClient] = useState(false);
  const [showRentReminderModal, setShowRentReminderModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showSendNoticeModal, setShowSendNoticeModal] = useState(false);
  const router = useRouter();
  const storedUser = getStoredUser();

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Construct display name with proper null checks
  const displayName = user
    ? user.first_name || user.last_name
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : user.email || "Landlord"
    : "Landlord";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        {/* Site header */}
        <Header toggleSidebar={toggleSidebar} />
        <main className="h-full transition-all duration-200 overflow-y-auto">
          <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-8 w-full">
            {/* Welcome Banner with Profile Picture */}
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
                  Here's what's happening with your properties today.
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
                      if (action.action === "openAddProperty") {
                        setShowAddPropertyModal(true);
                      } else if (action.action === "openRentReminder") {
                        setShowRentReminderModal(true);
                      } else if (action.action === "openSendNotice") {
                        setShowSendNoticeModal(true);
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

            {/* Analytics and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Analytics Stats */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Analytics Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analyticsStats.map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.color} rounded-lg p-4 flex items-center`}
                    >
                      <div className="mr-3">{stat.icon}</div>
                      <div>
                        <p className={`text-2xl font-bold ${stat.text}`}>
                          {stat.value}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Recent Activity
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4">
                  <ul className="space-y-4">
                    {activityTimeline.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1">{activity.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {activity.label}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {activity.date}
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

      {/* Onboard Role Modal */}
      <OnboardRoleModal
        isOpen={showOnboardModal}
        onClose={() => setShowOnboardModal(false)}
        onSuccess={handleOnboardSuccess}
        roleName="landlord"
      />

      {/* Rent Reminder Modal */}
      <RentReminderModal
        isOpen={showRentReminderModal}
        onClose={() => setShowRentReminderModal(false)}
      />

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onSubmit={(data) => {
          console.log("Add property data:", data);
          // Here you would typically send the data to your backend
        }}
      />

      {/* Send Notice Modal */}
      <SendNoticeModal
        isOpen={showSendNoticeModal}
        onClose={() => setShowSendNoticeModal(false)}
        onSubmit={(data) => {
          console.log("Send notice data:", data);
          // Here you would typically send the data to your backend
        }}
      />
    </div>
  );
};

export default LandlordDashboard;
