import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { getUserBookings, cancelBooking } from '../store/slices/userSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import Link from 'next/link';

export default function BookingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { bookings, isLoading, bookingsPagination } = useSelector((state) => state.user);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(getUserBookings({ page: 1, limit: 10, status: activeFilter }));
  }, [isAuthenticated, dispatch, router, activeFilter]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId)).then(() => {
        toast.success('Booking cancelled successfully');
      });
    }
  };

  if (!isAuthenticated) return null;

  const filters = [
    { key: 'all', label: 'All Bookings' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="pt-24 pb-12 mx-auto max-w-5xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">My Bookings</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h2>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Start Booking
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {booking.route || 'Travel Booking'}
                      </h3>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Booking Ref: {booking.bookingReference || booking.id}
                    </p>
                    {booking.departureDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        Date: {new Date(booking.departureDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{booking.finalAmount || booking.totalAmount || 0}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        href={`/booking/${booking.id}`}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        View Details
                      </Link>
                      {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
