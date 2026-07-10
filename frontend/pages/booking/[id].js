import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { getBookingDetails } from '../../store/slices/userSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import Link from 'next/link';

export default function BookingDetailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { currentBooking, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id) {
      dispatch(getBookingDetails(id));
    }
  }, [id, isAuthenticated, dispatch, router]);

  if (!isAuthenticated || !currentBooking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const booking = currentBooking;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="pt-24 pb-12 mx-auto max-w-3xl px-4">
        <div className="mb-6">
          <Link href="/bookings" className="text-sm text-blue-600 hover:underline">
            ← Back to Bookings
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-6 ${
            booking.status === 'CONFIRMED' ? 'bg-gradient-to-r from-green-500 to-green-600' :
            booking.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
            booking.status === 'COMPLETED' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
            'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-2xl font-bold">Booking Confirmed</h1>
                <p className="text-sm opacity-90 mt-1">
                  Booking Reference: {booking.bookingReference || booking.id}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Journey Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold text-gray-900">{booking.origin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-semibold text-gray-900">{booking.destination || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">
                  {booking.departureDate
                    ? new Date(booking.departureDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transport</p>
                <p className="font-semibold text-gray-900">{booking.transportType || 'Bus'}</p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          {booking.passengers && booking.passengers.length > 0 && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Passenger Details</h2>
              <div className="space-y-3">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{passenger.name}</p>
                      <p className="text-sm text-gray-500">{passenger.age} years • {passenger.gender}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium text-gray-900">₹{booking.totalAmount || 0}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-₹{booking.discountAmount}</span>
                </div>
              )}
              {booking.taxAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">₹{booking.taxAmount}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t mt-2">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">₹{booking.finalAmount || booking.totalAmount || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Book Another Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
