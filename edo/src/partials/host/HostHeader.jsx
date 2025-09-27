import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Calendar,
  DollarSign,
  FileText,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, getStoredUser } from "../../utils/api";

const HostHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
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
      title: "New Booking",
      message: "New booking request for Beach House",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment Received",
      message: "Payment of $1,200 received for Mountain View Cabin",
      time: "1 day ago",
      read: true,
    },
  ];

  // Handle click outside for dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 before:absolute before:inset-0 before:backdrop-blur-md max-lg:before:bg-white/90 dark:max-lg:before:bg-gray-800/90 before:-z-10 z-30 max-lg:shadow-xs lg:before:bg-gray-100/90 dark:lg:before:bg-gray-900/90">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:border-b border-gray-200 dark:border-gray-700/60 lg:ml-64">
          {/* Left side */}
          <div className="flex">
            {/* Mobile menu button */}
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

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <span className="sr-only">Search</span>
              <Search className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                )}
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg ${
                            notification.read
                              ? "bg-gray-50 dark:bg-gray-700/50"
                              : "bg-teal-50 dark:bg-teal-900/20"
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
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
                <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user && (user.first_name || user.name)}
                </span>
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    <Link
                      to="/dev-mode-host-dash-6983/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout
                        navigate("/signin");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HostHeader;
