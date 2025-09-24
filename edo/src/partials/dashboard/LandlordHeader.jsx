import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  AlertTriangle,
  FileText,
  DollarSign,
  Wrench,
  Home,
  Users,
} from "lucide-react";

import UserMenu from "../../components/DropdownProfile";
import ThemeToggle from "../../components/ThemeToggle";

function Header({ toggleSidebar, variant = "default" }) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchModalRef = React.useRef(null);

  // Mock notifications data - similar to tenant header
  const notifications = [
    {
      id: 1,
      title: "New Maintenance Request",
      message: "Tenant submitted a new maintenance request",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Rent Payment Received",
      message: "Payment of $1,200 received from John Doe",
      time: "1 day ago",
      read: true,
    },
  ];

  // Enhanced search results for landlord with comprehensive content
  const searchResults = [
    {
      id: 1,
      type: "maintenance",
      title: "Maintenance Request #456",
      description: "HVAC system repair needed - Unit 2A, Sunset Apartments",
      status: "Pending",
      date: "1 hour ago",
      tenant: "Sarah Johnson",
      property: "Sunset Apartments",
      path: "/landlord/maintenance",
      icon: Wrench,
    },
    {
      id: 2,
      type: "payment",
      title: "Rent Payment Overdue",
      description: "Monthly rent payment overdue - Unit 3B",
      amount: "KES 1,500",
      overdue: "5 days",
      tenant: "Michael Davis",
      property: "Garden View Complex",
      path: "/landlord/payments",
      icon: DollarSign,
    },
    {
      id: 3,
      type: "notice",
      title: "Eviction Notice Sent",
      description: "30-day eviction notice issued for non-payment",
      priority: "High",
      date: "2 days ago",
      tenant: "Robert Wilson",
      property: "Parkside Residences",
      path: "/landlord/notices",
      icon: AlertTriangle,
    },
    {
      id: 4,
      type: "property",
      title: "Sunset Apartments",
      description: "15 units, 2 vacant - Downtown location",
      units: "15 total, 2 vacant",
      location: "Downtown",
      path: "/landlord/properties",
      icon: Home,
    },
    {
      id: 5,
      type: "tenant",
      title: "Emily Chen",
      description: "Unit 1A, Sunset Apartments - Lease expires Dec 2024",
      unit: "1A",
      property: "Sunset Apartments",
      leaseExpiry: "Dec 2024",
      path: "/landlord/tenants",
      icon: Users,
    },
    {
      id: 6,
      type: "notification",
      title: "Monthly Report Ready",
      description: "November 2024 financial report is now available",
      date: "3 days ago",
      path: "/landlord/reports",
      icon: FileText,
    },
    {
      id: 7,
      type: "payment",
      title: "Payment Received",
      description: "Rent payment confirmed - Unit 4C",
      amount: "KES 1,200",
      tenant: "Lisa Anderson",
      property: "Maple Heights",
      date: "Today",
      path: "/landlord/payments",
      icon: DollarSign,
    },
    {
      id: 8,
      type: "maintenance",
      title: "Completed Repair",
      description: "Plumbing repair completed - Unit 1B",
      status: "Completed",
      tenant: "David Brown",
      property: "Ocean View Towers",
      date: "Yesterday",
      path: "/landlord/maintenance",
      icon: Wrench,
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Enhanced search filtering for landlord-specific content
  const filteredResults = searchResults.filter((result) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const searchableText = `${result.title} ${result.description} ${
      result.type
    } ${result.tenant || ""} ${result.property || ""} ${result.status || ""} ${
      result.priority || ""
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
    <header
      className={`sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 ${
        variant === "v2" || variant === "v3"
          ? "before:bg-white after:absolute after:h-px after:inset-x-0 after:top-full after:bg-gray-200 dark:after:bg-gray-700/60 after:-z-10"
          : "max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90"
      } ${variant === "v2" ? "dark:before:bg-gray-800" : ""} ${
        variant === "v3" ? "dark:before:bg-gray-900" : ""
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between h-16 ${
            variant === "v2" || variant === "v3"
              ? ""
              : "lg:border-b border-gray-200 dark:border-gray-700/60"
          }`}
        >
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
              className="p-1 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
                className="p-1 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
                            ? "bg-teal-50 dark:bg-teal-900/20"
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
                        href="/landlord/notifications"
                        className="w-full text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/*  Divider */}
            <hr className="w-px h-6 bg-gray-200 dark:bg-gray-700/60 border-none" />

            {/* Profile Menu */}
            <UserMenu align="right">
              <div className="py-1">
                <Link
                  href="/landlord/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg
                    className="w-4 h-4 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.714 14.7c-1.1-1.1-2.2-2.2-3.3-3.3l-1.6 1.6c1.1 1.1 2.2 2.2 3.3 3.3l1.6-1.6z"
                      fill="currentColor"
                    />
                    <path
                      d="M10.516 14.7c-1.1-1.1-2.2-2.2-3.3-3.3l-1.6 1.6c1.1 1.1 2.2 2.2 3.3 3.3l1.6-1.6z"
                      fill="currentColor"
                    />
                    <path
                      d="M6.457 14.7c-1.1-1.1-2.2-2.2-3.3-3.3l-1.6 1.6c1.1 1.1 2.2 2.2 3.3 3.3l1.6-1.6zM17.043 14.7c-1.1-1.1-2.2-2.2-3.3-3.3l-1.6 1.6c1.1 1.1 2.2 2.2 3.3 3.3l1.6-1.6z"
                      fill="currentColor"
                    />
                  </svg>
                  Settings
                </Link>
              </div>
            </UserMenu>
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
                        placeholder="Search properties, tenants, payments, maintenance, notices..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md leading-5 bg-white dark:bg-slate-800 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent sm:text-sm"
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
                                          result.type === "notice"
                                            ? "bg-red-100 dark:bg-red-900/30"
                                            : result.type === "maintenance"
                                            ? "bg-blue-100 dark:bg-blue-900/30"
                                            : result.type === "payment"
                                            ? "bg-green-100 dark:bg-green-900/30"
                                            : result.type === "property"
                                            ? "bg-purple-100 dark:bg-purple-900/30"
                                            : result.type === "tenant"
                                            ? "bg-indigo-100 dark:bg-indigo-900/30"
                                            : "bg-yellow-100 dark:bg-yellow-900/30"
                                        }`}
                                      >
                                        <Icon
                                          className={`h-5 w-5 ${
                                            result.type === "notice"
                                              ? "text-red-600 dark:text-red-400"
                                              : result.type === "maintenance"
                                              ? "text-blue-600 dark:text-blue-400"
                                              : result.type === "payment"
                                              ? "text-green-600 dark:text-green-400"
                                              : result.type === "property"
                                              ? "text-purple-600 dark:text-purple-400"
                                              : result.type === "tenant"
                                              ? "text-indigo-600 dark:text-indigo-400"
                                              : "text-yellow-600 dark:text-yellow-400"
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
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              result.status === "Completed"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : result.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                            }`}
                                          >
                                            {result.status}
                                          </span>
                                        )}
                                        {result.amount && (
                                          <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                              result.overdue
                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                            }`}
                                          >
                                            {result.amount}
                                            {result.overdue &&
                                              ` (${result.overdue} overdue)`}
                                          </span>
                                        )}
                                        {result.tenant && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            {result.tenant}
                                          </span>
                                        )}
                                        {result.property && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                            {result.property}
                                          </span>
                                        )}
                                        {result.units && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                            {result.units}
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
}

export default Header;
