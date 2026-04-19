import React from 'react';
import { FaCheck, FaPlane, FaTrain, FaUser, FaChair, FaCreditCard } from 'react-icons/fa';

export default function BookingProgress({ currentStep, transportType = 'flight' }) {
  const steps = transportType === 'flight' 
    ? [
        { id: 1, name: 'Search', icon: FaPlane, completed: true },
        { id: 2, name: 'Select Flight', icon: FaPlane, completed: currentStep >= 2 },
        { id: 3, name: 'Passenger Details', icon: FaUser, completed: currentStep >= 3 },
        { id: 4, name: 'Seat Selection', icon: FaChair, completed: currentStep >= 4 },
        { id: 5, name: 'Payment', icon: FaCreditCard, completed: currentStep >= 5 },
      ]
    : [
        { id: 1, name: 'Search', icon: FaTrain, completed: true },
        { id: 2, name: 'Select Train', icon: FaTrain, completed: currentStep >= 2 },
        { id: 3, name: 'Passenger Details', icon: FaUser, completed: currentStep >= 3 },
        { id: 4, name: 'Seat Selection', icon: FaChair, completed: currentStep >= 4 },
        { id: 5, name: 'Payment', icon: FaCreditCard, completed: currentStep >= 5 },
      ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2 z-0" />
        <div 
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.completed;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <FaCheck className="text-lg" />
                ) : (
                  <Icon className="text-lg" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-purple-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                {step.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                    Current Step
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Step Description */}
      <div className="mt-8 text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          {steps[currentStep - 1]?.name || 'Complete'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {getStepDescription(currentStep, transportType)}
        </p>
      </div>
    </div>
  );
}

function getStepDescription(step, transportType) {
  const descriptions = transportType === 'flight' 
    ? [
        'Search for flights between your preferred cities',
        'Choose your preferred flight from available options',
        'Enter passenger details for all travelers',
        'Select your preferred seats for the journey',
        'Complete payment to confirm your booking'
      ]
    : [
        'Search for trains between your preferred cities',
        'Choose your preferred train from available options',
        'Enter passenger details for all travelers',
        'Select your preferred berths/seats for the journey',
        'Complete payment to confirm your booking'
      ];
    
  return descriptions[step - 1] || 'Booking completed successfully!';
}
