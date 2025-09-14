import React from "react";

const ScalingTest = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md m-4">
      <h2 className="text-2xl font-bold mb-4">Scaling Test Component</h2>
      <p className="mb-4">
        This component helps verify the hybrid scaling solution is working
        correctly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
          <h3 className="font-semibold">Box 1</h3>
          <p>Testing responsive grid layout</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
          <h3 className="font-semibold">Box 2</h3>
          <p>Checking scaling consistency</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          <h3 className="font-semibold">Box 3</h3>
          <p>Verifying responsive behavior</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Font size test: This text should be scaled appropriately
        </div>
      </div>
    </div>
  );
};

export default ScalingTest;
