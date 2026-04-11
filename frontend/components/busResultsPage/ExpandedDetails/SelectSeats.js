import { FaMapMarkerAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import { GiSteeringWheel } from 'react-icons/gi';
import { initialSeats } from '../../../lib/data/seats';
import { boardingPoints, droppingPoints } from '../../../lib/data/boarding';
import toast from 'react-hot-toast';

const SeatSelection = ({ bus }) => {
  const [seatLayout, setSeatLayout] = useState(initialSeats);
  const [activeSelections, setActiveSelections] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [selectedDropping, setSelectedDropping] = useState('');
  const [error, setError] = useState('');

  const currentUser = {
    gender: 'male',
  };

  const validateBeforeContinue = () => {
    const missing = [];

    if (!selectedBoarding) missing.push('Boarding Point');
    if (!selectedDropping) missing.push('Dropping Point');
    if (activeSelections.length === 0) missing.push('Seats');

    if (missing.length > 0) {
      toast.error(`Please select: ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSeatSelection = (rowIndex, colIndex) => {
    const seat = seatLayout[rowIndex][colIndex];
    const seatId = `${rowIndex}-${colIndex}`;

    if (seat.type === 'booked') return;

    if (!selectedBoarding || !selectedDropping) {
      toast.error('Select boarding & dropping points first');
      return;
    }

    setError('');

    if (seat?.gender === 'ladies' && currentUser?.gender === 'male') {
      toast.error('This seat is reserved for female passengers');
      return;
    }

    setActiveSelections((prev) =>
      prev?.includes(seatId)
        ? prev?.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <div className="flex items-start gap-6 p-4 bg-white shadow-sm rounded-2xl">
      <div className="flex-1">
        <h1 className="mb-4 text-lg font-semibold text-gray-900">
          Choose Your Stops
        </h1>
        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
              <p className="text-sm font-semibold text-gray-800">
                Boarding Point
              </p>
            </div>
            <div
              className={`p-2 space-y-2 overflow-y-auto border shadow-sm rounded-xl max-h-72 ${
                error && (!selectedBoarding || !selectedDropping)
                  ? 'border-red-300 bg-red-50/40'
                  : 'border-gray-200'
              }`}
            >
              {boardingPoints.map((point, idx) => (
                <button
                  key={`boarding-${idx}`}
                  onClick={() => {
                    setSelectedBoarding(point.location);
                  }}
                  className={`w-full px-3 py-2.5 text-left rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedBoarding === point.location
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedBoarding === point.location
                          ? 'bg-white/20 text-white'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {point.time}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          selectedBoarding === point.location
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                      >
                        {point.location}
                      </p>
                      {point.address && (
                        <p
                          className={`text-xs mt-0.5 ${
                            selectedBoarding === point.location
                              ? 'text-blue-200'
                              : 'text-gray-500'
                          }`}
                        >
                          {point.address}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
              <p className="text-sm font-semibold text-gray-800">
                Dropping Point
              </p>
            </div>
            <div
              className={`p-2 space-y-2 overflow-y-auto border shadow-sm rounded-xl max-h-72 ${
                error && (!selectedBoarding || !selectedDropping)
                  ? 'border-red-300 bg-red-50/40'
                  : 'border-gray-200'
              }`}
            >
              {droppingPoints.map((point, idx) => (
                <button
                  key={`dropping-${idx}`}
                  onClick={() => {
                    setSelectedDropping(point.location);
                    setError('');
                    if (selectedBoarding && selectedDropping) setError('');
                  }}
                  className={`w-full px-3 py-2.5 text-left rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedDropping === point.location
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedDropping === point.location
                          ? 'bg-white/20 text-white'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {point.time}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          selectedDropping === point.location
                            ? 'text-white'
                            : 'text-gray-900'
                        }`}
                      >
                        {point.location}
                      </p>
                      {point.address && (
                        <p
                          className={`text-xs mt-0.5 ${
                            selectedDropping === point.location
                              ? 'text-blue-200'
                              : 'text-gray-500'
                          }`}
                        >
                          {point.address}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[1]">
        <h1 className="flex mb-2 text-lg font-semibold text-gray-900">
          Select Seats
        </h1>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3 text-sm text-red-700 border border-red-300 rounded-lg shadow-sm bg-red-50">
            <span className="font-semibold">⚠</span>
            {error}
          </div>
        )}

        <div className="flex items-center gap-4 p-3 mb-4 rounded-lg shadow-sm bg-gray-50">
          <div className="flex-1">
            <p className="text-xs text-gray-500">Boarding Point</p>
            <p className="flex items-center gap-2 text-xs font-medium text-gray-900">
              <FaMapMarkerAlt className="text-green-500" />
              {selectedBoarding || 'Select above'}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Dropping Point</p>
            <p className="flex items-center gap-2 text-xs font-medium text-gray-900">
              <FaMapMarkerAlt className="text-red-500" />
              {selectedDropping || 'Select above'}
            </p>
          </div>
          <div className="px-4 py-2 text-center rounded-lg bg-blue-50">
            <p className="text-xs text-gray-500">Available Seats</p>
            <p className="text-xl font-bold text-blue-600">{bus?.seats}</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-gray-400 border border-gray-500 rounded" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-white border border-gray-400 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-pink-300 border border-pink-500 rounded" />
            <span>Women</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-green-500 border border-green-600 rounded" />
            <span>Selected</span>
          </div>
        </div>

        {/* Bus Layout */}
        <div className="flex items-center justify-center w-full mt-6">
          <div className="w-[40px] h-[210px] bg-blue-200 rounded-l-md relative border-2 border-r-0 border-gray-500">
            <GiSteeringWheel className="absolute w-4 h-4 top-3 left-1" />
          </div>

          <div className="w-[400px] h-[210px] bg-gray-200 rounded-r-md border-2 border-l-0 border-gray-500 p-4">
            <div className="flex flex-col items-end gap-5">
              {seatLayout?.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-5">
                  {row.map((seat, colIndex) => {
                    const seatId = `${rowIndex}-${colIndex}`;
                    const isSelected = activeSelections.includes(seatId);

                    return (
                      <Seat
                        key={seatId}
                        seat={seat}
                        isSelected={isSelected}
                        onClick={() => handleSeatSelection(rowIndex, colIndex)}
                        onHover={(e) => {
                          setHoveredSeat(seat);
                          setCursorPosition({
                            x: e.clientX,
                            y: e.clientY,
                          });
                        }}
                        onLeave={() => setHoveredSeat(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {hoveredSeat && (
          <Tooltip seat={hoveredSeat} position={cursorPosition} />
        )}

        {activeSelections.length > 0 && (
          <div className="mt-4">
            {!selectedBoarding || !selectedDropping ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-red-600">
                  ⚠️ Please select both boarding and dropping points to continue
                </p>
                <div className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg shadow-sm opacity-50">
                  <div>
                    <p className="text-sm text-gray-500">Selected Seats</p>
                    <p className="font-semibold text-gray-900">
                      {activeSelections
                        .map((id) => {
                          const [rowIdx, colIdx] = id.split('-').map(Number);
                          return seatLayout[rowIdx]?.[colIdx]?.name || id;
                        })
                        .join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{activeSelections.length * 500}
                    </p>
                  </div>
                  <button
                    disabled
                    className="px-6 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                <div>
                  <p className="text-sm text-gray-500">Selected Seats</p>
                  <p className="font-semibold text-gray-900">
                    {activeSelections
                      .map((id) => {
                        const [rowIdx, colIdx] = id.split('-').map(Number);
                        return seatLayout[rowIdx]?.[colIdx]?.name || id;
                      })
                      .join(', ')}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{activeSelections.length * 500}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const isValid = validateBeforeContinue();
                    if (!isValid) {
                      toast.error(
                        'Please select boarding point, dropping point and seats'
                      );
                      return;
                    }

                    toast.success('Proceeding to booking...');
                  }}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Seat = ({ seat, isSelected, onClick, onHover, onLeave }) => {
  const resolveSeatColor = () => {
    if (seat?.type === 'booked') return 'bg-gray-400';
    if (isSelected) return 'bg-green-500';
    if (seat?.gender === 'ladies') return 'bg-pink-300';
    return 'bg-white';
  };

  return (
    <div
      onMouseEnter={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`relative flex items-center justify-center w-7 ${
        seat.type === 'booked'
          ? 'cursor-not-allowed opacity-70'
          : 'cursor-pointer'
      }`}
    >
      <div
        className={`w-7 h-5 rounded border border-gray-700 ${resolveSeatColor()}`}
      />

      <div
        className={`absolute w-5 h-7 border-[3px] border-l-0 -right-1 ${
          isSelected ? 'border-green-500' : 'border-gray-400'
        }`}
      />
    </div>
  );
};

const Tooltip = ({ seat, position }) => {
  return (
    <div
      className="fixed z-50 w-64 p-3 bg-white border shadow-xl pointer-events-none rounded-xl"
      style={{ top: position?.y + 10, left: position?.x + 10 }}
    >
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        Seat Information
      </h2>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Seat No</span>
        <span className="font-medium">{seat?.name}</span>
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className="text-gray-500">Status</span>
        <span className="font-medium capitalize">{seat?.type}</span>
      </div>

      {seat?.type !== 'booked' && (
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-500">Reservation</span>
          <span className="font-medium capitalize">
            {seat?.gender === 'ladies' ? 'Women Only' : 'Open'}
          </span>
        </div>
      )}

      <div className="flex justify-between pt-2 mt-3 text-sm border-t">
        <span className="font-medium text-gray-600">Fare</span>
        <span className="font-semibold text-green-600">₹{seat?.price}</span>
      </div>
    </div>
  );
};

export default SeatSelection;
