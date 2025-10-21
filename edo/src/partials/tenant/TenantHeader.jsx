import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  AlertTriangle,
  FileText,
  DollarSign,
  Wrench,
  // Sun and Moon icons are no longer needed
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authAPI, getStoredUser } from "../../utils/api";
import { useTheme } from "../../contexts/ThemeContext";
import UserMenu from "../../components/DropdownProfile";

const TenantHeader = ({ toggleSidebar }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const searchModalRef = React.useRef(null);

  useEffect(() => {
    setIsClient(true);
    setUser(getStoredUser());

    async function fetchUser() {
      try {
        const u = await authAPI.getCurrentUser();
        setUser(u);
      } catch {}
    }

    const storedUser = getStoredUser();
    if (!storedUser) {
      fetchUser();
    }
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
      description: "Rent payment of KES 1,200 due in 5 days",
      amount: "KES 1,200",
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
    {
      id: 5,
      type: "payment",
      title: "Payment History",
      description: "View your complete payment history and receipts",
      date: "Always available",
      path: "/tenant/payments",
      icon: DollarSign,
    },
    {
      id: 6,
      type: "maintenance",
      title: "Submit Maintenance Request",
      description: "Report a new issue or problem with your unit",
      date: "Available anytime",
      path: "/tenant/maintenance",
      icon: Wrench,
    },
    {
      id: 7,
      type: "notification",
      title: "Lease Renewal Reminder",
      description: "Your lease expires in 3 months - action required",
      priority: "Important",
      date: "1 week ago",
      path: "/tenant/notifications",
      icon: FileText,
    },
    {
      id: 8,
      type: "notice",
      title: "Rent Increase Notice",
      description: "Annual rent adjustment effective next month",
      amount: "New rent: KES 1,300",
      date: "5 days ago",
      path: "/tenant/notices",
      icon: AlertTriangle,
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Enhanced search filtering
  const filteredResults = searchResults.filter((result) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchableText = `${result.title} ${result.description} ${
      result.type
    } ${result.priority || ""} ${result.status || ""} ${
      result.amount || ""
    }`.toLowerCase();
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
    <header className="sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 before:-z-10 z-30 max-lg:shadow-xs lg:before:bg-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:border-b border-gray-200">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              onClick={() => toggleSidebar(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              type="button"
              className="p-1 rounded-full text-slate-500 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 hover:bg-slate-100"
              onClick={() => setIsSearchOpen(true)}
            >
              <span className="sr-only">Search</span>
              <Search className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full text-slate-500 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 hover:bg-slate-100"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <h3 className="text-sm font-medium text-slate-900">
                        Notifications
                      </h3>
                    </div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-slate-50 ${
                          !notification.read ? "bg-teal-50" : ""
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 border-t border-slate-200">
                      <Link
                        href="/tenant/notifications"
                        className="w-full text-sm text-teal-600 hover:text-teal-700"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle - REMOVED */}

            {/* Divider */}
            <hr className="w-px h-6 bg-gray-200 border-none" />

            {/* Profile dropdown */}
            <UserMenu align="right" />
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
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
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
                        placeholder="Search notices, maintenance, payments, notifications, lease info..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent caret-slate-900 sm:text-sm"
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
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 rounded-md focus:outline-none"
                                  onClick={() => handleResultClick(result)}
                                >
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                          result.type === "eviction"
                                            ? "bg-red-100"
                                            : result.type === "maintenance"
                                            ? "bg-blue-100"
                                            : result.type === "notice"
                                            ? "bg-yellow-100"
                                            : result.type === "payment"
                                            ? "bg-green-100"
                                            : result.type === "notification"
                                            ? "bg-purple-100"
                                            : "bg-gray-100"
                                        }`}
                                      >
                                        <Icon
                                          className={`h-5 w-5 ${
                                            result.type === "eviction"
                                              ? "text-red-600"
                                              : result.type === "maintenance"
                                              ? "text-blue-600"
                                              : result.type === "notice"
                                              ? "text-yellow-600"
                                              : result.type === "payment"
                                              ? "text-green-600"
                                              : result.type === "notification"
                                              ? "text-purple-600"
                                              : "text-gray-600"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-900">
                                          {result.title}
                                        </p>
                                        <span className="text-xs text-slate-500">
                                          {result.date}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-500">
                                        {result.description}
                                      </p>
                                      <div className="mt-1 flex items-center space-x-2">
                                        {result.priority && (
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              result.priority === "Urgent"
                                                ? "bg-red-100 text-red-800"
                                                : result.priority ===
                                                  "Important"
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                          >
                                            {result.priority}
                                          </span>
                                        )}
                                        {result.status && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                            {result.status}
                                          </span>
                                        )}
                                        {result.amount && result.dueDate && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {result.amount} due in{" "}
                                            {result.dueDate}
                                          </span>
                                        )}
                                        {result.amount && !result.dueDate && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            {result.amount}
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
                            <p className="text-sm text-slate-500">
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
