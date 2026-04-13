import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import {
  FaBus,
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
  const bookingDetails = {
    operator: query.operator || 'IntrCity SmartBus',
    busType: query.type || 'AC Sleeper (2+1)',
    from: query.from || 'Chennai',
    to: query.to || 'Bangalore',
    date: query.date
      ? new Date(query.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '11th April 2026',
    departure: query.departure || '22:30',
    arrival: query.arrival || '05:30',
    duration: query.duration || '7h',
    seats: query.seats ? [query.seats] : ['1A', '1B', '1C'],
    boardingPoint: 'Koyambedu',
    droppingPoint: 'Electronic City',
    fare: parseInt(query.price) || 1250,
    GST: 112,
    total: (parseInt(query.price) || 1250) + 224,
  };

  const addPassenger = () => {
    const newId = Math.max(...passengers.map(p => p.id), 0) + 1;
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
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-300 to-gray-400">
      <Navbar variant="landing" />
      <div className="max-w-7xl mx-auto pt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Review Your Booking
          </h1>
          <p className="text-gray-600">Please review your journey details and passenger information before proceeding</p>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
          <div className="space-y-6 xl:col-span-4">
            <div className="p-6 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Journey Details
                </h2>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-lg">
                  <FaBus className="text-2xl text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-900">
                    {bookingDetails.operator}
                  </p>
                  <p className="text-base text-gray-600 font-medium">
                    {bookingDetails.busType}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200">
                      ✓ On Time
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <span className="text-yellow-500">★</span> 4.2
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingDetails.departure}
                  </p>
                  <p className="text-base font-semibold text-gray-600 mt-1">{bookingDetails.from}</p>
                </div>
                <div className="flex-1 px-6">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-orange-300 to-orange-400 top-1/2 rounded-full"></div>
                    <div className="relative z-10 px-4 py-2 text-sm font-semibold text-orange-700 bg-white rounded-full shadow-md border border-orange-200">
                      {bookingDetails.duration}
                    </div>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingDetails.arrival}
                  </p>
                  <p className="text-base font-semibold text-gray-600 mt-1">{bookingDetails.to}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
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
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                        <span className="text-lg">−</span>
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
                            updatePassenger(passenger.id, 'name', e.target.value)
                          }
                          placeholder="As per ID"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                            updatePassenger(passenger.id, 'email', e.target.value)
                          }
                          placeholder="For ticket confirmation"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                            updatePassenger(passenger.id, 'phone', e.target.value)
                          }
                          placeholder="10-digit mobile"
                          className="w-full py-2 pr-3 text-sm border rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-500">
                        Gender
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) =>
                          updatePassenger(passenger.id, 'gender', e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 border border-orange-200"
                >
                  <span className="text-lg">+</span>
                  Add more passengers
                </button>
              )}
            </div>

            <div className="p-8 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pickup & Drop Points
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-6 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      Boarding Point
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {bookingDetails.boardingPoint}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Report 30 mins before departure
                  </p>
                </div>
                <div className="p-6 border-2 border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-white text-lg" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      Dropping Point
                    </span>
                  </div>
                  <p className="text-base font-semibold text-gray-800">
                    {bookingDetails.droppingPoint}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Final stop on the route
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  GST Details (Optional)
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs text-gray-500">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="For business booking"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">
                    GST Number
                  </label>
                  <input
                    type="text"
                    placeholder="15 digit GSTIN"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 xl:col-span-2">
            <div className="sticky p-8 bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl rounded-2xl top-6 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-900">
                  Fare Summary
                </h2>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Base Fare ({bookingDetails.seats.length} seats)
                  </span>
                  <span className="font-semibold text-gray-900 text-lg">
                    ₹{bookingDetails.fare}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">GST (9%)</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    ₹{bookingDetails.GST}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">CGST (9%)</span>
                  <span className="font-semibold text-gray-900 text-lg">
                    ₹{bookingDetails.GST}
                  </span>
                </div>
                <div className="flex items-center justify-between py-5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mt-4">
                  <span className="font-bold text-white text-lg">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-white">
                    ₹{bookingDetails.total}
                  </span>
                </div>
              </div>

              <div className="p-5 mt-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaChair className="text-white text-lg" />
                  </div>
                  <span className="text-base font-bold text-blue-800">
                    Selected Seats
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {bookingDetails.seats.map((seat) => (
                    <span
                      key={seat}
                      className="px-4 py-2 text-sm font-bold text-blue-800 bg-blue-200 rounded-lg border-2 border-blue-300"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 mt-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                <div className="flex items-center gap-3 mb-3 text-gray-700">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <FaClock className="text-white text-sm" />
                  </div>
                  <span className="font-semibold">Journey Duration: {bookingDetails.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">📅</span>
                  </div>
                  <span className="font-semibold">Travel Date: {bookingDetails.date}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className="w-full py-4 mt-8 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
