import React, { useState } from 'react';
import ExpandDetails from './ExpandDetails';
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaChair,
  FaWifi,
  FaSnowflake,
  FaVideo,
} from 'react-icons/fa';
import { IoWater, IoFlash } from 'react-icons/io5';
import { GiWaterDrop } from 'react-icons/gi';
import { Canvas } from "@react-three/fiber";

export default function BusCard({ bus, onSelectBus }) {
  const [expandDetails, setExpandDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type) => {
    if (type.includes('AC'))
      return <FaSnowflake className="w-4 h-4 text-blue-600" />;
    return <FaChair className="w-4 h-4 text-orange-500" />;
  };

  return (
    <div
      className={`bg-white border rounded-xl transition-all p-4 ${isExpanded ? 'border-orange-400 shadow-md' : 'border-orange-200 hover:shadow-md hover:border-orange-300'}`}
    >
      {/* Main Card */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left - Operator Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {bus.operator}
              </h3>
              {bus.type.includes('AC') && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  AC
                </span>
              )}
              {bus.type.includes('Sleeper') && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                  Sleeper
                </span>
              )}
              {!bus.type.includes('AC') && (
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                  Non-AC
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{bus.type}</p>

            {/* Rating */}
            {bus.rating && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-0.5 px-2 py-0.5 bg-green-100 rounded">
                  <FaStar className="w-3 h-3 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    {bus.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  /{bus.reviews} Ratings
                </span>
              </div>
            )}

            {/* Available Seats Badge */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                  bus.seats > 10
                    ? 'bg-green-100 text-green-700'
                    : bus.seats > 5
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {bus.seats} window seats
              </span>
              <span className="text-xs font-medium text-gray-600">
                Total {bus.totalSeatsLeft} seats left
              </span>
            </div>
          </div>

          {/* Center - Time & Duration */}
          <div className="flex items-center justify-center flex-1 gap-8 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {bus.departure}
              </div>
              <div className="text-xs text-gray-500">{bus.boardingPoint}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500">{bus.duration}</div>
              <div className="w-16 h-0.5 bg-gray-300 my-1 relative">
                <div className="absolute -top-1.5 left-0 w-2 h-2 rounded-full bg-gray-400"></div>
                <div className="absolute -top-1.5 right-0 w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
              <div className="text-xs font-medium text-gray-600">{bus.date}</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {bus.arrival}
              </div>
              <div className="text-xs text-gray-500">{bus.droppingPoint}</div>
            </div>
          </div>

          {/* Right - Price & Action */}
          <div className="flex flex-col items-end justify-center gap-2 min-w-[140px]">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹{bus.price}</p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isExpanded
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isExpanded ? 'Hide Details' : 'Select Seats'}
              </button>
              {isExpanded && (
                <button
                  onClick={() => onSelectBus(bus)}
                  className="px-6 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Continue to Booking
                </button>
              )}
            </div>
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
                  {bus.boardingPoint}
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium text-gray-700">
                  {bus.droppingPoint}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-2">
              {bus.amenities?.WiFi && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-green-50"
                  title="WiFi"
                >
                  <FaWifi className="w-3.5 h-3.5 text-green-600" />
                </div>
              )}
              {bus.amenities?.AC && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50"
                  title="AC"
                >
                  <FaSnowflake className="w-3.5 h-3.5 text-blue-600" />
                </div>
              )}
              {bus.amenities?.['Charging Point'] && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-orange-50"
                  title="Charging Point"
                >
                  <IoFlash className="w-3.5 h-3.5 text-orange-600" />
                </div>
              )}
              {bus.amenities?.['Water Bottle'] && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-50"
                  title="Water Bottle"
                >
                  <GiWaterDrop className="w-3.5 h-3.5 text-cyan-600" />
                </div>
              )}
              {bus.amenities?.CCTV && (
                <div
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                  title="CCTV"
                >
                  <FaVideo className="w-3.5 h-3.5 text-gray-600" />
                </div>
              )}
              {bus.amenities?.Snacks && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-50"
                  title="Snacks"
                >
                  <FaChair className="w-3.5 h-3.5 text-yellow-600" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* People's Choice Section */}
        {bus.peoplesChoice && bus.peoplesChoice.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-semibold text-gray-600 uppercase">People choice for</span>
              <div className="flex items-center gap-2">
                {bus.peoplesChoice.map((choice, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full"
                  >
                    <span>•</span>
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
          <ExpandDetails bus={bus} />
        </div>
      )}
    </div>
  );
}
