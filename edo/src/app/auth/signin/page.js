"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { authAPI, storeUser } from "../../../utils/api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const nextPath = searchParams.get("next");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login({ email, password });

      // Store user data
      storeUser(response.user);

      // Navigate based on next param or role
      if (nextPath) {
        router.push(nextPath);
      } else if (role === "tenant") {
        router.push("/tenant/dashboard");
      } else if (role === "landlord") {
        router.push("/landlord");
      } else {
        router.push("/");
      }
    } catch (error) {
      // More descriptive error messages
      if (error.message.includes("Could not connect to server")) {
        setError(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } else if (error.message.includes("Failed to fetch")) {
        setError(
          "Unable to connect to the authentication service. Please try again later."
        );
      } else {
        setError(
          error.message || "Failed to sign in. Please check your credentials."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdfa] via-[#e0f7fa] to-white flex items-center justify-center relative px-2 sm:px-4 lg:px-8">
      {/* Decorative Accent */}
      <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-40 sm:h-40 bg-[#0d9488]/10 rounded-full z-0" />
      {/* Back Button */}
      <button
        className="absolute top-2 left-2 z-50 bg-white/90 p-2 rounded-full hover:bg-gray-100"
        onClick={() => router.back()}
        type="button"
      >
        <ArrowLeft className="h-5 w-5 text-[#0d9488]" />
      </button>

      {/* Main Content */}
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-center text-gray-600">
                {role === "tenant"
                  ? "Sign in to access your tenant portal"
                  : role === "landlord"
                  ? "Sign in to access your landlord dashboard"
                  : "Sign in to browse properties, save favorites, and find your next home"}
              </p>
              <p className="mt-4 text-sm text-center text-gray-600">
                New to edo?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-[#0d9488] hover:text-[#0f766e]"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-6 sm:mt-8">
              <div className="mt-4 sm:mt-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {error && (
                    <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

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
                        className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-3 py-3 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#0d9488] focus:border-[#0d9488] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#0d9488] border-gray-300 rounded focus:ring-[#0d9488]"
                      />
                      <label
                        htmlFor="remember-me"
                        className="block ml-2 text-sm text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm mt-2 sm:mt-0">
                      <Link
                        href="/auth/resetpassword"
                        className="font-medium text-[#0d9488] hover:text-[#0f766e]"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex justify-center w-full px-4 py-3 text-base font-medium text-white bg-[#0d9488] border border-transparent rounded-md shadow-sm hover:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d9488] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>

                {!role && (
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or access your portal
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link
                        href="/auth/signin?role=tenant"
                        className="inline-flex justify-center py-2 px-4 border border-[#0d9488] rounded-md shadow-sm bg-white text-sm font-medium text-[#0d9488] hover:bg-gray-50"
                      >
                        Tenant Portal
                      </Link>
                      <Link
                        href="/auth/signin?role=landlord"
                        className="inline-flex justify-center py-2 px-4 border border-[#0d9488] rounded-md shadow-sm bg-white text-sm font-medium text-[#0d9488] hover:bg-gray-50"
                      >
                        Landlord Portal
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
