import React from 'react';
import {
  FaUtensils,
  FaWifi,
  FaPlug,
  FaBed,
  FaShieldAlt,
  FaClock,
} from 'react-icons/fa';

export default function ExpandDetails({ train }) {
  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'Catering':
        return <FaUtensils className="w-4 h-4 text-orange-600" />;
      case 'WiFi':
        return <FaWifi className="w-4 h-4 text-green-600" />;
      case 'Charging Point':
        return <FaPlug className="w-4 h-4 text-blue-600" />;
      case 'Blanket':
        return <FaBed className="w-4 h-4 text-purple-600" />;
      default:
        return <FaShieldAlt className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Class-wise Pricing and Availability */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Class-wise Availability & Pricing</h4>
        <div className="space-y-2">
          {Object.entries(train.price).map(([className, price]) => (
            <div key={className} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{className}</span>
                <span className="text-xs text-gray-500">
                  ({train.seats[className] || 0} seats available)
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">Rs.{price}</span>
                <span className="text-xs text-gray-500 ml-1">per person</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Train Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Train Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <FaClock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Run Days:</span>
            <span className="font-medium text-gray-900">{train.daysOfRun.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaShieldAlt className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-900">{train.type}</span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Amenities</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(train.amenities).map(([amenity, available]) => (
            available && (
              <div
                key={amenity}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full border border-gray-200"
              >
                {getAmenityIcon(amenity)}
                {amenity}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Journey Details */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Journey Details</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 w-20">From:</span>
            <span className="font-medium text-gray-900">{train.boardingPoint}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 w-20">To:</span>
            <span className="font-medium text-gray-900">{train.droppingPoint}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 w-20">Distance:</span>
            <span className="font-medium text-gray-900">~350 km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
