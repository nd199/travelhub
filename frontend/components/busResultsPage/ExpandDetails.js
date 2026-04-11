import React, { useState } from 'react';
import {
  FaChair,
  FaWifi,
  FaStar,
  FaFileAlt,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';
import SelectSeats from './ExpandedDetails/SelectSeats';
import AmenitiesAndPhotos from './ExpandedDetails/Amenities&Photos';
import Reviews from './ExpandedDetails/Reviews';
import Policies from './ExpandedDetails/Policies';
import Boarding from './ExpandedDetails/Boarding';
import { GiCarSeat } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';

const ExpandDetails = ({ bus, onClose }) => {
  const [activeTab, setActiveTab] = useState('seats');

  const tabs = [
    {
      id: 'seats',
      label: 'Seats & Stops',
      icon: MdAirlineSeatReclineExtra,
    },
    { id: 'amenities', label: 'Amenities', icon: FaWifi },
    { id: 'reviews', label: 'Reviews', icon: FaStar },
    { id: 'policies', label: 'Policies', icon: FaFileAlt },
    { id: 'boarding', label: 'Boarding', icon: FaMapMarkerAlt },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 p-1 mb-4 overflow-x-auto bg-orange-100 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-orange-700 hover:text-orange-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-white border border-gray-200 rounded-xl">
        {activeTab === 'seats' && <SelectSeats bus={bus} />}
        {activeTab === 'amenities' && <AmenitiesAndPhotos bus={bus} />}
        {activeTab === 'reviews' && <Reviews bus={bus} />}
        {activeTab === 'policies' && <Policies bus={bus} />}
        {activeTab === 'boarding' && <Boarding bus={bus} />}
      </div>
    </div>
  );
};

export default ExpandDetails;
