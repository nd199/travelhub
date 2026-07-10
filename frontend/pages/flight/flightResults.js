import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import FlightList from '../../components/flightResultsPage/FlightList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';
import { flightsData } from '../../lib/data/flights';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const FlightResults = () => {
  const router = useRouter();
  const { query } = router;
  const [flights, setFlights] = useState(flightsData);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });

  useEffect(() => {
    if (query.from && query.to && query.date) {
      setSearchParams({
        from: query.from,
        to: query.to,
        date: query.date,
      });
      fetchFlights(query.from, query.to, query.date);
    }
  }, [query]);

  const fetchFlights = async (from, to, date) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/flights/search`, {
        origin: from,
        destination: to,
        departureDate: date ? `${date}T00:00:00` : null,
      });
      if (response.data && response.data.length > 0) {
        setFlights(response.data.map(f => ({
          id: f.flightId,
          airline: f.airline,
          flightNumber: f.flightNumber,
          boardingPoint: `${f.origin} Airport`,
          droppingPoint: `${f.destination} Airport`,
          departure: f.departureTime ? new Date(f.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '06:00',
          arrival: f.arrivalTime ? new Date(f.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '08:30',
          duration: '1h 30m',
          price: { Economy: f.price || 3200, Business: (f.price || 3200) * 2.5, 'First Class': (f.price || 3200) * 5 },
          seats: { Economy: f.availableSeats || 45, Business: 12, 'First Class': 4 },
          type: 'Non-stop',
          aircraft: 'Airbus A320'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch flights, using mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [filtered, setFiltered] = useState(flights);

  useEffect(() => {
    setFiltered(flights);
  }, [flights]);

  const handleSelectFlight = (flight) => {
    const q = new URLSearchParams({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flight.boardingPoint.split(' ')[0] || 'Bangalore',
      to: flight.droppingPoint.split(' ')[0] || 'Chennai',
      date: searchParams.date || '2026-04-14',
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      price: flight.price.Economy || 3200,
      type: flight.type,
      boardingPoint: flight.boardingPoint,
      droppingPoint: flight.droppingPoint,
      stops: flight.type,
      aircraft: flight.aircraft,
    }).toString();
    router.push(`/flight/review?${q}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <Navbar />
      <div className="sticky top-0 z-50 bg-purple-600 border-b border-purple-700 shadow-md mt-16">
        <div className="px-6 py-4">
          <BusSearchHeader
            initialData={{
              from: searchParams.from || 'Bangalore',
              to: searchParams.to || 'Chennai',
              departure: searchParams.date || '2026-04-14',
            }}
            onSearch={(data) => {
              fetchFlights(data.from, data.to, data.departure);
              toast.success(`Searching: ${data.from} to ${data.to}`);
            }}
          />
        </div>
      </div>

      <div className="flex">
        {/* Filter Sidebar - Sticky */}
        <div className="sticky top-0 left-0 h-screen p-6 overflow-hidden w-68">
          <FilterSideBar buses={flights} setFiltered={setFiltered} />
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 p-6">
          <SortBar buses={filtered} setFiltered={setFiltered} />
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-gray-500">Searching for flights...</p>
            </div>
          ) : (
            <FlightList flights={filtered} onSelectFlight={handleSelectFlight} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
