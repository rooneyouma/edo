import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const StartChatModal = ({ isOpen, onClose, tenants = [], onSelectTenant }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTenants, setFilteredTenants] = useState(tenants);

  useEffect(() => {
    if (tenants && Array.isArray(tenants)) {
      if (searchQuery.trim() === "") {
        // If search query is empty, show all tenants
        const sorted = [...tenants].sort((a, b) => {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return nameA.localeCompare(nameB);
        });
        setFilteredTenants(sorted);
      } else {
        // Filter tenants based on search query
        const filtered = tenants.filter(
          (tenant) => {
            // Convert all values to lowercase strings for comparison
            const query = searchQuery.toLowerCase();
            const name = (tenant.name || "").toLowerCase();
            const email = (tenant.email || "").toLowerCase();
            const property = (tenant.property || "").toLowerCase();
            const unit = (tenant.unit || "").toLowerCase();
            
            // Check if any field contains the search query
            return name.includes(query) || 
                   email.includes(query) || 
                   property.includes(query) || 
                   unit.includes(query);
          }
        );
        
        // Sort filtered results
        const sorted = filtered.sort((a, b) => {
          const nameA = a.name || "";
          const nameB = b.name || "";
          return nameA.localeCompare(nameB);
        });
        
        setFilteredTenants(sorted);
      }
    }
  }, [searchQuery, tenants]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/30 dark:bg-gray-900/60 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Start New Chat
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Tenant List */}
          <div className="h-64 overflow-y-auto px-6 pb-4">
            {filteredTenants.length > 0 ? (
              <ul className="space-y-2">
                {filteredTenants.map((tenant) => (
                  <li key={tenant.id}>
                    <button
                      onClick={() => {
                        onSelectTenant(tenant);
                        onClose();
                      }}
                      className="flex w-full items-center space-x-3 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400">
                        <span className="text-sm font-medium">
                          {tenant.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tenant.property} - {tenant.unit}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No tenants found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No tenants match your search criteria."
                    : "You don't have any tenants to chat with yet."}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartChatModal;
