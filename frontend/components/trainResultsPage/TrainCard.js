import React, { useState, useRef, useEffect } from 'react';
import ExpandDetails from './ExpandDetails';
import {
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaWifi,
  FaUtensils,
  FaPlug,
  FaBed,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

export default function TrainCard({ train, onSelectTrain }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getTrainTypeIcon = (type) => {
    if (type.includes('Superfast')) return 'SF';
    if (type.includes('Express')) return 'EX';
    return 'TR';
  };

  const getDayStatus = (day) => {
    if (train.daysOfRun.includes('Daily')) return true;
    const dayMap = {
      Mon: 'M',
      Tue: 'T',
      Wed: 'W',
      Thu: 'T',
      Fri: 'F',
      Sat: 'S',
      Sun: 'S',
    };
    return train.daysOfRun.some((runDay) => dayMap[runDay] === day);
  };

  const formatStation = (station) => {
    const parts = station.split(' ');
    const code = parts[0];
    const name = parts.slice(1).join(' ');
    return {
      code,
      shortName: name.length > 15 ? name.substring(0, 15) + '..' : name,
    };
  };

  const getAvailabilityStatus = (seats) => {
    if (seats <= 0) {
      return { text: 'WL 12', color: 'red', time: 'Updated recently' };
    }
    if (seats <= 3) {
      return { text: `RAC ${seats}`, color: 'yellow', time: 'Few seats left' };
    }
    return {
      text: `AVAILABLE ${seats}`,
      color: 'green',
      time: 'Updated recently',
    };
  };

  const classOptions = Object.entries(train.price).filter(
    ([className]) => className !== 'All Class'
  );
  const itemWidth = 176; // 160px + 16px gap

  const scrollLeftBtn = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (currentIndex < classOptions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('touchstart', handleTouchStart);
      slider.addEventListener('touchmove', handleTouchMove);
      return () => {
        slider.removeEventListener('touchstart', handleTouchStart);
        slider.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, []);

  return (
    <div
      className={`bg-white border rounded-2xl transition-all shadow-sm hover:shadow-xl ${isExpanded ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}
    >
      {/* Train Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-3xl font-bold text-gray-900">
              {train.trainNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="mb-1 text-xl font-bold text-gray-900">
                  {train.trainName}
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                  {getTrainTypeIcon(train.type)}
                </span>
              </div>
              <button className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800">
                VIEW ROUTE
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Runs on:
            </span>
            <div className="flex gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <span
                  key={index}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                    getDayStatus(day)
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Journey Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 text-center">
            <div className="mb-1 text-2xl font-bold text-gray-900">
              {train.departure}
            </div>
            <div className="mb-1 text-base font-semibold text-gray-700">
              {formatStation(train.boardingPoint).code}
            </div>
            <div className="text-sm text-gray-500">
              ({formatStation(train.boardingPoint).shortName})
            </div>
          </div>
          <div className="flex-1 px-8">
            <div className="text-center">
              <div className="mb-3 text-sm font-medium text-gray-600">
                {train.duration}
              </div>
              <div className="relative">
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-300 to-blue-400"></div>
                <div className="absolute left-0 w-3 h-3 transform -translate-y-1/2 bg-blue-500 border-2 border-white rounded-full shadow-sm top-1/2"></div>
                <div className="absolute right-0 w-3 h-3 transform -translate-y-1/2 bg-blue-500 border-2 border-white rounded-full shadow-sm top-1/2"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="mb-1 text-2xl font-bold text-gray-900">
              {train.arrival}
            </div>
            <div className="mb-1 text-base font-semibold text-gray-700">
              {formatStation(train.droppingPoint).code}
            </div>
            <div className="text-sm text-gray-500">
              ({formatStation(train.droppingPoint).shortName})
            </div>
          </div>
        </div>

        {/* Class Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
              Class Options
            </h4>
            <div className="flex gap-1">
              {classOptions.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="relative">
            {/* Left Arrow */}
            {currentIndex > 0 && (
              <button
                onClick={scrollLeftBtn}
                className="absolute z-10 flex items-center justify-center w-8 h-8 transition-colors transform -translate-y-1/2 bg-white rounded-full shadow-lg left-2 top-1/2 hover:bg-gray-100"
              >
                <FaChevronLeft className="text-sm text-gray-600" />
              </button>
            )}

            {/* Right Arrow */}
            {currentIndex < classOptions.length - 1 && (
              <button
                onClick={scrollRight}
                className="absolute z-10 flex items-center justify-center w-8 h-8 transition-colors transform -translate-y-1/2 bg-white rounded-full shadow-lg right-2 top-1/2 hover:bg-gray-100"
              >
                <FaChevronRight className="text-sm text-gray-600" />
              </button>
            )}

            <div
              ref={sliderRef}
              className="flex gap-4 pb-3 overflow-x-auto select-none scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {classOptions.map(([className, price]) => {
                const availability = getAvailabilityStatus(
                  train.seats[className] || 0
                );
                return (
                  <div
                    key={className}
                    className={`flex-shrink-0 w-[160px] p-4 rounded-xl transition-all hover:scale-105 shadow-sm ${
                      availability.color === 'red'
                        ? 'bg-red-50 hover:bg-red-100 border-2 border-red-200'
                        : availability.color === 'yellow'
                          ? 'bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200'
                          : 'bg-green-50 hover:bg-green-100 border-2 border-green-200'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <span className="text-base font-bold text-gray-900">
                        {className}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {className === 'SL'
                          ? 'Sleeper'
                          : className.includes('A')
                            ? 'AC Class'
                            : 'General'}
                      </span>
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{price}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        General Quota
                      </span>
                      <div
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          availability.color === 'green'
                            ? 'text-green-700 bg-green-200'
                            : availability.color === 'yellow'
                              ? 'text-yellow-800 bg-yellow-200'
                              : 'text-red-700 bg-red-200'
                        }`}
                      >
                        <span
                          className={
                            availability.text.includes('WL') ? 'opacity-80' : ''
                          }
                        >
                          {availability.text}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {availability.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => onSelectTrain(train)}
          className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Book Now
        </button>
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
