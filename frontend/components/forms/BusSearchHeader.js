import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaExchangeAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { fetchCities } from '../../store/slices/citySlice';

export function BusSearchHeader({ initialData, onSearch }) {
  const dispatch = useDispatch();
  const { cities, loading: citiesLoading } = useSelector((state) => state.city);
  
  const [searchData, setSearchData] = useState(
    initialData || {
      from: '',
      to: '',
      departure: '',
    }
  );

  // Fetch cities on component mount
  useEffect(() => {
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, cities.length]);

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFromChange = (e) => {
    const value = e.target.value;
    setSearchData({ ...searchData, from: value });
    if (value.length > 0) {
      const filtered = cities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .filter((city) => city !== searchData.to);
      setFromSuggestions(filtered.slice(0, 5));
      setShowFromDropdown(filtered.length > 0);
      setFocusedField('from');
    } else {
      setFromSuggestions([]);
      setShowFromDropdown(false);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setSearchData({ ...searchData, to: value });
    if (value.length > 0) {
      const filtered = cities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .filter((city) => city !== searchData.from);
      setToSuggestions(filtered.slice(0, 5));
      setShowToDropdown(filtered.length > 0);
      setFocusedField('to');
    } else {
      setToSuggestions([]);
      setShowToDropdown(false);
    }
  };

  const selectFromCity = (city) => {
    setSearchData({ ...searchData, from: city });
    setFromSuggestions([]);
    setShowFromDropdown(false);
  };

  const selectToCity = (city) => {
    setSearchData({ ...searchData, to: city });
    setToSuggestions([]);
    setShowToDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleExchange = () => {
    setSearchData({
      ...searchData,
      from: searchData.to,
      to: searchData.from,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between px-5 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="relative flex flex-col gap-1" ref={fromRef}>
            <span className="text-xs tracking-wide text-blue-200 uppercase">
              From
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchData.from}
                onChange={handleFromChange}
                onFocus={() =>
                  fromSuggestions.length > 0 && setShowFromDropdown(true)
                }
                className="text-lg font-semibold text-white placeholder-blue-200 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 w-36"
                placeholder="From"
              />
              {showFromDropdown && fromSuggestions.length > 0 && (
                <ul className="absolute z-30 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl max-h-48">
                  {fromSuggestions.map((city) => (
                    <li
                      key={city}
                      onClick={() => selectFromCity(city)}
                      className="px-3 py-2 text-sm text-gray-800 transition-colors cursor-pointer hover:bg-gray-100"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleExchange}
            className="p-2 mt-4 transition-colors rounded-full bg-white/20 hover:bg-white/30"
          >
            <FaExchangeAlt className="w-4 h-4" />
          </button>

          <div className="relative flex flex-col gap-1" ref={toRef}>
            <span className="text-xs tracking-wide text-blue-200 uppercase">
              To
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchData.to}
                onChange={handleToChange}
                onFocus={() =>
                  toSuggestions.length > 0 && setShowToDropdown(true)
                }
                className="text-lg font-semibold text-white placeholder-blue-200 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 w-36"
                placeholder="To"
              />
              {showToDropdown && toSuggestions.length > 0 && (
                <ul className="absolute z-30 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl max-h-48">
                  {toSuggestions.map((city) => (
                    <li
                      key={city}
                      onClick={() => selectToCity(city)}
                      className="px-3 py-2 text-sm text-gray-800 transition-colors cursor-pointer hover:bg-gray-100"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-px h-12 bg-white/20" />

          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-wide text-blue-200 uppercase">
              Departure
            </span>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
              <FaCalendarAlt className="text-blue-200" />
              <input
                type="date"
                value={searchData.departure}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    departure: e.target.value,
                  })
                }
                className="text-lg font-semibold text-white placeholder-blue-200 bg-transparent border-none outline-none focus:ring-0"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 font-medium text-blue-600 transition-colors bg-white rounded-lg hover:bg-blue-50"
        >
          <FaSearch className="w-4 h-4" />
          Update Search
        </button>
      </div>
    </form>
  );
}

export default BusSearchHeader;
