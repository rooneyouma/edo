import React, { useState, useEffect } from "react";

const PayRentModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    accountNumber: "",
    routingNumber: "",
    phoneNumber: "",
  });

  // Mock data for properties
  const properties = [
    {
      id: 1,
      address: "123 Main Street",
      unit: "Apartment 4B",
      rent: 1200,
      dueDate: "2024-04-01",
    },
    {
      id: 2,
      address: "456 Oak Avenue",
      unit: "Unit 12",
      rent: 900,
      dueDate: "2024-04-05",
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      id: "mpesa",
      name: "M-PESA",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      // If only one property, auto-select it
      if (properties.length === 1) {
        setSelectedProperty(properties[0]);
      } else {
        setSelectedProperty(null);
      }
      setSelectedPaymentMethod(null);
      setFormData({
        cardNumber: "",
        expiry: "",
        cvv: "",
        accountNumber: "",
        routingNumber: "",
        phoneNumber: "",
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      property: selectedProperty,
      paymentMethod: selectedPaymentMethod,
      ...formData,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 z-40 transition-opacity">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-slate-900">
                  Pay Rent
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {/* Property Selection */}
              {properties.length > 1 && !selectedProperty && (
                <div>
                  <label
                    htmlFor="property"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Select Property
                  </label>
                  <select
                    id="property"
                    name="property"
                    value={selectedProperty?.id || ""}
                    onChange={(e) => {
                      const property = properties.find(
                        (p) => p.id === parseInt(e.target.value)
                      );
                      setSelectedProperty(property);
                    }}
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.address} - {property.unit}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment Amount */}
              {selectedProperty && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">
                    Payment Amount
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Monthly Rent</span>
                      <span className="text-lg font-semibold text-slate-900">
                        ${selectedProperty.rent.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      Due by{" "}
                      {new Date(selectedProperty.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {selectedProperty && !selectedPaymentMethod && (
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-4">
                    Select Payment Method
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex items-center p-4 rounded-lg border ${
                          selectedPaymentMethod === method.id
                            ? "border-[#0d9488] bg-[#0d9488]/20"
                            : "border-slate-200 hover:border-[#0d9488]"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            selectedPaymentMethod === method.id
                              ? "bg-[#0d9488]/10 text-[#0d9488]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-900">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Form */}
              {selectedPaymentMethod && selectedProperty && (
                <div className="mt-6">
                  {selectedPaymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiry"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-slate-700 mb-1"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "bank" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="accountNumber"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Account Number
                        </label>
                        <input
                          type="text"
                          id="accountNumber"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your account number"
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="routingNumber"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          Routing Number
                        </label>
                        <input
                          type="text"
                          id="routingNumber"
                          name="routingNumber"
                          value={formData.routingNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your routing number"
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "mpesa" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-slate-700 mb-1"
                        >
                          M-PESA Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your M-PESA phone number"
                          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-[#0d9488] focus:ring-[#0d9488] sm:text-sm py-2 px-3"
                        />
                      </div>
                      <p className="text-sm text-slate-500">
                        You will receive a prompt on your phone to confirm the
                        payment.
                      </p>
                    </div>
                  )}

                  {selectedPaymentMethod === "paypal" && (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500 mb-4">
                        You will be redirected to PayPal to complete your
                        payment.
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                      >
                        Continue with PayPal
                      </button>
                    </div>
                  )}

                  <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-[#0d9488] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f766e] sm:ml-3 sm:w-auto"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting
                        ? "Processing..."
                        : `Pay $${selectedProperty.rent.toLocaleString()}`}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setSelectedPaymentMethod(null);
                      }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* Back button when property is selected but payment method isn't */}
              {selectedProperty && !selectedPaymentMethod && (
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                    onClick={() => {
                      if (properties.length > 1) {
                        setSelectedProperty(null);
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {properties.length > 1 ? "Back" : "Cancel"}
                  </button>
                </div>
              )}

              {/* Cancel button when no property is selected */}
              {!selectedProperty && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488]"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayRentModal;
