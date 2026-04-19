import { useState } from 'react';

export default function TrainSeatLayout2D({
  seatLayout,
  selectedSeats,
  onSeatSelect,
  selectedClass,
  trainData,
  setHoveredSeat,
  setCursorPosition,
}) {
  const berthColors = {
    LB: { bg: 'bg-blue-100', border: 'border-blue-300', hover: 'hover:bg-blue-200' },
    MB: { bg: 'bg-purple-100', border: 'border-purple-300', hover: 'hover:bg-purple-200' },
    UB: { bg: 'bg-orange-100', border: 'border-orange-300', hover: 'hover:bg-orange-200' },
    SL: { bg: 'bg-yellow-100', border: 'border-yellow-300', hover: 'hover:bg-yellow-200' },
    SU: { bg: 'bg-amber-100', border: 'border-amber-300', hover: 'hover:bg-amber-200' },
  };

  const getSeatClass = (seat) => {
    if (!seat || seat.type === 'aisle') return '';
    const berth = seat.berth || '';
    const colors = berthColors[berth] || berthColors['LB'];
    const isSelected = selectedSeats.includes(seat.name);
    return isSelected
      ? 'bg-green-500 text-white border-green-600'
      : `${colors.bg} ${colors.border} ${colors.hover}`;
  };

  return (
    <div className="relative">
      <div className="inline-block p-6 border bg-gray-50 rounded-xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-lg border">
            Coach Layout - {selectedClass}
          </span>
        </div>

        {seatLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-8 mb-6">
            {/* Left Berths (LB / MB / UB) */}
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => {
                const seat = row[i];
                if (!seat || seat.type === 'aisle') return null;
                const isSelected = selectedSeats.includes(seat.name);
                return (
                  <div
                    key={i}
                    onClick={() => onSeatSelect(seat.name)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onMouseMove={(e) => setCursorPosition({ x: e.clientX, y: e.clientY })}
                    className={`w-12 h-10 flex flex-col items-center justify-center text-xs font-semibold rounded cursor-pointer transition ${getSeatClass(seat)}`}
                  >
                    <span>{seat.name}</span>
                    {seat.berth && <span className="text-[8px] opacity-70">{seat.berth}</span>}
                  </div>
                );
              })}
            </div>

            {/* Aisle */}
            <div className="w-6" />

            {/* Right Berths (LB / MB / UB) */}
            <div className="flex flex-col gap-2">
              {[3, 4, 5].map((i) => {
                const seat = row[i];
                if (!seat || seat.type === 'aisle') return null;
                const isSelected = selectedSeats.includes(seat.name);
                return (
                  <div
                    key={i}
                    onClick={() => onSeatSelect(seat.name)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onMouseMove={(e) => setCursorPosition({ x: e.clientX, y: e.clientY })}
                    className={`w-12 h-10 flex flex-col items-center justify-center text-xs font-semibold rounded cursor-pointer transition ${getSeatClass(seat)}`}
                  >
                    <span>{seat.name}</span>
                    {seat.berth && <span className="text-[8px] opacity-70">{seat.berth}</span>}
                  </div>
                );
              })}
            </div>

            {/* Side Berths (SL / SU) */}
            <div className="flex flex-col gap-2 ml-6">
              {[6, 7].map((i) => {
                const seat = row[i];
                if (!seat || seat.type === 'aisle') return null;
                const isSelected = selectedSeats.includes(seat.name);
                return (
                  <div
                    key={i}
                    onClick={() => onSeatSelect(seat.name)}
                    onMouseEnter={() => setHoveredSeat(seat)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    onMouseMove={(e) => setCursorPosition({ x: e.clientX, y: e.clientY })}
                    className={`w-12 h-10 flex flex-col items-center justify-center text-xs font-semibold rounded cursor-pointer transition ${getSeatClass(seat)}`}
                  >
                    <span>{seat.name}</span>
                    {seat.berth && <span className="text-[8px] opacity-70">{seat.berth}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-blue-100 border border-blue-300 rounded"></div>
          <span className="text-xs text-gray-600">Lower (LB)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-purple-100 border border-purple-300 rounded"></div>
          <span className="text-xs text-gray-600">Middle (MB)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-orange-100 border border-orange-300 rounded"></div>
          <span className="text-xs text-gray-600">Upper (UB)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-xs text-gray-600">Side Lower (SL)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-amber-100 border border-amber-300 rounded"></div>
          <span className="text-xs text-gray-600">Side Upper (SU)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Selected</span>
        </div>
      </div>
    </div>
  );
}