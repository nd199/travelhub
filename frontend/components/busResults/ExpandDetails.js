import React, { useState } from 'react';
import { Armchair, Wifi, Star, FileText, MapPin } from 'lucide-react';
import SelectSeats from './ExpandedDetails/SelectSeats';

const ExpandDetails = () => {
  const [activeTab, setActiveTab] = useState('seats');

  const tabs = [
    { id: 'seats', label: 'Select Seats', icon: Armchair },
    { id: 'amenities', label: 'Amenities & Photos', icon: Wifi },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'policies', label: 'Policies', icon: FileText },
    { id: 'boarding', label: 'Boarding & Dropping', icon: MapPin },
  ];

  return (
    <div className="w-full p-4 mt-4 border border-gray-200 rounded-md">
      <nav className="flex items-center justify-between w-full border rounded-md bg-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 cursor-pointer transition-colors px-3 py-2 rounded-xl ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon
              size={18}
              className={activeTab === tab.id ? 'text-white' : 'text-gray-600'}
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
      <SelectSeats />
    </div>
  );
};

export default ExpandDetails;
