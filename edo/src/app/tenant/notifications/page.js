"use client";

import React, { useState } from "react";
import TenantHeader from "@/partials/tenant/TenantHeader.jsx";
import TenantSidebar from "@/partials/tenant/TenantSidebar.jsx";
import {
  Bell,
  AlertTriangle,
  FileText,
  DollarSign,
  Wrench,
  Filter,
  ChevronDown,
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
  const router = useRouter();

  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="mb-6">You must be signed in to access this page.</p>
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

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "maintenance",
      title: "Maintenance Update",
      message:
        "Your maintenance request has been approved and scheduled for tomorrow",
      time: "2 hours ago",
      read: false,
      icon: Wrench,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Reminder",
      message: "Rent payment of $1,200 is due in 5 days",
      time: "1 day ago",
      read: true,
      icon: DollarSign,
    },
    {
      id: 3,
      type: "notice",
      title: "Building Maintenance Notice",
      message: "Annual building maintenance will be conducted next week",
      time: "2 days ago",
      read: false,
      icon: FileText,
    },
    {
      id: 4,
      type: "eviction",
      title: "Eviction Notice",
      message: "Notice of eviction proceedings for non-payment",
      time: "3 days ago",
      read: false,
      icon: AlertTriangle,
    },
  ]);

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
          container: "bg-red-50 dark:bg-red-900/20",
          icon: "text-red-600 dark:text-red-400",
          badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
      case "maintenance":
        return {
          container: "bg-blue-50 dark:bg-blue-900/20",
          icon: "text-blue-600 dark:text-blue-400",
          badge:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
      case "payment":
        return {
          container: "bg-green-50 dark:bg-green-900/20",
          icon: "text-green-600 dark:text-green-400",
          badge:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      default:
        return {
          container: "bg-yellow-50 dark:bg-yellow-900/20",
          icon: "text-yellow-600 dark:text-yellow-400",
          badge:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        };
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "all") return true;
    return notification.type === filterType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === "date") {
      return a.time.localeCompare(b.time);
    }
    if (sortBy === "unread") {
      if (a.read === b.read) {
        return a.time.localeCompare(b.time);
      }
      return a.read ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <TenantHeader toggleSidebar={toggleSidebar} />
      <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <main
        className={`lg:ml-64 pt-6 sm:pt-12 transition-all duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="pl-4 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-16 py-4 sm:py-8">
          {/* Page header - Title always at top on mobile */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and manage your notifications
            </p>
          </div>
          {/* Controls row (filter/sort) - below title on mobile, right on desktop */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="flex items-center space-x-4 sm:ml-auto">
              {/* Filter dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {isFilterOpen && (
                  <div className="absolute left-0 right-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-w-xs sm:max-w-none">
                    <button
                      onClick={() => {
                        setFilterType("all");
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        filterType === "all"
                          ? "text-[#0d9488] dark:text-[#0d9488] bg-[#0d9488]/10 dark:bg-[#0d9488]/10"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
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
                          ? "text-[#0d9488] dark:text-[#0d9488] bg-[#0d9488]/10 dark:bg-[#0d9488]/10"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
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
                          ? "text-[#0d9488] dark:text-[#0d9488] bg-[#0d9488]/10 dark:bg-[#0d9488]/10"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
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
                          ? "text-[#0d9488] dark:text-[#0d9488] bg-[#0d9488]/10 dark:bg-[#0d9488]/10"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      Payment Reminders
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("notice");
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        filterType === "notice"
                          ? "text-[#0d9488] dark:text-[#0d9488] bg-[#0d9488]/10 dark:bg-[#0d9488]/10"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      General Notices
                    </button>
                  </div>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Sort
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <button
                      onClick={() => {
                        setSortBy("date");
                        setIsSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        sortBy === "date"
                          ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
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
                          ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
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
            {sortedNotifications.map((notification) => {
              const styles = getNotificationStyles(notification.type);
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 rounded-lg ${styles.container} ${
                    !notification.read ? "border-l-4 border-violet-500" : ""
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {notification.time}
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
