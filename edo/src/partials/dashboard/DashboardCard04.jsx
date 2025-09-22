import React from "react";

function DashboardCard04() {
  // Mock data for rent payments per property
  const properties = [
    {
      name: "Sunset Apartments",
      totalUnits: 12,
      paidUnits: 10,
      unpaidUnits: 2,
      totalRent: 30000,
    },
    {
      name: "Mountain View",
      totalUnits: 8,
      paidUnits: 7,
      unpaidUnits: 1,
      totalRent: 20000,
    },
    {
      name: "Riverside",
      totalUnits: 6,
      paidUnits: 5,
      unpaidUnits: 1,
      totalRent: 15000,
    },
    {
      name: "Downtown Lofts",
      totalUnits: 10,
      paidUnits: 8,
      unpaidUnits: 2,
      totalRent: 25000,
    },
    {
      name: "Garden Villas",
      totalUnits: 8,
      paidUnits: 6,
      unpaidUnits: 2,
      totalRent: 20000,
    },
  ];

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Rent Payments by Property
        </h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700/60">
                <th className="py-2">Property</th>
                <th className="py-2">Total Units</th>
                <th className="py-2">Paid Units</th>
                <th className="py-2">Unpaid Units</th>
                <th className="py-2">Total Rent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {properties.map((property, index) => (
                <tr key={index} className="text-sm">
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    {property.name}
                  </td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    {property.totalUnits}
                  </td>
                  <td className="py-2 text-green-500">{property.paidUnits}</td>
                  <td className="py-2 text-red-500">{property.unpaidUnits}</td>
                  <td className="py-2 text-gray-700 dark:text-gray-300">
                    ${property.totalRent.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard04;
