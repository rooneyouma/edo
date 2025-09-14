"use client";

import React, { useState } from "react";
import { testApiConnectivity } from "../../utils/api";

const TestApiPage = () => {
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [detailedResult, setDetailedResult] = useState(null);

  const runConnectivityTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setDetailedResult(null);

    try {
      const result = await testApiConnectivity();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed with error: ${error.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const runDetailedTest = async () => {
    setIsTesting(true);
    setDetailedResult(null);

    try {
      // Try a direct fetch to see more details
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("http://localhost:8000/api/v1", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setDetailedResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        message: `Successfully connected to backend. Status: ${response.status} ${response.statusText}`,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      let message = "";
      if (error.name === "AbortError") {
        message = "Request timed out - server may not be responding";
      } else if (error.message.includes("ECONNREFUSED")) {
        message =
          "Connection refused - backend server is not running or not accessible on port 8000";
      } else if (error.message.includes("CORS")) {
        message =
          "CORS error - backend is running but not configured to accept requests from this origin";
      } else {
        message = `Connection failed: ${error.message}`;
      }

      setDetailedResult({
        success: false,
        message: message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          API Connectivity Test
        </h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This tool tests connectivity to your backend API at
            http://localhost:8000/api/v1.
          </p>

          <div className="space-y-3">
            <button
              onClick={runConnectivityTest}
              disabled={isTesting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {isTesting ? "Testing..." : "Basic Connection Test"}
            </button>

            <button
              onClick={runDetailedTest}
              disabled={isTesting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {isTesting ? "Testing..." : "Detailed Connection Test"}
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-md mb-4 ${
              testResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h2
              className={`font-medium ${
                testResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {testResult.success
                ? "✅ Basic Test Success"
                : "❌ Basic Test Failed"}
            </h2>
            <p
              className={`mt-2 ${
                testResult.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {testResult.message}
            </p>
          </div>
        )}

        {detailedResult && (
          <div
            className={`p-4 rounded-md ${
              detailedResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h2
              className={`font-medium ${
                detailedResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {detailedResult.success
                ? "✅ Detailed Test Success"
                : "❌ Detailed Test Failed"}
            </h2>
            <p
              className={`mt-2 ${
                detailedResult.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {detailedResult.message}
            </p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Make sure your backend server is running on port 8000</li>
            <li>Check that the API URL is correct in your .env.local file</li>
            <li>Verify your internet connection</li>
            <li>Check browser console for detailed error messages</li>
            <li>If using Django, ensure CORS is properly configured</li>
          </ul>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="font-medium text-yellow-800">Common Solutions:</h4>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-yellow-700">
              <li>
                Start backend:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  python manage.py runserver 8000
                </code>
              </li>
              <li>
                Check if port is in use:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  netstat -ano | findstr :8000
                </code>
              </li>
              <li>
                Try accessing{" "}
                <a
                  href="http://localhost:8000"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                >
                  http://localhost:8000
                </a>{" "}
                directly in browser
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApiPage;
