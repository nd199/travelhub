import React from 'react';
import { busAmenities, busPhotos } from '../../../lib/data/amenities';

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
              alt={`Bus ${photo}`}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
