import React from "react";

const NewMessageForm = ({
  newMessage,
  setNewMessage,
  tenantSearchQuery,
  setTenantSearchQuery,
  filteredTenants,
  setFilteredTenants,
  onSend,
  onCancel,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "recipient") {
      setTenantSearchQuery(value);
    }
  };

  const handleTenantSelect = (tenant) => {
    setNewMessage({
      ...newMessage,
      recipient: tenant.name,
      property: tenant.property,
      unit: tenant.unit || "",
    });
    setTenantSearchQuery(tenant.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.recipient || !newMessage.message) {
      return;
    }
    onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="recipient"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Recipient
        </label>
        <input
          type="text"
          id="recipient"
          name="recipient"
          value={tenantSearchQuery}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
          placeholder="Search by tenant name, property, or unit..."
          required
        />
        {tenantSearchQuery && filteredTenants.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
            {filteredTenants.map((tenant) => (
              <button
                key={tenant.id}
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleTenantSelect(tenant)}
              >
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {tenant.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {tenant.property} {tenant.unit && `- Unit ${tenant.unit}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="property"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Property
        </label>
        <input
          type="text"
          id="property"
          name="property"
          value={newMessage.property}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
          readOnly
        />
      </div>

      <div>
        <label
          htmlFor="unit"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Unit
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={newMessage.unit}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
          readOnly
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={newMessage.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100 py-2 px-3"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default NewMessageForm;
