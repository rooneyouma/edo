"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PropertyIndex = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Property Listings
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Browse our available properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample property cards - replace with actual data */}
          {[1, 2, 3, 4, 5, 6].map((id) => (
            <div
              key={id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/property/${id}`)}
            >
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Property {id}
                </h2>
                <p className="mt-2 text-gray-600">
                  Beautiful property description...
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#0d9488]">
                    $2,500/mo
                  </span>
                  <button className="text-[#0d9488] hover:text-[#0f766e] font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyIndex;
