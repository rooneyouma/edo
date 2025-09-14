import React from "react";
import { Navigate } from "react-router-dom";

const DevOnlyRoute = ({ children }) => {
  // Check if we're in development mode
  const isDevelopment =
    import.meta.env.MODE === "development" ||
    import.meta.env.DEV === true ||
    process.env.NODE_ENV === "development";

  // In production, redirect to homepage
  if (!isDevelopment) {
    return <Navigate to="/" replace />;
  }

  // In development, render the component
  return children;
};

export default DevOnlyRoute;
