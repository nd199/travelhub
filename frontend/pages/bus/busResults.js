import React, { useState } from 'react';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import BusList from '../../components/busResultsPage/BusList';

const busResults = () => {
  const [buses, setBuses] = useState([
    {
      id: 1,
      operator: 'KSRTC',
      departure: '08:00',
      arrival: '14:00',
      duration: '6h',
      price: 850,
      seats: 12,
      type: 'AC Sleeper',
    },
    {
      id: 2,
      operator: 'SRS Travels',
      departure: '10:30',
      arrival: '16:30',
      duration: '6h',
      price: 750,
      seats: 8,
      type: 'Non-AC Seater',
    },
  ]);

  const [filtered, setFiltered] = useState(buses);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex gap-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <FilterSideBar buses={buses} setFiltered={setFiltered} />
        <div className="flex-1">
          <SortBar buses={filtered} setFiltered={setFiltered} />
          <BusList buses={filtered} />
        </div>
      </div>
    </div>
  );
};

export default busResults;
