import React, { useState } from 'react';
import ExpandDetails from './ExpandDetails';
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaWifi,
  FaUtensils,
  FaPlug,
  FaBed,
} from 'react-icons/fa';

export default function TrainCard({ train, onSelectTrain }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTrainTypeIcon = (type) => {
    if (type.includes('Superfast')) return 'SF';
    if (type.includes('Express')) return 'EX';
    return 'TR';
  };

  return (
    <div
      className={`bg-white border rounded-xl transition-all p-4 ${isExpanded ? 'border-blue-400 shadow-md' : 'border-blue-200 hover:shadow-md hover:border-blue-300'}`}
    >
      {/* Main Card */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left - Train Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {train.trainName}
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {train.trainNumber}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                {getTrainTypeIcon(train.type)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{train.type}</p>

            {/* Rating */}
            {train.rating && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-0.5 px-2 py-0.5 bg-green-100 rounded">
                  <FaStar className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {train.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  /{train.reviews} Ratings
                </span>
              </div>
            )}

            {/* Available Seats Badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-700">
                {train.seats['All Class']} Seats Available
              </span>
              <span className="text-xs text-gray-600 font-medium">
                {train.daysOfRun.join(', ')}
              </span>
            </div>
          </div>

          {/* Center - Time & Duration */}
          <div className="flex items-center justify-center flex-1 gap-8 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {train.departure}
              </div>
              <div className="text-xs text-gray-500">{train.boardingPoint.split(' ')[0]}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500">{train.duration}</div>
              <div className="w-16 h-0.5 bg-gray-300 my-1 relative">
                <div className="absolute -top-1.5 left-0 w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="absolute -top-1.5 right-0 w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
              <div className="text-xs text-gray-600 font-medium">{train.date}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {train.arrival}
              </div>
              <div className="text-xs text-gray-500">{train.droppingPoint.split(' ')[0]}</div>
            </div>
          </div>

          {/* Right - Price & Action */}
          <div className="flex flex-col items-end justify-center gap-2 min-w-[140px]">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">Rs.{train.price['All Class']}</p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
            <button
              onClick={() => onSelectTrain(train)}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                isExpanded
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isExpanded ? 'Hide Details' : 'Book Now'}
            </button>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {/* Boarding & Dropping Points */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-gray-700">
                  {train.boardingPoint}
                </span>
              </div>
              <span className="text-gray-400">to</span>
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium text-gray-700">
                  {train.droppingPoint}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2">
              {train.amenities?.Catering && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-orange-50"
                  title="Catering"
                >
                  <FaUtensils className="w-3.5 h-3.5 text-orange-600" />
                </div>
              )}
              {train.amenities?.WiFi && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-green-50"
                  title="WiFi"
                >
                  <FaWifi className="w-3.5 h-3.5 text-green-600" />
                </div>
              )}
              {train.amenities?.['Charging Point'] && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50"
                  title="Charging Point"
                >
                  <FaPlug className="w-3.5 h-3.5 text-blue-600" />
                </div>
              )}
              {train.amenities?.Blanket && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-purple-50"
                  title="Blanket"
                >
                  <FaBed className="w-3.5 h-3.5 text-purple-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* People's Choice Section */}
        {train.peoplesChoice && train.peoplesChoice.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-semibold text-gray-600 uppercase">People choice for</span>
              <div className="flex items-center gap-2">
                {train.peoplesChoice.map((choice, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full"
                  >
                    <span>â¢</span>
                    {choice}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="p-3 mt-2 bg-gray-100 border-t border-gray-100 rounded-xl">
          <ExpandDetails train={train} />
        </div>
      )}
    </div>
  );
}
