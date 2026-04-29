import React, { useState } from 'react';
import { FaSortAmountDown, FaArrowUp, FaArrowDown, FaClock } from 'react-icons/fa';

export default function SortBar({ buses, setFiltered }) {
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }

    const sorted = [...buses].sort((a, b) => {
      let comparison = 0;
      if (type === 'price') {
        comparison = a.price - b.price;
      } else if (type === 'departure') {
        comparison = a.departure.localeCompare(b.departure);
      } else if (type === 'duration') {
        comparison = parseFloat(a.duration) - parseFloat(b.duration);
      } else if (type === 'rating') {
        comparison = (a.rating || 0) - (b.rating || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setFiltered(sorted);
  };

  const sortOptions = [
    { id: 'price', label: 'Price' },
    { id: 'departure', label: 'Departure Time' },
    { id: 'duration', label: 'Duration' },
    { id: 'rating', label: 'Rating' },
  ];

  return (
    <div className="flex items-center justify-between p-4 mb-4 bg-gradient-to-r from-primary via-primary-light to-tertiary border border-tertiary-light shadow-sm rounded-xl">
      <div className="flex items-center gap-2">
        <FaSortAmountDown className="text-accent" />
        <span className="text-sm font-medium text-white">Sort By:</span>
      </div>

      <div className="flex items-center gap-1">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSort(option.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              sortBy === option.id
                ? 'bg-accent text-primary font-medium'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {option.label}
            {sortBy === option.id && (
              sortOrder === 'asc' ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}