import React, { useState } from 'react';
import {
  FaChair,
  FaWifi,
  FaStar,
  FaFileAlt,
  FaMapMarkerAlt,
  FaTimes,
  FaReceipt,
} from 'react-icons/fa';
import SelectSeats from './ExpandedDetails/SelectSeats';
import AmenitiesAndPhotos from './ExpandedDetails/Amenities&Photos';
import Reviews from './ExpandedDetails/Reviews';
import Policies from './ExpandedDetails/Policies';
import Boarding from './ExpandedDetails/Boarding';
import TripSummary from './ExpandedDetails/TripSummary';
import PassengerDetails from './ExpandedDetails/PassengerDetails';
import { GiCarSeat } from 'react-icons/gi';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';
import { FaUserPlus } from 'react-icons/fa';

const ExpandDetails = ({ bus, onClose, initialTab = 'seats' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [selectedDropping, setSelectedDropping] = useState('');
  const [passengers, setPassengers] = useState([
    { id: 1, name: '', email: '', phone: '', age: '', gender: 'Male', idProof: '' },
  ]);

  const tabs = [
    {
      id: 'seats',
      label: 'Seats & Stops',
      icon: MdAirlineSeatReclineExtra,
    },
    {
      id: 'passengers',
      label: 'Passengers',
      icon: FaUserPlus,
    },
    {
      id: 'summary',
      label: 'Trip Summary',
      icon: FaReceipt,
    },
      { id: 'amenities', label: 'Amenities', icon: FaWifi },
      { id: 'reviews', label: 'Reviews', icon: FaStar },
      { id: 'policies', label: 'Policies', icon: FaFileAlt },
      { id: 'boarding', label: 'Boarding', icon: FaMapMarkerAlt },
  ];

  return (
    <div className="w-full">
       <div className="flex items-center gap-1 p-1 mb-4 bg-orange-100 rounded-xl">
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
        {activeTab === 'seats' && (
          <SelectSeats 
            bus={bus} 
            onSeatSelect={(seats) => setSelectedSeats(seats)}
            onBoardingSelect={(point) => setSelectedBoarding(point)}
            onDroppingSelect={(point) => setSelectedDropping(point)}
          />
        )}
        {activeTab === 'passengers' && (
          <PassengerDetails 
            passengers={passengers}
            setPassengers={setPassengers}
          />
        )}
        {activeTab === 'summary' && (
          <TripSummary 
            bus={bus} 
            selectedSeats={selectedSeats}
            boardingPoint={selectedBoarding}
            droppingPoint={selectedDropping}
            passengers={passengers}
          />
        )}
          {activeTab === 'amenities' && <AmenitiesAndPhotos vehicleId={bus.id} />}
          {activeTab === 'reviews' && <Reviews bus={bus} />}
          {activeTab === 'policies' && <Policies bus={bus} />}
          {activeTab === 'boarding' && <Boarding busId={bus.id} />}
      </div>
    </div>
  );
};

export default ExpandDetails;
