import React from 'react';

const FilterSideBar = ({ buses, setFiltered }) => {
  const filterAC = () => {
    let filtered = buses?.filter((bus) => bus.type.includes('AC'));
    setFiltered(filtered);
  };

  const filterCheap = () => {
    const result = buses.filter((bus) => bus.price < 800);
    setFiltered(result);
  };

  return (
    <div className="w-64 p-4 border bg-white rounded-xl border-gray-200">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters</h2>
      <button
        onClick={filterAC}
        className="block w-full mb-2 text-left text-gray-700 hover:text-blue-600"
      >
        Ac Buses
      </button>
      <button
        onClick={filterCheap}
        className="block w-full text-left text-gray-700 hover:text-blue-600"
      >
        Under ₹800
      </button>
    </div>
  );
};

export default FilterSideBar;
