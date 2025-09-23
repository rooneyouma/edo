"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TenantHeader from "../../../partials/tenant/TenantHeader";
import TenantSidebar from "../../../partials/tenant/TenantSidebar";
import { useRouter } from "next/navigation";
import {
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Globe,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  isAuthenticated,
  getStoredUser,
  getToken,
  storeUser,
} from "../../../utils/api";

const TenantSettings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const storedUser = getStoredUser();

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceUpdates: true,
    noticeAlerts: true,
    marketingEmails: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timezone: "America/New_York",
  });

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // React Query for fetching user data
  const { data: user = storedUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => getStoredUser(),
    enabled: !!getToken() && !!storedUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check authentication and initialize user data
  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push("/auth/signin?role=tenant&next=/tenant/settings");
      return;
    }

    if (user) {
      setProfileData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [router, user, isClient]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log("Profile data:", profileData);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // Handle notification settings update
    console.log("Notification settings:", notificationSettings);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    // Handle preferences update
    console.log("Preferences:", preferences);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="flex">
        <TenantSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <TenantHeader toggleSidebar={toggleSidebar} />
          <div className="h-[calc(100vh-4rem)]">
            <main className="h-full transition-all duration-200 overflow-y-auto">
              <div className="pl-3 pr-6 sm:pl-4 sm:pr-8 md:pl-6 md:pr-12 lg:pl-8 lg:pr-16 py-4">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Settings
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your account settings and preferences
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                  <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-8">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === tab.id
                              ? "border-teal-500 text-teal-600 dark:text-teal-400"
                              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                        >
                          <tab.icon className="w-5 h-5 mr-2" />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Profile Information
                      </h3>
                      <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  firstName: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  lastName: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Notification Preferences
                      </h3>
                      <form
                        onSubmit={handleNotificationSubmit}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          {Object.entries(notificationSettings).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                  </h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {key === "emailNotifications" &&
                                      "Receive notifications via email"}
                                    {key === "smsNotifications" &&
                                      "Receive notifications via SMS"}
                                    {key === "paymentReminders" &&
                                      "Get reminders for upcoming payments"}
                                    {key === "maintenanceUpdates" &&
                                      "Updates on maintenance requests"}
                                    {key === "noticeAlerts" &&
                                      "Alerts for new notices"}
                                    {key === "marketingEmails" &&
                                      "Promotional and marketing emails"}
                                  </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={(e) =>
                                      setNotificationSettings({
                                        ...notificationSettings,
                                        [key]: e.target.checked,
                                      })
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                                </label>
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Security Settings
                      </h3>
                      <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-6"
                      >
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={profileData.currentPassword}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  currentPassword: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-slate-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">
                        Application Preferences
                      </h3>
                      <form
                        onSubmit={handlePreferencesSubmit}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Theme
                            </label>
                            <select
                              value={preferences.theme}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  theme: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            >
                              <option value="system">System</option>
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Language
                            </label>
                            <select
                              value={preferences.language}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  language: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Date Format
                            </label>
                            <select
                              value={preferences.dateFormat}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  dateFormat: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            >
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Timezone
                            </label>
                            <select
                              value={preferences.timezone}
                              onChange={(e) =>
                                setPreferences({
                                  ...preferences,
                                  timezone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-slate-100"
                            >
                              <option value="America/New_York">
                                Eastern Time
                              </option>
                              <option value="America/Chicago">
                                Central Time
                              </option>
                              <option value="America/Denver">
                                Mountain Time
                              </option>
                              <option value="America/Los_Angeles">
                                Pacific Time
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSettings;
