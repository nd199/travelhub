import React from 'react';

export default function SortBar({ buses, setFiltered }) {
  const sortByPrice = () => {
    const sorted = [...buses].sort((a, b) => a.price - b.price);
    setFiltered(sorted);
  };

  return (
    <div className="flex justify-between p-3 mb-4 border bg-white rounded-xl border-gray-200">
      <span className="text-gray-700">Sort By:</span>

      <button onClick={sortByPrice} className="text-gray-700 hover:text-blue-600">
        Price
      </button>
    </div>
  );
}
