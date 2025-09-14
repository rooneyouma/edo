"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-2 sm:px-6 lg:px-8 justify-center items-center">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">
                Reset your password
              </h2>
              <p className="mt-2 text-sm text-center text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="mt-4 sm:mt-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex justify-center w-full px-4 py-3 text-base font-medium text-white bg-violet-600 border border-transparent rounded-md shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition"
                    >
                      Send reset link
                    </button>
                  </div>
                  <div className="text-sm text-center">
                    <Link
                      href="/auth/signin"
                      className="font-medium text-violet-600 hover:text-violet-500"
                    >
                      Back to sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
