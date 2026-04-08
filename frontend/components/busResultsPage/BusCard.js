import { Expand } from 'lucide-react';
import ExpandDetails from './ExpandDetails';
import { useState } from 'react';

export default function BusCard({ bus }) {
  const [expandDetails, setExpandDetails] = useState(false);

  return (
    <div className="flex flex-col justify-between gap-4 p-4 transition bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
      <div className="flex justify-between p-2 border border-gray-200 rounded-xl">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {bus.operator}
          </h3>
          <p className="text-sm text-gray-600">{bus.type}</p>

          <div className="mt-2 text-sm text-gray-700">
            {bus.departure} → {bus.arrival}
          </div>

          <p className="text-xs text-gray-500">
            {bus.duration} • {bus.seats} seats left
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">₹{bus.price}</p>

          <button
            className="px-4 py-1 mt-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            onClick={() => setExpandDetails(true)}
          >
            Select Seat
          </button>
        </div>
      </div>
      <div className="flex justify-between p-6 border border-gray-200 rounded-xl">
        {expandDetails && <ExpandDetails />}
      </div>
    </div>
  );
}
