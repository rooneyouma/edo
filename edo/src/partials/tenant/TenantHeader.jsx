import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  AlertTriangle,
  FileText,
  DollarSign,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../components/ThemeToggle";
import { authAPI, getStoredUser } from "../../utils/api";

const TenantHeader = ({ toggleSidebar }) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(getStoredUser() || null);
  const searchModalRef = React.useRef(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const u = await authAPI.getCurrentUser();
        setUser(u);
      } catch {}
    }
    if (!user) fetchUser();
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Maintenance Update",
      message: "Your maintenance request has been approved",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment Reminder",
      message: "Rent payment is due in 5 days",
      time: "1 day ago",
      read: true,
    },
  ];

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
      description: "Rent payment of $1,200 due in 5 days",
      amount: "$1,200",
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Enhanced search filtering
  const filteredResults = searchResults.filter((result) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchableText =
      `${result.title} ${result.description} ${result.type}`.toLowerCase();
    return searchTerms.every((term) => searchableText.includes(term));
  });

  // Handle search result click
  const handleResultClick = (result) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(result.path);
  };

  // Handle click outside of search modal
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchOpen &&
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:border-b border-gray-200 dark:border-gray-700/60 lg:ml-64">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 lg:hidden"
              aria-controls="sidebar"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              type="button"
              className="p-1 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="sr-only">Search</span>
              <Search className="h-6 w-6" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-slate-800" />
                )}
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Notifications
                      </h3>
                    </div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                          !notification.read
                            ? "bg-violet-50 dark:bg-violet-900/20"
                            : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                      <Link
                        href="/tenant/notifications"
                        className="w-full text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user && user.profile_image_url ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.profile_image_url}
                    alt={user.first_name || user.name}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user &&
                        (user.first_name
                          ? user.first_name.charAt(0)
                          : user.name
                          ? user.name.charAt(0)
                          : "U")}
                    </span>
                  </div>
                )}
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Profile info */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user &&
                              (user.first_name
                                ? user.first_name.charAt(0)
                                : user.name
                                ? user.name.charAt(0)
                                : "U")}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {user && (user.first_name || user.name)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user && user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <Link
                      href="/tenant/settings"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-5 w-5 mr-3 text-slate-400" />
                      Settings
                    </Link>

                    <button
                      type="button"
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      onClick={() => {
                        // Handle logout
                        setIsProfileOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3 text-slate-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40">
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0">
              <div
                ref={searchModalRef}
                className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search for eviction notices, maintenance requests, payments..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm"
                        autoFocus
                      />
                    </div>

                    {/* Search results */}
                    {searchQuery && (
                      <div className="mt-4">
                        {filteredResults.length > 0 ? (
                          <div className="space-y-2">
                            {filteredResults.map((result) => {
                              const Icon = result.icon;
                              return (
                                <button
                                  key={result.id}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md focus:outline-none"
                                  onClick={() => handleResultClick(result)}
                                >
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          result.type === "eviction"
                                            ? "bg-red-100 dark:bg-red-900/30"
                                            : result.type === "maintenance"
                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                            : result.type === "notice"
                                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                                            : "bg-green-100 dark:bg-green-900/30"
                                        }`}
                                      >
                                        <Icon
                                          className={`h-5 w-5 ${
                                            result.type === "eviction"
                                              ? "text-red-600 dark:text-red-400"
                                              : result.type === "maintenance"
                                              ? "text-blue-600 dark:text-blue-400"
                                              : result.type === "notice"
                                              ? "text-yellow-600 dark:text-yellow-400"
                                              : "text-green-600 dark:text-green-400"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                          {result.title}
                                        </p>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          {result.date}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {result.description}
                                      </p>
                                      <div className="mt-1 flex items-center space-x-2">
                                        {result.priority && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                            {result.priority}
                                          </span>
                                        )}
                                        {result.status && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {result.status}
                                          </span>
                                        )}
                                        {result.amount && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {result.amount} due in{" "}
                                            {result.dueDate}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              No results found for "{searchQuery}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TenantHeader;
