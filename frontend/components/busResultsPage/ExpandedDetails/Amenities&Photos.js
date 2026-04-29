import React from 'react';
import { useSelector } from 'react-redux';
// Removed hardcoded data import - using backend API via Redux store
// import { busAmenities, busPhotos } from '../../../lib/data/amenities';

const photoLabels = [
  'Exterior',
  'Seater',
  'Charging-Sockets',
  'AC and Reading Lights',
  'RestRoom',
];

export default function AmenitiesAndPhotos({ vehicleId }) {
  const { amenities, photos, isLoading } = useSelector(state => state.booking);

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Amenities Section */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h2>
      <div className="flex flex-wrap gap-3 mb-6">
        {(amenities || []).map((amenity, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
              amenity.available
                ? 'bg-green-50 border-green-300 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <amenity.icon
              className={`w-5 h-5 flex-shrink-0 ${
                amenity.available ? 'text-green-600' : 'text-gray-400'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                amenity.available ? 'text-gray-800' : 'text-gray-400'
              }`}
            >
              {amenity.label}
            </span>
          </div>
        ))}
      </div>

      {/* Photos Section */}
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Photos</h2>
      <div className="grid grid-cols-4 gap-3">
        {(photos || []).map((photo, index) => (
          <div
            key={index}
            className="relative h-40 overflow-hidden rounded-2xl shadow-lg group"
          >
            <img
              src={photo}
              alt={`Bus ${photoLabels[index % photoLabels.length]}`}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <span className="absolute px-3 py-1 text-sm font-medium text-white bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl">
              {photoLabels[index % photoLabels.length]}
            </span>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
