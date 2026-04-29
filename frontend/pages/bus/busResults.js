import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import BusList from '../../components/busResultsPage/BusList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';
import { searchBuses, setSearchParams } from '../../store/slices/busSlice';

const busResults = () => {
  const router = useRouter();
  const { query } = router;
  const dispatch = useDispatch();
  const { buses, loading, error } = useSelector((state) => state.bus);
  const [searchParams, setSearchParamsState] = useState({
    from: '',
    to: '',
    date: '',
  });

  useEffect(() => {
    if (query.from && query.to && query.date) {
      const params = {
        from: query.from,
        to: query.to,
        date: query.date,
      };
      setSearchParamsState(params);
      dispatch(setSearchParams(params));
      dispatch(searchBuses(params));
    }
  }, [query, dispatch]);

  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setFiltered(buses);
  }, [buses]);

  const handleSelectBus = (bus) => {
    const query = new URLSearchParams({
      operator: bus.operator,
      from: bus.from,
      to: bus.to,
      date: bus.date,
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
      <div className="sticky top-0 z-50 mt-16 bg-blue-600 border-b border-blue-700 shadow-md">
        <div className="px-4 py-2">
          <BusSearchHeader
            initialData={{
              from: searchParams.from || 'Chennai',
              to: searchParams.to || 'Bangalore',
              departure: searchParams.date || '2026-04-10',
            }}
            onSearch={(data) => {
              const params = {
                from: data.from,
                to: data.to,
                date: data.departure,
              };
              dispatch(setSearchParams(params));
              dispatch(searchBuses(params));
              toast.success(`Searching: ${data.from} to ${data.to}`);
            }}
          />
        </div>
      </div>

      <div className="flex">
        {/* Filter Sidebar - Sticky */}
        <div className="sticky top-0 left-0 h-screen p-6 overflow-hidden w-68">
          <FilterSideBar buses={buses} setFiltered={setFiltered} />
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 p-6 space-y-10">
          <div className="sticky top-[120px] z-30 py-2">
            <SortBar buses={filtered} setFiltered={setFiltered} />
          </div>
          <div className="overflow-y-auto">
            <BusList buses={filtered} onSelectBus={handleSelectBus} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default busResults;
