"use client";

import React, { useState, useEffect } from "react";
import { authAPI } from "@/utils/api.js";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@example.com");
  const [phone, setPhone] = useState("+1 555-123-4567");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (e) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("Settings updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDeleteAccount = () => {
    setDeleteMessage("Account deletion is not implemented in this demo.");
    setTimeout(() => setDeleteMessage(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0f7fa] to-white py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-0 md:p-8 flex flex-col md:flex-row relative overflow-hidden">
        {/* Decorative Accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0d9488]/10 rounded-full z-0" />
        {/* Sidebar Tabs */}
        <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none z-10">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-4 text-left w-full font-semibold text-sm md:text-base transition-colors ${
              activeTab === "personal"
                ? "bg-white text-[#0d9488]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-4 text-left w-full font-semibold text-sm md:text-base transition-colors ${
              activeTab === "security"
                ? "bg-white text-[#0d9488]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-6 py-4 text-left w-full font-semibold text-sm md:text-base transition-colors ${
              activeTab === "notifications"
                ? "bg-white text-[#0d9488]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-6 py-4 text-left w-full font-semibold text-sm md:text-base transition-colors ${
              activeTab === "advanced"
                ? "bg-white text-[#0d9488]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Advanced
          </button>
        </div>
        {/* Tab Content */}
        <div className="flex-1 p-6 md:p-8 z-10">
          <h1 className="text-2xl font-extrabold mb-6 text-gray-900 tracking-tight md:hidden">
            Settings
          </h1>
          <form onSubmit={handleSave} className="space-y-8">
            {activeTab === "personal" && (
              <div>
                {/* Profile Avatar and Info */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full border-4 border-[#0d9488] shadow-lg overflow-hidden mb-2 bg-white">
                    {user?.profile_image_url ? (
                      <img
                        src={user.profile_image_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-[#0d9488] flex items-center justify-center w-full h-full bg-white">
                        {user?.first_name
                          ? user.first_name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-bold text-gray-900">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">
                  Personal Info
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  />
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">
                  Security
                </h2>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#0d9488] focus:border-[#0d9488] shadow-sm"
                  placeholder="Enter new password"
                />
              </div>
            )}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">
                  Notifications
                </h2>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="notifications"
                    className="block text-base text-gray-700"
                  >
                    Enable email notifications
                  </label>
                  <button
                    type="button"
                    onClick={() => setNotifications((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      notifications ? "bg-[#0d9488]" : "bg-gray-300"
                    }`}
                    aria-pressed={notifications}
                    id="notifications"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
            {activeTab !== "advanced" && (
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0f766e] transition-colors shadow"
              >
                Save Settings
              </button>
            )}
            {activeTab === "advanced" && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-1">
                  Advanced
                </h2>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow mt-4"
                >
                  Delete Account
                </button>
                {deleteMessage && (
                  <div className="mt-4 text-red-700 bg-red-100 border border-red-200 rounded-lg px-4 py-2 text-center font-medium shadow">
                    {deleteMessage}
                  </div>
                )}
              </div>
            )}
          </form>
          {message && (
            <div className="mt-6 text-green-700 bg-green-100 border border-green-200 rounded-lg px-4 py-2 text-center font-medium shadow">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
