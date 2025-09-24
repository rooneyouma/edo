import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Wrench,
} from "lucide-react";
import EdoLogo from "../../components/EdoLogo";

function LandlordSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const navigation = [
    {
      name: "Home",
      href: "/landlord",
      icon: Home,
      current: pathname === "/landlord",
    },
    {
      name: "Properties",
      href: "/landlord/properties",
      icon: Building2,
      current: pathname === "/landlord/properties",
    },
    {
      name: "Tenants",
      href: "/landlord/tenants",
      icon: Users,
      current: pathname === "/landlord/tenants",
    },
    {
      name: "Maintenance",
      href: "/landlord/maintenance",
      icon: Wrench,
      current: pathname === "/landlord/maintenance",
    },
    {
      name: "Messages",
      href: "/landlord/messages",
      icon: MessageSquare,
      current: pathname === "/landlord/messages",
    },
    {
      name: "Notices",
      href: "/landlord/notices",
      icon: Bell,
      current: pathname === "/landlord/notices",
    },
    {
      name: "Payments",
      href: "/landlord/payments",
      icon: FileText,
      current: pathname === "/landlord/payments",
    },
    {
      name: "Notifications",
      href: "/landlord/notifications",
      icon: Bell,
      current: pathname === "/landlord/notifications",
    },
    {
      name: "Settings",
      href: "/landlord/settings",
      icon: Settings,
      current: pathname === "/landlord/settings",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } rounded-tr-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex-1 flex justify-center">
              <Link href="/landlord" className="flex items-center">
                <EdoLogo className="h-8 w-auto" />
              </Link>
            </div>
            <button
              className="lg:hidden text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
              onClick={() => setSidebarOpen(false)}
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
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? "bg-[#0d9488]/10 dark:bg-[#0d9488]/20 text-[#0d9488] dark:text-[#0d9488]"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
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
}

export default LandlordSidebar;
