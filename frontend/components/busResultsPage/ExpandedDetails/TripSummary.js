import React from 'react';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaChair, FaBus, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const TripSummary = ({ bus, selectedSeats, boardingPoint, droppingPoint, passengers = [] }) => {
  const seatPrice = bus?.price || 500;
  const selectedCount = selectedSeats?.length || 0;
  const subtotal = seatPrice * selectedCount;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Trip Summary</h2>

      {/* Route Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{bus?.from || 'Chennai'}</p>
            <p className="text-sm text-gray-500">{bus?.departure}</p>
          </div>
          <div className="flex-1 px-4">
            <div className="relative flex items-center justify-center">
              <div className="h-0.5 w-full bg-gray-300"></div>
              <div className="absolute left-0 w-3 h-3 rounded-full bg-gray-400"></div>
              <div className="absolute right-0 w-3 h-3 rounded-full bg-gray-400"></div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-2">
                <FaBus className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">{bus?.duration}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{bus?.to || 'Bangalore'}</p>
            <p className="text-sm text-gray-500">{bus?.arrival}</p>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaCalendarAlt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-medium">Date</p>
            <p className="text-sm font-semibold text-gray-900">{bus?.date || '14th Apr'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FaClock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium">Departure Time</p>
            <p className="text-sm font-semibold text-gray-900">{bus?.departure || '22:45'}</p>
          </div>
        </div>
      </div>

      {/* Boarding & Dropping Points */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Boarding & Dropping</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-green-600" />
              <p className="text-xs text-green-600 font-medium">Boarding Point</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{boardingPoint || 'Select above'}</p>
          </div>
          <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs text-red-500 font-medium">Dropping Point</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">{droppingPoint || 'Select above'}</p>
          </div>
        </div>
      </div>

      {/* Selected Seats */}
      {selectedCount > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Seats</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seatId, index) => {
              const [rowIdx, colIdx] = seatId.split('-').map(Number);
              const seatName = initialSeats[rowIdx]?.[colIdx]?.name || seatId;
              return (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium"
                >
                  <FaChair className="w-3.5 h-3.5" />
                  {seatName}
                </span>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-gray-500">{selectedCount} seat(s) selected</p>
        </div>
      )}

      {/* Passenger Summary */}
      {passengers.length > 0 && passengers.some(p => p.name) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Passenger Summary</h3>
          <div className="space-y-2">
            {passengers.filter(p => p.name).map((passenger, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <FaUser className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium text-gray-900">{passenger.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{passenger.age}y</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{passenger.gender}</span>
                <span className="text-gray-500">•</span>
                <FaPhone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{passenger.phone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fare Breakdown */}
      {selectedCount > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fare Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Fare ({selectedCount} × ₹{seatPrice})</span>
              <span className="font-medium text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (5%)</span>
              <span className="font-medium text-gray-900">₹{tax}</span>
            </div>
            <div className="pt-2 border-t border-gray-300 flex justify-between">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="font-bold text-xl text-green-600">₹{total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Operator Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Operator</p>
            <p className="text-sm font-semibold text-gray-900">{bus?.operator || 'IntrCity SmartBus'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Bus Type</p>
            <p className="text-sm font-medium text-gray-700">{bus?.type || 'A/C Sleeper'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;