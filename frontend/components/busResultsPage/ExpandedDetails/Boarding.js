import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { boardingPoints, droppingPoints } from '../../../lib/data/boarding';

const Boarding = () => {
  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Boarding & Dropping Points
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Boarding Points
          </h3>
          <div className="space-y-3">
            {boardingPoints.map((point) => (
              <div
                key={point.id}
                className="p-3 border rounded-lg border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{point.location}</span>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Clock className="w-4 h-4" />
                    {point.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{point.address}</p>
                <p className="text-xs text-gray-400">Landmark: {point.landmark}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Dropping Points
          </h3>
          <div className="space-y-3">
            {droppingPoints.map((point) => (
              <div
                key={point.id}
                className="p-3 border rounded-lg border-gray-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{point.location}</span>
                  <span className="flex items-center gap-1 text-sm text-red-500">
                    <Clock className="w-4 h-4" />
                    {point.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{point.address}</p>
                <p className="text-xs text-gray-400">Landmark: {point.landmark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Please arrive at the boarding point 15 minutes
          before the scheduled departure time. The bus will not wait for late
          passengers.
        </p>
      </div>
    </div>
  );
};

export default Boarding;