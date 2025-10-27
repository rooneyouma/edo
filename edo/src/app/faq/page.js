"use client";

import React, { useState } from "react";
import Link from "next/link";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I get started with edo?",
      answer:
        "Getting started is easy! Simply sign up for a free account, and you can begin listing your properties immediately. Our free plan allows you to list up to 3 properties.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. Payments are processed securely through our payment partner.",
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer:
        "Yes, you can change your plan at any time. When upgrading, you'll get immediate access to additional features. When downgrading, changes take effect at the end of your billing cycle.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take security seriously. All data is encrypted both in transit and at rest. We comply with industry standards and regularly audit our systems for vulnerabilities.",
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer:
        "Yes, we offer special pricing for non-profit organizations. Please contact our sales team with documentation of your non-profit status to receive a discount.",
    },
    {
      question: "How can I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from your account settings. Your subscription will remain active until the end of your current billing period.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.",
    },
    {
      question: "How often do you release new features?",
      answer:
        "We release updates and new features regularly. We typically have minor updates every few weeks and major feature releases every few months.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about edo's platform, pricing, and
            services.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <svg
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-[#009688] to-[#33bbaa] rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-[#009688] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300"
              >
                Contact Support
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
