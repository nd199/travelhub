import React, { useState } from 'react';

export default function SeatSelection({ flight, selectedClass, onSeatSelect, selectedSeats = [] }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Generate seat layout based on class type
  const generateSeatLayout = (classType) => {
    switch (classType) {
      case 'First Class':
        return {
          rows: 4,
          cols: 6,
          pattern: [
            [1, 1, 0, 1, 1, 0], // 1 = seat, 0 = aisle
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
          ]
        };
      case 'Business':
        return {
          rows: 8,
          cols: 6,
          pattern: [
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
          ]
        };
      case 'Premium Economy':
        return {
          rows: 12,
          cols: 6,
          pattern: [
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
          ]
        };
      case 'Economy':
      default:
        return {
          rows: 20,
          cols: 6,
          pattern: [
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
            [1, 1, 0, 1, 1, 0],
          ]
        };
    }
  };

  const layout = generateSeatLayout(selectedClass);
  
  // Generate seat status (available, booked, selected)
  const getSeatStatus = (rowIndex, colIndex) => {
    if (layout.pattern[rowIndex][colIndex] === 0) return 'aisle';
    
    const seatNumber = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
    
    // Randomly mark some seats as booked for demonstration
    const bookedSeats = ['2A', '2B', '5C', '5D', '8E', '8F', '12A', '12B', '15C', '15D'];
    if (bookedSeats.includes(seatNumber)) return 'booked';
    
    if (selectedSeats.includes(seatNumber)) return 'selected';
    
    return 'available';
  };

  const handleSeatClick = (rowIndex, colIndex) => {
    if (layout.pattern[rowIndex][colIndex] === 0) return;
    
    const seatNumber = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
    const status = getSeatStatus(rowIndex, colIndex);
    
    if (status === 'available') {
      onSeatSelect([...selectedSeats, seatNumber]);
    } else if (status === 'selected') {
      onSeatSelect(selectedSeats.filter(seat => seat !== seatNumber));
    }
  };

  const getSeatColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 'selected': return 'bg-purple-500 hover:bg-purple-600 border-purple-600 text-white';
      case 'booked': return 'bg-red-100 border-red-300 cursor-not-allowed';
      case 'aisle': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  const getSeatLabel = (rowIndex, colIndex) => {
    if (layout.pattern[rowIndex][colIndex] === 0) return '';
    return `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
  };

  const getSeatType = (colIndex) => {
    if (layout.pattern[0][colIndex] === 0) return 'Aisle';
    if (colIndex === 0 || colIndex === 1) return 'Window';
    if (colIndex === 3 || colIndex === 4) return 'Window';
    return 'Middle';
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Seats - {selectedClass}</h3>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-500 border border-purple-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded">
              Aircraft Seat Map - {selectedClass}
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            {layout.pattern.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2">
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {rowIndex + 1}
                </div>
                {row.map((seat, colIndex) => {
                  const status = getSeatStatus(rowIndex, colIndex);
                  const label = getSeatLabel(rowIndex, colIndex);
                  const seatType = getSeatType(colIndex);
                  
                  if (seat === 0) {
                    return (
                      <div
                        key={colIndex}
                        className="w-10 h-10 bg-gray-100 border border-gray-200 rounded"
                      />
                    );
                  }
                  
                  return (
                    <button
                      key={colIndex}
                      onClick={() => handleSeatClick(rowIndex, colIndex)}
                      onMouseEnter={() => setHoveredSeat(label)}
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={status === 'booked'}
                      className={`w-10 h-10 border rounded text-xs font-medium transition-colors ${getSeatColor(status)} ${
                        status === 'available' || status === 'selected' ? 'cursor-pointer' : 'cursor-not-allowed'
                      }`}
                      title={`${label} - ${seatType}`}
                    >
                      {label}
                    </button>
                  );
                })}
                <div className="w-8 text-center text-sm font-medium text-gray-600">
                  {rowIndex + 1}
                </div>
              </div>
            ))}
          </div>
          
          {/* Seat Type Labels */}
          <div className="flex items-center justify-center mt-4 gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Window</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Middle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Aisle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Seats Display */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-900">Selected Seats:</p>
              <p className="text-sm text-purple-700">{selectedSeats.join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-purple-900">
                Total: {selectedSeats.length} × â¹{flight.price[selectedClass]} = â¹{selectedSeats.length * flight.price[selectedClass]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hover Info */}
      {hoveredSeat && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Seat {hoveredSeat} - {getSeatType(hoveredSeat.charCodeAt(1) - 65)}
        </div>
      )}
    </div>
  );
}
