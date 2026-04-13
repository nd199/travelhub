import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import TrainList from '../../components/trainResultsPage/TrainList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';
import { trainsData } from '../../lib/data/trains';

const trainResults = () => {
  const router = useRouter();
  const { query } = router;
  const [trains] = useState(trainsData);
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

  const [filtered, setFiltered] = useState(trains);

  const handleSelectTrain = (train) => {
    const query = new URLSearchParams({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      from: train.boardingPoint.split(' ')[0] || 'Bangalore',
      to: train.droppingPoint.split(' ')[0] || 'Chennai',
      date: '2026-04-14',
      departure: train.departure,
      arrival: train.arrival,
      duration: train.duration,
      price: train.price['All Class'] || train.price.Economy || 450,
      type: train.type,
      boardingPoint: train.boardingPoint,
      droppingPoint: train.droppingPoint,
    }).toString();
    router.push(`/train/review?${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="sticky top-0 z-50 bg-blue-600 border-b border-blue-700 shadow-md mt-16">
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
          <FilterSideBar buses={trains} setFiltered={setFiltered} />
        </div>

        {/* Results Area - Scrollable */}
        <div className="flex-1 p-6">
          <SortBar buses={filtered} setFiltered={setFiltered} />
          <TrainList trains={filtered} onSelectTrain={handleSelectTrain} />
        </div>
      </div>
    </div>
  );
};

export default trainResults;
