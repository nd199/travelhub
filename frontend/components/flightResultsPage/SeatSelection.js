import React, { useState } from 'react';

export default function SeatSelection({ flight, selectedClass, onSeatSelect, selectedSeats = [] }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Generate realistic seat layout based on aircraft class type
  const generateSeatLayout = (classType) => {
    switch (classType) {
      case 'First Class':
        // First Class: 1-2-1 configuration (private suites)
        return {
          rows: 6,
          cols: 4,
          pattern: [
            [1, 0, 1, 0, 1, 0], // 1 = seat, 0 = aisle/suite divider
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
          ],
          aircraft: 'Boeing 777-300ER',
          features: ['Private Suite', 'Lie-flat Bed', 'Personal Wardrobe']
        };
      case 'Business':
        // Business Class: 1-2-1 configuration (lie-flat seats)
        return {
          rows: 12,
          cols: 4,
          pattern: [
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0],
          ],
          aircraft: 'Airbus A330-300',
          features: ['Lie-flat Seat', 'Direct Aisle Access', 'Privacy Divider']
        };
      case 'Premium Economy':
        // Premium Economy: 2-3-2 configuration
        return {
          rows: 16,
          cols: 7,
          pattern: [
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 1, 1, 0],
          ],
          aircraft: 'Boeing 787-9 Dreamliner',
          features: ['Extra Legroom', 'Wider Seats', 'Priority Boarding']
        };
      case 'Economy':
      default:
        // Economy: 3-3 configuration (narrowbody) or 3-4-3 (widebody)
        return {
          rows: 24,
          cols: 6,
          pattern: [
            [1, 1, 1, 0, 1, 1, 1], // 3-3 configuration
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 1, 1, 0, 1, 1, 1],
          ],
          aircraft: 'Airbus A320neo',
          features: ['Standard Seat', 'Adjustable Headrest', 'USB Charging']
        };
    }
  };

  const layout = generateSeatLayout(selectedClass);
  
  // Generate realistic seat status based on class and booking patterns
  const getSeatStatus = (rowIndex, colIndex) => {
    if (layout.pattern[rowIndex][colIndex] === 0) return 'aisle';
    
    const seatNumber = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
    
    // Realistic booking patterns based on seat desirability
    const isPremiumSeat = (rowIndex, colIndex) => {
      // Front rows, exit rows, and window seats are premium
      const isFrontRow = rowIndex < 3;
      const isExitRow = rowIndex === Math.floor(layout.rows / 3) || rowIndex === Math.floor(2 * layout.rows / 3);
      const isWindow = getSeatType(colIndex) === 'Window';
      return isFrontRow || isExitRow || isWindow;
    };
    
    // Generate realistic booking patterns
    const randomBooking = Math.random();
    let bookingProbability = 0.15; // Base 15% booking rate
    
    if (isPremiumSeat(rowIndex, colIndex)) {
      bookingProbability = 0.35; // Premium seats have higher booking rate
    }
    
    // Middle seats in economy have lower booking rate
    if (selectedClass === 'Economy' && getSeatType(colIndex) === 'Middle') {
      bookingProbability = 0.08;
    }
    
    // Some specific seats always booked for realism
    const alwaysBooked = ['2A', '2B', '5C', '5D', '8E', '8F', '12A', '12B', '15C', '15D'];
    if (alwaysBooked.includes(seatNumber)) return 'booked';
    
    // Random booking based on probability
    if (randomBooking < bookingProbability) return 'booked';
    
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

  const getSeatColor = (status, rowIndex, colIndex) => {
    switch (status) {
      case 'available': {
        // Highlight premium seats
        const isPremium = (rowIndex < 3) || 
          (rowIndex === Math.floor(layout.rows / 3) || rowIndex === Math.floor(2 * layout.rows / 3)) ||
          getSeatType(colIndex) === 'Window';
        return isPremium 
          ? 'bg-blue-100 hover:bg-blue-200 border-blue-300 border-2' 
          : 'bg-green-100 hover:bg-green-200 border-green-300';
      }
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
    
    // Determine seat type based on position in row
    const row = layout.pattern[0];
    const seatPositions = row.map((seat, idx) => seat === 1 ? idx : -1).filter(idx => idx !== -1);
    
    if (seatPositions.length === 0) return 'Aisle';
    
    // First and last seats are windows
    if (colIndex === seatPositions[0] || colIndex === seatPositions[seatPositions.length - 1]) {
      return 'Window';
    }
    
    // Seats next to aisles
    if (colIndex === seatPositions[1] && row[colIndex - 1] === 0) return 'Aisle';
    if (colIndex === seatPositions[seatPositions.length - 2] && row[colIndex + 1] === 0) return 'Aisle';
    
    return 'Middle';
  };

  const getConfigurationString = (row) => {
    const groups = [];
    let currentGroup = 0;
    
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 1) {
        currentGroup++;
      } else {
        if (currentGroup > 0) {
          groups.push(currentGroup);
          currentGroup = 0;
        }
      }
    }
    if (currentGroup > 0) groups.push(currentGroup);
    
    return groups.join('-');
  };

  const getExitRows = (totalRows) => {
    // Exit rows are typically at 1/3 and 2/3 of the aircraft
    const exitRow1 = Math.floor(totalRows / 3);
    const exitRow2 = Math.floor(2 * totalRows / 3);
    return `${exitRow1}, ${exitRow2}`;
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Seats - {selectedClass}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">{layout.aircraft}</span>
          <span>•</span>
          <span>Configuration: {getConfigurationString(layout.pattern[0])}</span>
        </div>
        {layout.features && (
          <div className="flex flex-wrap gap-2 mt-2">
            {layout.features.map((feature, idx) => (
              <span key={idx} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span className="text-gray-600">Premium (Extra Legroom)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-500 border border-purple-600 rounded"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
          <span className="text-gray-600">Aisle</span>
        </div>
      </div>

      {/* Seat Layout */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded">
              {getConfigurationString(layout.pattern[0])} Layout
            </div>
            <div className="text-xs text-gray-500">
              Exit rows: {getExitRows(layout.rows)}
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
                      className={`w-10 h-10 border rounded text-xs font-medium transition-colors ${getSeatColor(status, rowIndex, colIndex)} ${
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
          
          {/* Seat Type Labels and Info */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6 text-xs text-gray-500">
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
            <div className="text-xs text-gray-500">
              💺 Extra legroom on exit rows
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
                Total: {selectedSeats.length} × ₹{flight.price[selectedClass]} = ₹{selectedSeats.length * flight.price[selectedClass]}
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
