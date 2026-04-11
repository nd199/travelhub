import React, { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import FilterSideBar from '../../components/busResultsPage/FilterSideBar';
import SortBar from '../../components/busResultsPage/SortBar';
import BusList from '../../components/busResultsPage/BusList';
import BusSearchHeader from '../../components/forms/BusSearchHeader';

const busResults = () => {
  const router = useRouter();
  const [buses] = useState([
    {
      id: 1,
      operator: 'KSRTC',
      departure: '08:00',
      arrival: '14:00',
      duration: '6h',
      price: 850,
      seats: 12,
      type: 'AC Sleeper',
      boardingPoint: 'City Center Bus Stand',
      droppingPoint: 'MGM Bus Stand',
      rating: 4.2,
      reviews: 128,
      amenities: { AC: true, WiFi: true, 'Charging Point': true },
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
      boardingPoint: 'South Junction',
      droppingPoint: 'Airport Junction',
      rating: 4.5,
      reviews: 89,
      amenities: { 'Charging Point': true, 'Water Bottle': true },
    },
    {
      id: 3,
      operator: 'Orange Tours',
      departure: '14:00',
      arrival: '20:00',
      duration: '6h',
      price: 920,
      seats: 15,
      type: 'AC Seater',
      boardingPoint: 'Central Station',
      droppingPoint: 'MGM Bus Stand',
      rating: 4.0,
      reviews: 64,
      amenities: { AC: true, WiFi: true, 'Charging Point': true, Snacks: true },
    },
    {
      id: 4,
      operator: 'APSRTC',
      departure: '18:00',
      arrival: '23:30',
      duration: '5h 30m',
      price: 680,
      seats: 20,
      type: 'Non-AC Sleeper',
      boardingPoint: 'City Center Bus Stand',
      droppingPoint: 'Railway Station',
      rating: 3.8,
      reviews: 156,
      amenities: { 'Water Bottle': true, 'Reading Light': true },
    },
    {
      id: 5,
      operator: 'VRL Travels',
      departure: '21:00',
      arrival: '05:00',
      duration: '8h',
      price: 1100,
      seats: 6,
      type: 'AC Sleeper',
      boardingPoint: 'South Junction',
      droppingPoint: 'Airport Junction',
      rating: 4.7,
      reviews: 203,
      amenities: {
        AC: true,
        WiFi: true,
        'Charging Point': true,
        CCTV: true,
        'Water Facility': true,
      },
    },
  ]);

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
      <div className="sticky top-0 z-50 bg-blue-600 border-b border-blue-700 shadow-md">
        <div className="px-6 py-4">
          <BusSearchHeader
            initialData={{
              from: 'Chennai',
              to: 'Bangalore',
              departure: '2026-04-10',
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
