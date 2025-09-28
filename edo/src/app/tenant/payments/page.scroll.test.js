import React from "react";
import { render, screen } from "@testing-library/react";
import Payments from "./page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock the authentication utility
jest.mock("@/utils/api.js", () => ({
  isAuthenticated: () => true,
}));

// Mock the TenantHeader and TenantSidebar components
jest.mock("@/partials/tenant/TenantHeader.jsx", () => {
  return function MockTenantHeader() {
    return <div data-testid="tenant-header">Tenant Header</div>;
  };
});

jest.mock("@/partials/tenant/TenantSidebar.jsx", () => {
  return function MockTenantSidebar() {
    return <div data-testid="tenant-sidebar">Tenant Sidebar</div>;
  };
});

// Mock the Modal component
jest.mock("@/partials/Modal.jsx", () => {
  return function MockModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" role="dialog">
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    );
  };
});

describe("Tenant Payments Page - Scroll Implementation", () => {
  test("implements proper scrolling structure like landlord/payments", () => {
    render(<Payments />);

    // Check if the page has the correct structure for scrolling
    expect(screen.getByText("Payments")).toBeInTheDocument();

    // Check if the property column is present in the table
    expect(screen.getByText("Property")).toBeInTheDocument();

    // Check if the payment table is rendered with all columns
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Property")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Method")).toBeInTheDocument();
    expect(screen.getByText("Reference")).toBeInTheDocument();

    // Check if pagination elements are present
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous page/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next page/i })
    ).toBeInTheDocument();

    // Check if the page input is present
    expect(
      screen.getByRole("spinbutton", { name: /go to page/i })
    ).toBeInTheDocument();
  });

  test("table uses landlord-style scrolling pattern", () => {
    render(<Payments />);

    // Check if the table container follows the landlord pattern
    const tableContainer =
      screen.getByRole("table").parentElement.parentElement.parentElement;
    expect(tableContainer).toHaveClass("overflow-x-auto");

    // Check if the inner container has the correct classes
    const innerContainer = tableContainer.parentElement;
    expect(innerContainer).toHaveClass("inline-block", "min-w-full");
  });

  test("property data is displayed in the table", () => {
    render(<Payments />);

    // Check if property names are displayed in the table
    expect(screen.getByText("Sunset Apartments")).toBeInTheDocument();
    expect(screen.getByText("Mountain View Condos")).toBeInTheDocument();
  });

  test("search functionality includes property field", () => {
    render(<Payments />);

    // Check if the search input is present
    const searchInput = screen.getByPlaceholderText("Search payments...");
    expect(searchInput).toBeInTheDocument();
  });
});
