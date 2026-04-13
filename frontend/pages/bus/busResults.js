import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import BusList from '../../components/busResultsPage/BusList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';
import { busesData } from '../../lib/data/buses';

const busResults = () => {
  const router = useRouter();
  const { query } = router;
  const [buses] = useState(busesData);
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

  const [filtered, setFiltered] = useState(buses);

  const handleSelectBus = (bus) => {
    const query = new URLSearchParams({
      operator: bus.operator,
      from: bus.boardingPoint.split(' ')[0] || 'Chennai',
      to: bus.droppingPoint.split(' ')[0] || 'Bangalore',
      date: '2026-04-11',
      departure: bus.departure,
      arrival: bus.arrival,
      duration: bus.duration,
      price: bus.price,
      type: bus.type,
      seats: bus.seats,
    }).toString();
    router.push(`/bus/review?${query}`);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="sticky top-0 z-50 bg-blue-600 border-b border-blue-700 shadow-md mt-16">
        <div className="px-6 py-4">
          <BusSearchHeader
            initialData={{
              from: searchParams.from || 'Chennai',
              to: searchParams.to || 'Bangalore',
              departure: searchParams.date || '2026-04-10',
            }}
            onSearch={(data) => toast.success(`Searching: ${data.from} to ${data.to}`)}
          />
        </div>
      </div>

      <div className="flex">
        {/* Filter Sidebar - Sticky */}
        <div className="sticky top-0 left-0 h-screen p-6 overflow-hidden w-68">
          <FilterSideBar buses={buses} setFiltered={setFiltered} />
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 p-6">
          <SortBar buses={filtered} setFiltered={setFiltered} />
          <BusList buses={filtered} onSelectBus={handleSelectBus} />
        </div>
      </div>
    </div>
  );
};

export default busResults;
