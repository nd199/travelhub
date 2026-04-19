import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import SeatSelection from '../../components/trainResultsPage/SeatSelection';
import TrainSeatLayout2D from '../../components/trainResultsPage/TrainSeatLayout2D';
import Train3D from '../../components/3DModels/Train3D';
import BookingProgress from '../../components/BookingProgress';
import BreadcrumbNavigation from '../../components/BreadcrumbNavigation';
import {
  FaTrain,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChair,
} from 'react-icons/fa';

export default function ReviewBooking() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [passengers, setPassengers] = useState([
    { id: 1, name: '', email: '', phone: '', age: '', gender: 'Male' },
  ]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedClass, setSelectedClass] = useState('AC 3 Tier');
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [show3DView, setShow3DView] = useState(false);

  // Mock train data for seat selection
  const trainData = {
    price: {
      'All Class': 450,
      General: 450,
      'AC 3 Tier': 1100,
      'AC 2 Tier': 1800,
      'AC First Class': 3000,
      Executive: 3500,
    },
  };

  // Realistic Indian Railway seat layout for different coach classes
  const getSeatLayout = (coachClass) => {
    const berthType = (n) => {
      const r = n % 8;
      if (r === 1 || r === 4) return 'LB';
      if (r === 2 || r === 5) return 'MB';
      if (r === 3 || r === 6) return 'UB';
      if (r === 7) return 'SL';
      return 'SU';
    };
    const berthType2A = (n) => {
      const r = n % 4;
      if (r === 1) return 'LB';
      if (r === 2) return 'UB';
      if (r === 3) return 'LB';
      return 'UB';
    };
    const berthType1A = (n) => {
      const r = n % 2;
      return r === 1 ? 'LB' : 'UB';
    };

    switch (coachClass) {
      case 'General':
        // General Coach: 2x3 seating with side berths, 90 seats
        return {
          layout: Array.from({ length: 12 }, (_, bay) => {
            const start = bay * 8 + 1;
            return [
              { type: 'seat', name: `${start}`, berth: 'WS', status: 'available' },
              { type: 'seat', name: `${start + 1}`, berth: 'MS', status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'seat', name: `${start + 2}`, berth: 'MS', status: 'available' },
              { type: 'seat', name: `${start + 3}`, berth: 'WS', status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'seat', name: `${start + 4}`, berth: 'SS', status: 'available' },
              { type: 'seat', name: `${start + 5}`, berth: 'SS', status: 'available' },
            ];
          }),
          coachType: 'General Class',
          totalSeats: 90,
          features: ['No AC', 'Benches', 'High Capacity']
        };
      case 'AC 3 Tier':
        // AC 3 Tier: 2x3 berths + 2 side berths, 72 seats
        return {
          layout: Array.from({ length: 9 }, (_, bay) => {
            const start = bay * 8 + 1;
            return [
              { type: 'berth', name: `${start}`, berth: berthType(start), status: 'available' },
              { type: 'berth', name: `${start + 1}`, berth: berthType(start + 1), status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'berth', name: `${start + 2}`, berth: berthType(start + 2), status: 'available' },
              { type: 'berth', name: `${start + 3}`, berth: berthType(start + 3), status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'berth', name: `${start + 4}`, berth: berthType(start + 4), status: 'available' },
              { type: 'berth', name: `${start + 5}`, berth: berthType(start + 5), status: 'available' },
            ];
          }),
          coachType: 'AC 3 Tier',
          totalSeats: 72,
          features: ['AC', 'Reading Lights', 'Charging Points', 'Bedrolls']
        };
      case 'AC 2 Tier':
        // AC 2 Tier: 2x2 berths + 2 side berths, 54 seats
        return {
          layout: Array.from({ length: 9 }, (_, bay) => {
            const start = bay * 6 + 1;
            return [
              { type: 'berth', name: `${start}`, berth: berthType2A(start), status: 'available' },
              { type: 'berth', name: `${start + 1}`, berth: berthType2A(start + 1), status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'berth', name: `${start + 2}`, berth: berthType2A(start + 2), status: 'available' },
              { type: 'berth', name: `${start + 3}`, berth: berthType2A(start + 3), status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'berth', name: `${start + 4}`, berth: berthType(start + 4), status: 'available' },
              { type: 'berth', name: `${start + 5}`, berth: berthType(start + 5), status: 'available' },
            ];
          }),
          coachType: 'AC 2 Tier',
          totalSeats: 54,
          features: ['AC', 'Reading Lights', 'Charging Points', 'Bedrolls', 'More Space']
        };
      case 'AC First Class':
        // AC 1st Class: 2x2 berths, 24 seats
        return {
          layout: Array.from({ length: 6 }, (_, bay) => {
            const start = bay * 4 + 1;
            return [
              { type: 'berth', name: `${start}`, berth: berthType1A(start), status: 'available' },
              { type: 'berth', name: `${start + 1}`, berth: berthType1A(start + 1), status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'berth', name: `${start + 2}`, berth: berthType1A(start + 2), status: 'available' },
              { type: 'berth', name: `${start + 3}`, berth: berthType1A(start + 3), status: 'available' },
            ];
          }),
          coachType: 'AC First Class',
          totalSeats: 24,
          features: ['Private Cabin', 'AC', 'Premium Bedrolls', 'Attendant Service']
        };
      case 'Executive':
        // Executive Chair Car: 2x2 seating, 56 seats
        return {
          layout: Array.from({ length: 14 }, (_, bay) => {
            const start = bay * 4 + 1;
            return [
              { type: 'seat', name: `${start}`, berth: 'WS', status: 'available' },
              { type: 'seat', name: `${start + 1}`, berth: 'AS', status: 'available' },
              { type: 'aisle', name: '', status: 'aisle' },
              { type: 'seat', name: `${start + 2}`, berth: 'AS', status: 'available' },
              { type: 'seat', name: `${start + 3}`, berth: 'WS', status: 'available' },
            ];
          }),
          coachType: 'Executive Chair Car',
          totalSeats: 56,
          features: ['Reclining Seats', 'AC', 'Table Tray', 'Charging Points', 'Premium Service']
        };
      default:
        return {
          layout: [
            [{ type: 'berth', name: '1', berth: 'LB', status: 'available' }, { type: 'berth', name: '2', berth: 'MB', status: 'available' }, { type: 'aisle', name: '', status: 'aisle' }, { type: 'berth', name: '3', berth: 'UB', status: 'available' }, { type: 'berth', name: '4', berth: 'LB', status: 'available' }, { type: 'berth', name: '5', berth: 'MB', status: 'available' }, { type: 'berth', name: '6', berth: 'UB', status: 'available' }, { type: 'berth', name: '7', berth: 'SL', status: 'available' }, { type: 'berth', name: '8', berth: 'SU', status: 'available' }],
          ],
          coachType: 'Default',
          totalSeats: 8,
          features: []
        };
    }
  };

  const seatLayoutData = getSeatLayout(selectedClass);
  const seatLayout = seatLayoutData.layout;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  const { query } = router;
  const calculateFare = () => {
    const baseFare = selectedSeats.length * trainData.price[selectedClass];
    const gst = Math.round(baseFare * 0.18);
    return {
      baseFare,
      gst,
      total: baseFare + gst,
    };
  };

  const fare = calculateFare();

  const bookingDetails = {
    trainName: query.trainName || 'Vande Bharat Express',
    trainNumber: query.trainNumber || '20601',
    type: query.type || 'Superfast',
    from: query.from || 'Bangalore',
    to: query.to || 'Chennai',
    date: query.date
      ? new Date(query.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '14th April 2026',
    departure: query.departure || '06:00',
    arrival: query.arrival || '12:00',
    duration: query.duration || '6h',
    seats: selectedSeats.length > 0 ? selectedSeats : ['S1', '23'],
    boardingPoint: query.boardingPoint || 'Bangalore City Junction',
    droppingPoint: query.droppingPoint || 'Chennai Central',
    class: selectedClass,
    fare: fare.baseFare,
    GST: fare.gst,
    total: fare.total,
  };

  const addPassenger = () => {
    const newId = Math.max(...passengers.map((p) => p.id), 0) + 1;
    setPassengers([
      ...passengers,
      { id: newId, name: '', email: '', phone: '', age: '', gender: 'Male' },
    ]);
  };

  const removePassenger = (id) => {
    if (passengers.length > 1) {
      const updated = passengers.filter((passenger) => passenger.id !== id);
      setPassengers(updated);
    } else {
      toast.error('At least one passenger is required');
    }
  };

  const updatePassenger = (id, field, value) => {
    const updated = passengers.map((passenger) =>
      passenger.id === id ? { ...passenger, [field]: value } : passenger
    );
    setPassengers(updated);
  };

  const handleBooking = () => {
    const invalid = passengers.some(
      (p) => !p.name || !p.email || !p.phone || !p.age
    );
    if (invalid) {
      toast.error('Please fill all passenger details');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      toast.success('Booking confirmed! Check your email for tickets.');
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar variant="landing" />
      <div className="pt-20 mx-auto max-w-7xl">
        <BreadcrumbNavigation transportType="train" />
        <BookingProgress currentStep={4} transportType="train" />
        
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Review Your Train Booking
          </h1>
          <p className="text-gray-600">
            Please review your journey details and passenger information before
            proceeding
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          <div className="space-y-8 xl:col-span-3">
            <div className="p-8 transition-shadow duration-300 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Journey Details
                </h2>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                  <FaTrain className="text-2xl text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">
                    {bookingDetails.trainName}
                  </p>
                  <p className="text-base font-medium text-gray-600">
                    {bookingDetails.trainNumber} - {bookingDetails.type}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200">
                      â On Time
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <span className="text-yellow-500">â</span> 4.6
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingDetails.departure}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-600">
                    {bookingDetails.from}
                  </p>
                </div>
                <div className="flex-1 px-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 top-1/2"></div>
                    <div className="relative z-10 px-4 py-2 text-sm font-semibold text-blue-700 bg-white border border-blue-200 rounded-full shadow-md">
                      {bookingDetails.duration}
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingDetails.arrival}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-600">
                    {bookingDetails.to}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 transition-shadow duration-300 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Passenger Details
                </h2>
              </div>
              {passengers.map((passenger, index) => (
                <div
                  key={passenger.id}
                  className="pb-6 mb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                        {index + 1}
                      </div>
                      <p className="text-base font-semibold text-gray-800">
                        Passenger {index + 1}
                      </p>
                    </div>
                    {passengers.length > 1 && (
                      <button
                        onClick={() => removePassenger(passenger.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                      >
                        <span className="text-lg">â</span>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Full Name
                      </label>
                      <div className="relative">
                        <FaUser className="absolute text-xs text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="text"
                          value={passenger.name}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              'name',
                              e.target.value
                            )
                          }
                          placeholder="As per ID"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute text-xs text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              'email',
                              e.target.value
                            )
                          }
                          placeholder="For ticket confirmation"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Phone
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute text-xs text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="tel"
                          value={passenger.phone}
                          onChange={(e) =>
                            updatePassenger(
                              passenger.id,
                              'phone',
                              e.target.value
                            )
                          }
                          placeholder="10-digit mobile"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Age
                      </label>
                      <input
                        type="number"
                        value={passenger.age}
                        onChange={(e) =>
                          updatePassenger(passenger.id, 'age', e.target.value)
                        }
                        placeholder="Years"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Gender
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) =>
                          updatePassenger(
                            passenger.id,
                            'gender',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {passengers.length < 6 && (
                <button
                  onClick={addPassenger}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors duration-200 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  <span className="text-lg">+</span>
                  Add more passengers
                </button>
              )}
            </div>

            <div className="p-8 transition-shadow duration-300 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-400 to-purple-600"></div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Seat Selection
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShow3DView(true)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      show3DView
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    3D (Interactive)
                  </button>
                  <button
                    onClick={() => setShow3DView(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      !show3DView
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    2D (Quick Select)
                  </button>
                </div>
              </div>

              {/* Class Selection */}
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="General">
                    General (Rs.{trainData.price.General})
                  </option>
                  <option value="AC 3 Tier">
                    AC 3 Tier (Rs.{trainData.price['AC 3 Tier']})
                  </option>
                  <option value="AC 2 Tier">
                    AC 2 Tier (Rs.{trainData.price['AC 2 Tier']})
                  </option>
                  <option value="AC First Class">
                    AC First Class (Rs.{trainData.price['AC First Class']})
                  </option>
                  <option value="Executive">
                    Executive (Rs.{trainData.price.Executive})
                  </option>
                </select>
                
                {/* Coach Information */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-900">{seatLayoutData.coachType}</h4>
                    <span className="text-sm text-blue-700">{seatLayoutData.totalSeats} seats</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seatLayoutData.features.map((feature, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3D or 2D View */}
              {show3DView ? (
                <div className="mb-6">
                  <Train3D
                    seatLayout={seatLayout}
                    activeSelections={selectedSeats}
                    handleSeatSelection={(rowIndex, colIndex) => {
                      const seatId = `${rowIndex}-${colIndex}`;
                      const seat = seatLayout[rowIndex][colIndex];
                      if (seat && seat.type !== 'aisle') {
                        setSelectedSeats((prev) =>
                          prev.includes(seatId)
                            ? prev.filter((id) => id !== seatId)
                            : [...prev, seatId]
                        );
                      }
                    }}
                    setHoveredSeat={setHoveredSeat}
                    setCursorPosition={setCursorPosition}
                    coachType={selectedClass}
                  />
                  {hoveredSeat && (
                    <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Seat {hoveredSeat.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Class: {selectedClass}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: Rs.{trainData.price[selectedClass]}
                          </p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => {
                              const seatId = selectedSeats.find((id) => {
                                const [row, col] = id.split('-');
                                return (
                                  seatLayout[row][col]?.name ===
                                  hoveredSeat.name
                                );
                              });
                              if (!seatId) {
                                const newSeatId =
                                  selectedSeats.length > 0
                                    ? selectedSeats[selectedSeats.length - 1]
                                    : '0-0';
                                const [row, col] = newSeatId.split('-');
                                const seatToAdd = seatLayout[row][col];
                                if (seatToAdd && seatToAdd.type !== 'aisle') {
                                  setSelectedSeats([
                                    ...selectedSeats,
                                    seatToAdd.name,
                                  ]);
                                }
                              }
                            }}
                            className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <TrainSeatLayout2D
                    seatLayout={seatLayout}
                    selectedSeats={selectedSeats}
                    onSeatSelect={(seatName) => {
                      setSelectedSeats((prev) =>
                        prev.includes(seatName)
                          ? prev.filter((s) => s !== seatName)
                          : [...prev, seatName]
                      );
                    }}
                    selectedClass={selectedClass}
                    trainData={trainData}
                    setHoveredSeat={setHoveredSeat}
                    setCursorPosition={setCursorPosition}
                  />
                  {hoveredSeat && (
                    <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg shadow-lg max-w-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Seat {hoveredSeat.name} ({hoveredSeat.berth})
                          </p>
                          <p className="text-sm text-gray-600">
                            Class: {selectedClass}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: Rs.{trainData.price[selectedClass]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 transition-shadow duration-300 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-400 to-green-600"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Boarding & Dropping Points
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-6 border-2 border-green-200 shadow-lg rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                      <FaMapMarkerAlt className="text-lg text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Boarding Point
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {bookingDetails.boardingPoint}
                  </p>
                  <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Report 30 mins before departure
                  </p>
                </div>
                <div className="p-6 border-2 border-red-200 shadow-lg rounded-xl bg-gradient-to-br from-red-50 to-red-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full">
                      <FaMapMarkerAlt className="text-lg text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Dropping Point
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {bookingDetails.droppingPoint}
                  </p>
                  <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Final stop on the route
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 xl:col-span-1">
            <div className="sticky p-8 transition-shadow duration-300 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 rounded-2xl top-6 hover:shadow-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fare Summary
                </h2>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between px-4 py-4 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-700">
                    Base Fare ({selectedSeats.length} seats × {selectedClass})
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    Rs.{bookingDetails.fare}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-700">GST (9%)</span>
                  <span className="text-lg font-semibold text-gray-900">
                    Rs.{bookingDetails.GST}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-4 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-700">CGST (9%)</span>
                  <span className="text-lg font-semibold text-gray-900">
                    Rs.{bookingDetails.GST}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-5 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <span className="text-lg font-bold text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-white">
                    Rs.{bookingDetails.total}
                  </span>
                </div>
              </div>

              <div className="p-5 mt-6 border-2 border-blue-200 shadow-lg rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
                    <FaChair className="text-lg text-white" />
                  </div>
                  <span className="text-base font-bold text-blue-800">
                    Selected Seats
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookingDetails.seats.map((seat) => (
                    <span
                      key={seat}
                      className="px-4 py-2 text-sm font-bold text-blue-800 bg-blue-200 border-2 border-blue-300 rounded-lg"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 mt-6 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center gap-3 mb-3 text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full">
                    <FaClock className="text-sm text-white" />
                  </div>
                  <span className="font-semibold">
                    Journey Duration: {bookingDetails.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full">
                    <span className="text-xs font-bold text-white">ð</span>
                  </div>
                  <span className="font-semibold">
                    Travel Date: {bookingDetails.date}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className="w-full py-4 mt-8 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p className="mt-3 text-xs text-center text-gray-500">
                By proceeding, you agree to the Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
