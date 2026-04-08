import React from 'react';
import {
  Wifi,
  Snowflake,
  Power,
  User,
  Gauge,
  Clock,
  Armchair,
  Leaf,
} from 'lucide-react';

const busAmenities = [
  { icon: Wifi, label: 'WiFi', available: true },
  { icon: Snowflake, label: 'AC', available: true },
  { icon: Power, label: 'Charging Point', available: true },
  { icon: Gauge, label: 'USB Port', available: true },
  { icon: Armchair, label: 'Pushback Seats', available: true },
  { icon: Leaf, label: 'Leg Room', available: true },
  { icon: User, label: 'Attendant', available: true },
  { icon: Clock, label: 'Track ETA', available: true },
];

const busPhotos = [
  'https://images.unsplash.com/photo-1557223562-6c4c64d2d85e?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=250&fit=crop',
  'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&h=250&fit=crop',
];

export default function AmenitiesAndPhotos() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {busAmenities.map((amenity, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              amenity.available
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 opacity-50'
            }`}
          >
            <amenity.icon
              className={`w-5 h-5 ${
                amenity.available ? 'text-green-600' : 'text-gray-400'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                amenity.available ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {amenity.label}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Photos</h2>

      <div className="grid grid-cols-2 gap-3">
        {busPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg aspect-[16/10]"
          >
            <img
              src={photo}
              alt={`Bus interior ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
