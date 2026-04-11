import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import {
  FaBus,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSeat,
} from 'react-icons/fa';

export default function ReviewBooking() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [passengers, setPassengers] = useState([
    { name: '', email: '', phone: '', age: '', gender: 'Male' },
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
    date: query.date ? new Date(query.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '11th April 2026',
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
    setPassengers([
      ...passengers,
      { name: '', email: '', phone: '', age: '', gender: 'Male' },
    ]);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
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
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Review Your Booking
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Journey Details
              </h2>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                  <FaBus className="text-xl text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {bookingDetails.operator}
                  </p>
                  <p className="text-sm text-gray-500">
                    {bookingDetails.busType}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      On Time
                    </span>
                    <span>4.2 ★</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {bookingDetails.departure}
                  </p>
                  <p className="text-sm text-gray-500">{bookingDetails.from}</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute left-0 right-0 h-0.5 bg-gray-300 top-1/2"></div>
                    <div className="relative z-10 px-4 text-xs text-gray-500 bg-white">
                      {bookingDetails.duration}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {bookingDetails.arrival}
                  </p>
                  <p className="text-sm text-gray-500">{bookingDetails.to}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Passenger Details
              </h2>
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="pb-6 mb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                >
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Passenger {index + 1}
                  </p>
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
                            updatePassenger(index, 'name', e.target.value)
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
                            updatePassenger(index, 'email', e.target.value)
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
                            updatePassenger(index, 'phone', e.target.value)
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
                          updatePassenger(index, 'age', e.target.value)
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
                          updatePassenger(index, 'gender', e.target.value)
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
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  + Add more passengers
                </button>
              )}
            </div>

            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Pickup & Drop Points
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-green-600" />
                    <span className="font-medium text-gray-900">
                      Boarding Point
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {bookingDetails.boardingPoint}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Report 30 mins before departure
                  </p>
                </div>
                <div className="p-4 border border-red-100 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    <span className="font-medium text-gray-900">
                      Dropping Point
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {bookingDetails.droppingPoint}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Final stop on the route
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border shadow-sm rounded-xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                GST Details (Optional)
              </h2>
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

          <div className="space-y-6">
            <div className="sticky p-6 bg-white border shadow-sm rounded-xl top-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Fare Summary
              </h2>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">
                  Base Fare ({bookingDetails.seats.length} seats)
                </span>
                <span className="font-medium text-gray-900">
                  ₹{bookingDetails.fare}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">GST (9%)</span>
                <span className="font-medium text-gray-900">
                  ₹{bookingDetails.GST}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">CGST (9%)</span>
                <span className="font-medium text-gray-900">
                  ₹{bookingDetails.GST}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-orange-600">
                  ₹{bookingDetails.total}
                </span>
              </div>

              <div className="p-3 mt-4 border border-blue-100 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <FaSeat className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Selected Seats
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {bookingDetails.seats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 mt-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <FaClock className="text-gray-400" />
                  <span>Journey Duration: {bookingDetails.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Travel Date: {bookingDetails.date}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className="w-full py-3 mt-6 font-semibold text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
