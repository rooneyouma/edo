"use client";

import React from "react";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";

const PricingPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "List up to 3 properties",
        "Basic property management",
        "Email support",
        "Standard analytics",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing property managers",
      features: [
        "List up to 20 properties",
        "Advanced property management",
        "Priority email support",
        "Enhanced analytics",
        "Tenant screening",
        "Maintenance tracking",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large property management companies",
      features: [
        "Unlimited property listings",
        "Advanced property management",
        "24/7 dedicated support",
        "Premium analytics",
        "Tenant screening",
        "Maintenance tracking",
        "Custom reporting",
        "API access",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include our core
            features with no hidden fees or setup costs.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? "border-[#009688] ring-2 ring-[#009688]/20 bg-white"
                  : "border-gray-200 bg-white/80 backdrop-blur-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#009688] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-[#009688] mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "#"}
                className={`block text-center w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#009688] to-[#33bbaa] text-white shadow-md hover:shadow-lg hover:scale-105"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              question: "Can I change plans later?",
              answer:
                "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
            },
            {
              question: "Do you offer discounts for non-profits?",
              answer:
                "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information.",
            },
            {
              question: "Is there a setup fee?",
              answer:
                "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee.",
            },
            {
              question: "What payment methods do you accept?",
              answer:
                "We accept all major credit cards including Visa, Mastercard, American Express, and Discover.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#009688] to-[#33bbaa] rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of property managers who trust edo to manage their
            properties.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-[#009688] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300"
            >
              Create Free Account
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
