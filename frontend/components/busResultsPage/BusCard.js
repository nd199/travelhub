import React, { useState } from 'react';
import ExpandDetails from './ExpandDetails';
import {
  FaStar,
  FaMapMarkerAlt,
  FaChair,
  FaWifi,
  FaSnowflake,
  FaBus,
  FaInfoCircle,
} from 'react-icons/fa';
import { IoFlash } from 'react-icons/io5';

export default function BusCard({ bus, onSelectBus }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('seats');

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const isNextDay = (departure, arrival) => {
    const depDate = new Date(departure);
    const arrDate = new Date(arrival);
    return (
      arrDate.getDate() !== depDate.getDate() ||
      arrDate.getMonth() !== depDate.getMonth() ||
      arrDate.getFullYear() !== depDate.getFullYear()
    );
  };

  const handleExpandWithTab = (tab) => {
    setActiveTab(tab);
    setIsExpanded(true);
  };

  return (
    <div className="px-5 py-5 transition border border-gray-200 rounded-md bg-slate-50 hover:bg-white hover:shadow-lg hover:border-black">
      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-6 p-2">
        {/* LEFT */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-wide text-gray-800">
            {bus.operator}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {bus.busKind || bus.type}
          </p>

          {/* Rating */}
          {bus.rating && (
            <div className="flex items-center gap-3 mt-3">
              <span className="px-2 py-[2px] text-xs font-bold text-white bg-green-600 rounded-sm">
                {bus.rating}/5
              </span>
              <span className="text-xs text-gray-500">
                {bus.reviews} Ratings
              </span>
            </div>
          )}

          {/* People Choice */}
          {bus.peoplesChoice?.length > 0 && (
            <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
              <FaStar className="text-xs text-green-600" />
              <span>People choice for</span>
              {bus.peoplesChoice.map((item, i) => (
                <span key={i}>• {item}</span>
              ))}
            </div>
          )}
        </div>

        {/* CENTER */}
        <div className="flex items-center justify-center flex-1 gap-10 text-center">
          <div>
            <p className="text-lg font-bold text-gray-800">
              {formatTime(bus.departure)}
            </p>
            <p className="text-xs text-gray-500">{bus.from}</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500">{bus.duration}</p>
            <div className="w-20 h-[2px] bg-gray-300 relative my-1">
              <div className="absolute left-0 w-2 h-2 bg-gray-400 rounded-full -top-1" />
              <div className="absolute right-0 w-2 h-2 bg-gray-400 rounded-full -top-1" />
            </div>
          </div>

          <div
            className={`${isNextDay(bus.departure, bus.arrival) ? '-mt-4' : ''}`}
          >
            {isNextDay(bus.departure, bus.arrival) && (
              <p className="mt-1 text-xs font-medium text-orange-600">
                {formatDate(bus.arrival)}
              </p>
            )}
            <p className="text-lg font-bold text-gray-800">
              {formatTime(bus.arrival)}
            </p>
            <p className="text-xs text-gray-500">{bus.to}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-end justify-between gap-1 min-w-[140px]">
          <p className="text-xs text-gray-500">{bus.date}</p>

          <p className="text-2xl font-bold text-gray-900">₹ {bus.price}</p>

          {bus.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              ₹{bus.originalPrice}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <img
              src="/windowSeat.png"
              alt="Window Seat"
              className="w-4 h-4 bg-blue-200 rounded-lg"
            />
            <span>{bus.seats} window seats</span>
          </div>

          <p className="text-xs text-gray-500">
            Total {bus.totalSeatsLeft} seats left
          </p>

          {/* DEAL badge */}
          {bus.deal && (
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
              <span>🏷</span>
              {bus.deal}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2 mt-2 text-sm font-semibold text-white transition bg-gradient-to-r from-secondary to-secondary-dark rounded-md hover:from-secondary-dark hover:to-secondary"
          >
            SELECT SEAT
          </button>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex items-center justify-between pt-3 mt-2 text-sm text-gray-600 border-t">
        <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-tertiary">
          <FaBus className="text-sm text-tertiary" /> Live Tracking
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-secondary">
          <span
            className="cursor-pointer hover:text-secondary-dark hover:underline"
            onClick={() => handleExpandWithTab('boarding')}
          >
            Boarding & Dropping Points
          </span>
          <span
            className="flex items-center gap-1 cursor-pointer hover:text-secondary-dark hover:underline"
            onClick={() => handleExpandWithTab('amenities')}
          >
            <FaInfoCircle className="text-sm" />
            Amenities, Policies & Bus Details
          </span>
        </div>
      </div>

      {/* EXPAND */}
      {isExpanded && (
        <div className="pt-3 mt-3 border-t">
          <ExpandDetails bus={bus} initialTab={activeTab} />
        </div>
      )}
    </div>
  );
}
