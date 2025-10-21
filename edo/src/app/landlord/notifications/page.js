"use client";

import React, { useState, useEffect } from "react";
import LandlordHeader from "@/partials/dashboard/LandlordHeader.jsx";
import LandlordSidebar from "@/partials/dashboard/LandlordSidebar.jsx";
import {
  Bell,
  AlertTriangle,
  FileText,
  DollarSign,
  Wrench,
  Filter,
  ChevronDown,
  Home,
  Users,
} from "lucide-react";
import { isAuthenticated } from "@/utils/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Notifications = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAuthenticated_State, setIsAuthenticated_State] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock notifications data - landlord specific
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "maintenance",
      title: "New Maintenance Request",
      message:
        "Tenant Sarah Johnson submitted a new maintenance request for HVAC repair",
      time: "2 hours ago",
      read: false,
      icon: Wrench,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "Rent payment of $1,200 received from Michael Davis for Unit 3B",
      time: "1 day ago",
      read: true,
      icon: DollarSign,
    },
    {
      id: 3,
      type: "notice",
      title: "Eviction Notice Sent",
      message: "30-day eviction notice issued to Robert Wilson for non-payment",
      time: "2 days ago",
      read: false,
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: "property",
      title: "Property Inspection Due",
      message:
        "Annual inspection required for Sunset Apartments by end of month",
      time: "3 days ago",
      read: false,
      icon: Home,
    },
    {
      id: 5,
      type: "tenant",
      title: "Lease Renewal Reminder",
      message:
        "Emily Chen's lease expires in 45 days - renewal discussion needed",
      time: "4 days ago",
      read: true,
      icon: Users,
    },
    {
      id: 6,
      type: "payment",
      title: "Overdue Payment Alert",
      message: "Rent payment overdue for 5 days from David Brown - Unit 2A",
      time: "5 days ago",
      read: false,
      icon: DollarSign,
    },
  ]);

  // Handle authentication check after component mounts to avoid hydration mismatch
  useEffect(() => {
    setIsAuthenticated_State(isAuthenticated());
    setIsLoading(false);
  }, []);

  // Show loading state during initial hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated_State) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">
          Sign in required
        </h2>
        <p className="mb-6 text-slate-700">
          You must be signed in to access this page.
        </p>
        <Link
          href="/signin"
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          Proceed
        </Link>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNotificationClick = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case "eviction":
        return {
          container: "bg-red-50",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-800",
        };
      case "maintenance":
        return {
          container: "bg-blue-50",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-800",
        };
      case "payment":
        return {
          container: "bg-green-50",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-800",
        };
      case "property":
        return {
          container: "bg-purple-50",
          icon: "text-purple-600",
          badge: "bg-purple-100 text-purple-800",
        };
      case "tenant":
        return {
          container: "bg-indigo-50",
          icon: "text-indigo-600",
          badge: "bg-indigo-100 text-indigo-800",
        };
      default:
        return {
          container: "bg-yellow-50",
          icon: "text-yellow-600",
          badge: "bg-yellow-100 text-yellow-800",
        };
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true;
    return notification.type === filterType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.time) - new Date(a.time); // Most recent first
    }
    if (sortBy === "unread") {
      if (a.read === b.read) {
        return new Date(b.time) - new Date(a.time); // Most recent first
      }
      return a.read ? 1 : -1; // Unread first
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <LandlordSidebar
          sidebarOpen={isSidebarOpen}
          setSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 flex flex-col lg:ml-64">
          <LandlordHeader toggleSidebar={toggleSidebar} />
          {/* Main content */}
          <main className="flex-1 py-2 sm:py-4 pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16">
            {/* Page header - Title always at top on mobile */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl font-bold text-slate-900 text-slate-900">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500 text-slate-500">
                View and manage your landlord notifications
              </p>
            </div>
            {/* Controls row (filter/sort) - below title on mobile, right on desktop */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div className="flex items-center space-x-4 sm:ml-auto">
                {/* Filter dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 border-slate-300 text-sm font-medium rounded-md text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  {isFilterOpen && (
                    <div className="absolute left-0 right-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-w-xs sm:max-w-none">
                      <button
                        onClick={() => {
                          setFilterType("all");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "all"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        All Notifications
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("eviction");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "eviction"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Eviction Notices
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("maintenance");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "maintenance"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Maintenance Updates
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("payment");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "payment"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Payment Reminders
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("property");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "property"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Property Alerts
                      </button>
                      <button
                        onClick={() => {
                          setFilterType("tenant");
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterType === "tenant"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Tenant Updates
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 border-slate-300 text-sm font-medium rounded-md text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Sort
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  {isSortOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <button
                        onClick={() => {
                          setSortBy("date");
                          setIsSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortBy === "date"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Most Recent
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("unread");
                          setIsSortOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortBy === "unread"
                            ? "text-teal-600 text-teal-600 bg-teal-50 bg-teal-50"
                            : "text-slate-700 text-slate-700 hover:bg-slate-50 hover:bg-slate-50"
                        }`}
                      >
                        Unread First
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
              {sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification) => {
                  const styles = getNotificationStyles(notification.type);
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-4 rounded-lg ${styles.container} ${
                        !notification.read ? "border-l-4 border-teal-500" : ""
                      } cursor-pointer hover:bg-opacity-75 transition-colors duration-200`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`p-2 rounded-lg ${styles.container}`}>
                            <Icon className={`h-6 w-6 ${styles.icon}`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}
                              >
                                {notification.type.charAt(0).toUpperCase() +
                                  notification.type.slice(1)}
                              </span>
                              {!notification.read && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                                  New
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-slate-500 text-slate-500">
                              {notification.time}
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-medium text-slate-900 text-slate-900">
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 text-slate-500">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900 text-slate-900">
                    No notifications
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 text-slate-500">
                    You're all caught up! Check back later for new
                    notifications.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
