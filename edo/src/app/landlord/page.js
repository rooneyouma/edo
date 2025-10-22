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
  TrendingUp,
  PieChart,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Calendar as CalendarComponent } from "../../components/ui/calendar";
import EnhancedCalendar from "../../components/landlord/EnhancedCalendar";
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
    icon: <Plus className="h-5 w-5" />,
    action: "openAddProperty",
  },
  {
    label: "Rent Reminders",
    icon: <Bell className="h-5 w-5" />,
    action: "openRentReminder",
  },
  {
    label: "Send Notice",
    icon: <FileText className="h-5 w-5" />,
    action: "openSendNotice",
  },
];

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

// Calendar Card Component
const CalendarCard = () => {
  return <EnhancedCalendar />;
};

const activityTimeline = [
  {
    type: "tenant",
    label: "New tenant added: John Doe",
    date: "Jul 3, 2024",
    icon: <Users className="h-5 w-5 text-yellow-600" />,
  },
  {
    type: "payment",
    label: "Received $2,400 rent",
    date: "Jul 2, 2024",
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
  },
  {
    type: "maintenance",
    label: "Maintenance completed: AC repair",
    date: "Jul 1, 2024",
    icon: <Wrench className="h-5 w-5 text-pink-600" />,
  },
  {
    type: "notice",
    label: "Notice sent: Lease renewal",
    date: "Jun 30, 2024",
    icon: <FileText className="h-5 w-5 text-blue-600" />,
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden lg:ml-64">
        {/* Site header */}
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 transition-all duration-200 overflow-y-auto">
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
                  Here's what's happening with your properties today.
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
                      if (action.action === "openAddProperty") {
                        setShowAddPropertyModal(true);
                      } else if (action.action === "openRentReminder") {
                        setShowRentReminderModal(true);
                      } else if (action.action === "openSendNotice") {
                        setShowSendNoticeModal(true);
                      }
                    }}
                    className="flex items-center justify-center sm:justify-start gap-2 bg-teal-700 rounded-lg px-3 py-3 sm:px-4 sm:py-4 transition-colors hover:bg-teal-800 cursor-pointer flex-1 min-w-[140px] sm:min-w-[200px] max-w-[250px]"
                  >
                    <div className="text-white flex-shrink-0">
                      {action.icon}
                    </div>
                    <span className="font-medium text-xs sm:text-sm text-white whitespace-nowrap overflow-hidden text-ellipsis text-center sm:text-left">
                      {action.label}
                    </span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-white ml-auto hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Analytics Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                Property Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <AnalyticsCard
                  title="Total Properties"
                  value="24"
                  icon={
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  }
                  color="bg-blue-100"
                  trend="+2 from last month"
                />
                <AnalyticsCard
                  title="Total Units"
                  value="120"
                  icon={
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  }
                  color="bg-indigo-100"
                  trend="+5 from last month"
                />
                <AnalyticsCard
                  title="Occupied Units"
                  value="95"
                  subtitle="79% occupancy rate"
                  icon={
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  }
                  color="bg-green-100"
                  trend="+3 from last month"
                />
                <AnalyticsCard
                  title="Vacant Units"
                  value="25"
                  icon={
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  }
                  color="bg-orange-100"
                  trend="-2 from last month"
                />
              </div>
            </div>

            {/* Financial Summary and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
              {/* Financial Summary Section */}
              <div className="lg:col-span-2">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  <FinancialCard
                    title="Total Monthly Rent"
                    amount="$120,000"
                    icon={
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    }
                    color="bg-purple-100"
                    change={{
                      type: "positive",
                      value: "+5.2% from last month",
                    }}
                  />
                  <FinancialCard
                    title="Collected This Month"
                    amount="$100,000"
                    icon={
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    }
                    color="bg-green-100"
                    change={{
                      type: "positive",
                      value: "83.3% collection rate",
                    }}
                  />
                  <FinancialCard
                    title="Pending Payments"
                    amount="$12,000"
                    icon={
                      <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    }
                    color="bg-yellow-100"
                    change={{ type: "negative", value: "10 units pending" }}
                  />
                  <FinancialCard
                    title="Overdue Payments"
                    amount="$8,000"
                    icon={
                      <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    }
                    color="bg-red-100"
                    change={{ type: "negative", value: "6 units overdue" }}
                  />
                </div>
              </div>

              {/* Calendar */}
              <div className="lg:row-span-1">
                <CalendarCard />
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
