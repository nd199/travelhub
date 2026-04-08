import React from 'react';
import {
  Wifi,
  Snowflake,
  Power,
  Zap,
  BookOpen,
  Coffee,
  Video,
  Timer,
  Armchair,
  Droplet,
} from 'lucide-react';

const busAmenities = [
  { icon: Wifi, label: 'WiFi', available: true },
  { icon: Snowflake, label: 'AC', available: true },
  { icon: Power, label: 'Charging Point', available: true },
  { icon: Zap, label: 'Water Bottle', available: true },
  { icon: BookOpen, label: 'Reading Light', available: true },
  { icon: Coffee, label: 'Snacks', available: true },
  { icon: Video, label: 'CCTV', available: true },
  { icon: Timer, label: 'Track ETA', available: true },
  { icon: Armchair, label: 'Pushback Seats', available: true },
  { icon: Droplet, label: 'Water Facility', available: true },
];

const busPhotos = [
  // Exterior (premium coach)
  'https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=800',

  // Seater interior
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800',

  // Sleeper bus interior
  'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',

  // Seat close-up / amenities
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
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
