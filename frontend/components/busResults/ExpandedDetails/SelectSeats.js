import { Square } from 'lucide-react';
import React, { useState } from 'react';
import { GiSteeringWheel } from 'react-icons/gi';
import { initialSeats } from '../../../lib/data/seats';

const SeatSelection = () => {
  const [seatLayout, setSeatLayout] = useState(initialSeats);
  const [activeSelections, setActiveSelections] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // simulate authenticated user
  const currentUserGender = 'male';

  const handleSeatSelection = (rowIndex, colIndex) => {
    const seat = seatLayout[rowIndex][colIndex];
    const seatId = `${rowIndex}-${colIndex}`;

    if (seat.type === 'booked') return;

    if (seat?.reservedFor === 'ladies' && currentUserGender === 'male') {
      alert('This seat is reserved for female passengers');
      return;
    }

    setActiveSelections((prev) =>
      prev?.includes(seatId)
        ? prev?.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">Select Seats</h1>

      {/* Status Indicators */}
      <div className="flex gap-6 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 bg-gray-400 border rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 bg-white border rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 bg-pink-400 border rounded" />
          <span>Reserved (Women)</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 bg-green-500 border rounded" />
          <span>Selected</span>
        </div>
      </div>

      {/* Bus Layout */}
      <div className="flex items-center justify-center w-full mt-6">
        <div className="w-[60px] h-[240px] bg-blue-200 rounded-l-md relative border-2 border-r-0 border-gray-500">
          <GiSteeringWheel className="absolute top-5 left-2" />
        </div>

        <div className="w-[540px] h-[240px] bg-gray-200 rounded-r-md border-2 border-l-0 border-gray-500 p-6">
          <div className="flex flex-col items-end gap-4">
            {seatLayout?.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-6">
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

      {hoveredSeat && <Tooltip seat={hoveredSeat} position={cursorPosition} />}
    </div>
  );
};

const Seat = ({ seat, isSelected, onClick, onHover, onLeave }) => {
  const resolveSeatColor = () => {
    if (seat?.type === 'booked') return 'bg-gray-300';
    if (isSelected) return 'bg-green-500';
    if (seat?.reservedFor === 'ladies') return 'bg-pink-200';
    return 'bg-white';
  };

  return (
    <div
      onMouseEnter={onHover}
      onMouseMove={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`relative flex items-center justify-center w-10 ${
        seat.type === 'booked'
          ? 'cursor-not-allowed opacity-70'
          : 'cursor-pointer'
      }`}
    >
      <div
        className={`w-10 h-7 rounded-md border border-black ${resolveSeatColor()}`}
      />

      <div
        className={`absolute w-6 h-8 border-[4px] border-l-0 -right-1 ${
          isSelected ? 'border-green-500' : 'border-gray-400'
        }`}
      />
    </div>
  );
};

const Tooltip = ({ seat, position }) => {
  return (
    <div
      className="fixed z-50 p-4 bg-white border shadow-xl pointer-events-none w-52 rounded-xl"
      style={{ top: position?.y + 10, left: position?.x + 10 }}
    >
      <h2 className="mb-2 text-sm font-semibold text-gray-800">
        Seat Information
      </h2>

      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Seat No</span>
        <span className="font-medium">#{seat?.number}</span>
      </div>

      <div className="flex justify-between mt-1 text-xs">
        <span className="text-gray-500">Status</span>
        <span className="font-medium capitalize">{seat?.type}</span>
      </div>

      {seat?.type !== 'booked' && (
        <div className="flex justify-between mt-1 text-xs">
          <span className="text-gray-500">Reservation</span>
          <span className="font-medium capitalize">
            {seat?.reservedFor === 'ladies' ? 'Women Only' : 'Open'}
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
