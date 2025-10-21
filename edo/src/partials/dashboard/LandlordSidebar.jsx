"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Wrench,
  CreditCard,
} from "lucide-react";
import EdoLogo from "../../components/EdoLogo";

function LandlordSidebar({ sidebarOpen, setSidebarOpen }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        mounted &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    if (mounted) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (mounted) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [sidebarOpen, setSidebarOpen, mounted]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && sidebarOpen && mounted) {
        setSidebarOpen(false);
      }
    };

    if (mounted) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      if (mounted) {
        document.removeEventListener("keydown", handleEscape);
      }
    };
  }, [sidebarOpen, setSidebarOpen, mounted]);

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
      name: "Notices",
      href: "/landlord/notices",
      icon: Bell,
      current: pathname === "/landlord/notices",
    },
    {
      name: "Payments",
      href: "/landlord/payments",
      icon: CreditCard,
      current: pathname === "/landlord/payments",
    },
    {
      name: "Messages",
      href: "/landlord/messages",
      icon: MessageSquare,
      current: pathname === "/landlord/messages",
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

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div
        className={`sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-tr-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex-1 flex justify-center">
              <div className="h-8 w-auto" /> {/* Placeholder for logo */}
            </div>
            <div className="lg:hidden">
              <div className="w-6 h-6" /> {/* Placeholder for close button */}
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-slate-700"
              >
                <div className="w-5 h-5 mr-3" /> {/* Placeholder for icon */}
                {item.name}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <div className="border-t border-slate-200 mb-4"></div>
            <div className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-slate-700">
              <div className="w-5 h-5 mr-3" /> {/* Placeholder for icon */}
              Sign Out
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      <div
        className={`sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
              className="lg:hidden text-slate-500 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
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
                    ? "bg-teal-100 text-teal-800"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 mt-auto">
            <div className="border-t border-slate-200 mb-4"></div>
            <button
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              onClick={() => {
                // Handle logout
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandlordSidebar;
