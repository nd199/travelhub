import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import FlightList from '../../components/flightResultsPage/FlightList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';
import { flightsData } from '../../lib/data/flights';

const flightResults = () => {
  const router = useRouter();
  const { query } = router;
  const [flights] = useState(flightsData);
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });

  useEffect(() => {
    if (query.from && query.to && query.date) {
      setSearchParams({
        from: query.from,
        to: query.to,
        date: query.date,
      });
    }
  }, [query]);

  const [filtered, setFiltered] = useState(flights);

  const handleSelectFlight = (flight) => {
    const query = new URLSearchParams({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      from: flight.boardingPoint.split(' ')[0] || 'Bangalore',
      to: flight.droppingPoint.split(' ')[0] || 'Chennai',
      date: '2026-04-14',
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      price: flight.price.Economy || 3200,
      type: flight.type,
      boardingPoint: flight.boardingPoint,
      droppingPoint: flight.droppingPoint,
      stops: flight.stops,
      aircraft: flight.aircraft,
    }).toString();
    router.push(`/flight/review?${query}`);
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
            onSearch={(data) => toast.success(`Searching: ${data.from} to ${data.to}`)}
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
          <FlightList flights={filtered} onSelectFlight={handleSelectFlight} />
        </div>
      </div>
    </div>
  );
};

export default flightResults;
