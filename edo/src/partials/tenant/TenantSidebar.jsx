import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EdoLogo from "../../components/EdoLogo";
import {
  Home,
  Building2,
  Wrench,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";

const TenantSidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-r-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-4">
            <div className="text-center w-full">
              <EdoLogo className="h-8 w-auto mx-auto" />
            </div>
            {/* Close button - only visible on mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6"
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
            <Link
              href="/tenant/"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname.includes("/tenant/dashboard")
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </Link>

            <Link
              href="/tenant/rentals"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname.includes("/tenant/rentals")
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Building2 className="w-5 h-5 mr-3" />
              My Rentals
            </Link>

            <Link
              href="/tenant/payments"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/payments"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <CreditCard className="w-5 h-5 mr-3" />
              Payments
            </Link>

            <Link
              href="/tenant/maintenance"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/maintenance"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Wrench className="w-5 h-5 mr-3" />
              Maintenance
            </Link>

            <Link
              href="/tenant/notices"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/notices"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notices
            </Link>

            <Link
              href="/tenant/messages"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/messages"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Messages
            </Link>

            <Link
              href="/tenant/notifications"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/notifications"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </Link>

            <Link
              href="/tenant/settings"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pathname === "/tenant/settings"
                  ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <div className="border-t border-slate-200 dark:border-slate-700 mb-4"></div>
            <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TenantSidebar;
