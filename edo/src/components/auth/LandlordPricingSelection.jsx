import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const LandlordPricingSelection = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState(null);

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      unitRange: '1-5 units',
      price: '$0',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'basic',
      name: 'Basic',
      unitRange: '6-20 units',
      price: '$49',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      unitRange: '21-50 units',
      price: '$99',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      unitRange: '50+ units',
      price: '$199',
      color: 'from-amber-500 to-amber-600'
    }
  ];

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
    navigate('/signup/landlord/billing', { state: { selectedTier: tierId } });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Choose Your Plan
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Select a plan based on your property portfolio size
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  selectedTier === tier.id ? 'ring-2 ring-[#0d9488]' : ''
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${tier.color}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">{tier.unitRange}</p>
                  <button
                    onClick={() => handleTierSelect(tier.id)}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                      selectedTier === tier.id
                        ? 'bg-[#0d9488] text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {selectedTier === tier.id ? (
                      <span className="flex items-center justify-center">
                        <CheckIcon className="h-5 w-5 mr-2" />
                        Selected
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordPricingSelection; 