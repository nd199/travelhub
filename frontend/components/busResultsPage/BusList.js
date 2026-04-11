import BusCard from './BusCard';
import { FaSearch } from 'react-icons/fa';

export default function BusList({ buses, onSelectBus }) {
  if (!buses || buses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
        <div className="p-4 mb-4 bg-gray-100 rounded-full">
          <FaSearch className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No buses found
        </h3>
        <p className="max-w-md text-center text-gray-500">
          We couldn't find any buses matching your criteria. Try adjusting your
          filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {buses?.map((bus) => (
        <BusCard key={bus.id} bus={bus} onSelectBus={onSelectBus} />
      ))}
    </div>
  );
}
