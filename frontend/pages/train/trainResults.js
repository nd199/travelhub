import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import TrainList from '../../components/trainResultsPage/TrainList';
import TrainSearchHeader from '../../components/forms/TrainSearchHeader';
import { trainsData } from '../../lib/data/trains';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const TrainResults = () => {
  const router = useRouter();
  const { query } = router;
  const [trains, setTrains] = useState(trainsData);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
  });

  useEffect(() => {
    if (query.from && query.to && query.date) {
      setSearchParams({
        from: query.from,
        to: query.to,
        date: query.date,
      });
      fetchTrains(query.from, query.to, query.date);
    }
  }, [query]);

  const fetchTrains = async (from, to, date) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/trains/search`, {
        origin: from,
        destination: to,
        departureDate: date ? `${date}T00:00:00` : null,
      });
      if (response.data && response.data.length > 0) {
        setTrains(response.data.map(t => ({
          id: t.trainId,
          trainName: t.trainName,
          trainNumber: t.trainNumber,
          boardingPoint: `${t.origin} Station`,
          droppingPoint: `${t.destination} Station`,
          departure: t.departureTime ? new Date(t.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '06:00',
          arrival: t.arrivalTime ? new Date(t.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '12:00',
          duration: '6h 00m',
          price: { 'All Class': t.price || 450, 'General': t.price || 450, 'AC 3 Tier': (t.price || 450) * 2.5, 'AC 2 Tier': (t.price || 450) * 4, 'AC First Class': (t.price || 450) * 6 },
          seats: { 'All Class': t.availableSeats || 100, 'General': 80, 'AC 3 Tier': 25, 'AC 2 Tier': 12, 'AC First Class': 4 },
          type: 'Superfast'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch trains, using mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [filtered, setFiltered] = useState(trains);

  useEffect(() => {
    setFiltered(trains);
  }, [trains]);

  const handleSelectTrain = (train) => {
    const q = new URLSearchParams({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      from: train.boardingPoint.split(' ')[0] || 'Bangalore',
      to: train.droppingPoint.split(' ')[0] || 'Chennai',
      date: searchParams.date || '2026-04-14',
      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
      price: train.price['All Class'] || train.price.Economy || 450,
      type: train.type,
      boardingPoint: train.boardingPoint,
      droppingPoint: train.droppingPoint,
    }).toString();
    router.push(`/train/review?${q}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Navbar />
      <div className="sticky top-0 z-50 mt-16 bg-blue-600 border-b border-blue-700 shadow-md">
        <div className="px-6 py-4">
          <TrainSearchHeader
            initialData={{
              from: searchParams.from || 'Bangalore',
              to: searchParams.to || 'Chennai',
              departure: searchParams.date || '2026-04-14',
            }}
            onSearch={(data) => {
              fetchTrains(data.from, data.to, data.departure);
              toast.success(`Searching: ${data.from} to ${data.to}`);
            }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Filter Sidebar - Sticky */}
        <div className="sticky top-0 left-0 h-screen p-6 overflow-hidden w-68">
          <FilterSideBar buses={trains} setFiltered={setFiltered} />
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 p-6 space-y-4">
          <SortBar buses={filtered} setFiltered={setFiltered} />
          <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl">
            <h2 className="text-lg font-semibold text-gray-700">
              {loading ? 'Searching...' : `${filtered.length} Trains Found`}
            </h2>
            <p className="text-sm text-gray-500">
              {searchParams.from} → {searchParams.to} • {searchParams.date}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Searching for trains...</p>
            </div>
          ) : (
            <TrainList trains={filtered} onSelectTrain={handleSelectTrain} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainResults;
