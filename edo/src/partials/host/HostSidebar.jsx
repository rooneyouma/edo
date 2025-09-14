import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Building2,
  Calendar,
  DollarSign,
  Wrench,
  MessageSquare,
  FileText,
  Settings,
  Star,
  LogOut,
  BarChart2,
} from "lucide-react";
import EdoLogo from "../../components/EdoLogo";

const HostSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const navigation = [
    {
      name: "Home",
      href: "/dev-mode-host-dash-6983/",
      icon: Home,
    },
    {
      name: "Listings",
      href: "/dev-mode-host-dash-6983/listings",
      icon: Building2,
    },
    {
      name: "Bookings",
      href: "/dev-mode-host-dash-6983/bookings",
      icon: Calendar,
    },
    {
      name: "Payments",
      href: "/dev-mode-host-dash-6983/payments",
      icon: DollarSign,
    },
    {
      name: "Maintenance",
      href: "/dev-mode-host-dash-6983/maintenance",
      icon: Wrench,
    },
    {
      name: "Messages",
      href: "/dev-mode-host-dash-6983/messages",
      icon: MessageSquare,
    },
    {
      name: "Analytics",
      href: "/dev-mode-host-dash-6983/analytics",
      icon: BarChart2,
    },
    {
      name: "Reviews",
      href: "/dev-mode-host-dash-6983/reviews",
      icon: Star,
    },
    {
      name: "Settings",
      href: "/dev-mode-host-dash-6983/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } rounded-tr-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex-1 flex justify-center">
              <NavLink
                to="/dev-mode-host-dash-6983/"
                className="flex items-center"
              >
                <EdoLogo className="h-8 w-auto" />
              </NavLink>
            </div>
            <button
              className="lg:hidden text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <div className="border-t border-slate-200 dark:border-slate-700 mb-4"></div>
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
              onClick={() => {
                // Handle logout
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default HostSidebar;
