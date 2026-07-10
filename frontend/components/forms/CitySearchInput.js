import { useState, useRef, useEffect } from 'react';

export default function CitySearchInput({
  label,
  name,
  value,
  onChange,
  onSelect,
  suggestions,
  error,
  placeholder = 'Enter city',
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    if (val.length > 0) {
      const filtered = suggestions
        .filter((city) => city.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (city) => {
    onSelect(city);
    setFilteredSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="flex-1 min-w-[140px] relative group" ref={inputRef}>
      <div className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">
        {label}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => filteredSuggestions.length > 0 && setShowDropdown(true)}
        className={`w-full px-3 py-2 text-sm text-white bg-transparent border rounded-lg outline-none transition-colors placeholder-white/40 ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-white/20 focus:border-white/40'
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
      {showDropdown && filteredSuggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-1 overflow-auto border rounded-lg shadow-xl max-h-48 bg-black/95 backdrop-blur-lg border-white/20">
          {filteredSuggestions.map((city) => (
            <li
              key={city}
              onClick={() => handleSelect(city)}
              className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
            >
              <span className="font-medium">{city}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
