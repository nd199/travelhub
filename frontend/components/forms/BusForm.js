import { forwardRef, useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { cities, mockBusResults } from '../../lib/data/lib';

const getToday = () => new Date().toISOString().split('T')[0];
const getTomorrow = () => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split('T')[0];
};

const busValidationSchema = Yup.object({
  fromCity: Yup.string()
    .required('From city is required')
    .test(
      'not-same',
      'From and To cities cannot be the same',
      function (value) {
        return value !== this.parent.toCity;
      }
    ),
  toCity: Yup.string()
    .required('To city is required')
    .test(
      'not-same',
      'From and To cities cannot be the same',
      function (value) {
        return value !== this.parent.fromCity;
      }
    ),
  date: Yup.string()
    .required('Date is required')
    .min(getToday(), 'Date cannot be in the past'),
});

export function BusForm({ onTabChange, activeTab: externalTab }) {
  const [internalTab, setInternalTab] = useState('bus');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const [showSuccess, setShowSuccess] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showWomenSeatsOnly, setShowWomenSeatsOnly] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      fromCity: '',
      toCity: '',
      date: '',
    },
    validationSchema: busValidationSchema,
    onSubmit: (values) => {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        const mockResults = mockBusResults;
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1500);
    },
  });

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
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, [setShowFromDropdown, setShowToDropdown]);

  const handleFromChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('fromCity', value);
    if (value.length > 0) {
      const filtered = cities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .filter((city) => city !== formik.values.toCity);
      setFromSuggestions(filtered.slice(0, 5));
      setShowFromDropdown(filtered.length > 0);
    } else {
      setFromSuggestions([]);
      setShowFromDropdown(false);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('toCity', value);
    if (value.length > 0) {
      const filtered = cities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .filter((city) => city !== formik.values.fromCity);
      setToSuggestions(filtered.slice(0, 5));
      setShowToDropdown(filtered.length > 0);
    } else {
      setToSuggestions([]);
      setShowToDropdown(false);
    }
  };

  const selectFromCity = (city) => {
    formik.setFieldValue('fromCity', city);
    setFromSuggestions([]);
    setShowFromDropdown(false);
  };

  const selectToCity = (city) => {
    formik.setFieldValue('toCity', city);
    setToSuggestions([]);
    setShowToDropdown(false);
  };

  const handleTabChange = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const bookBus = (bus) => {
    setShowSuccess(true);
    setSearchResults([]);
    successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative w-full max-w-md p-6 border shadow-2xl rounded-3xl backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute top-0 h-px left-4 right-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex p-1 mb-6 rounded-xl bg-white/5">
        {['bus', 'train', 'flight'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 py-2 rounded-lg capitalize font-medium transition-all relative z-10 ${
              activeTab === tab
                ? 'bg-white/70 text-black shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-semibold text-center capitalize">
        Bus Booking
      </h2>

      {searchResults.length === 0 ? (
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="relative">
            <AutocompleteInput
              ref={fromRef}
              label="From"
              name="fromCity"
              value={formik.values.fromCity}
              onChange={handleFromChange}
              onSelect={selectFromCity}
              suggestions={fromSuggestions}
              showDropdown={showFromDropdown}
              setShowDropdown={setShowFromDropdown}
              error={formik.errors.fromCity}
              touched={formik.touched.fromCity}
            />
            <AutocompleteInput
              ref={toRef}
              label="To"
              name="toCity"
              value={formik.values.toCity}
              onChange={handleToChange}
              onSelect={selectToCity}
              suggestions={toSuggestions}
              showDropdown={showToDropdown}
              setShowDropdown={setShowToDropdown}
              error={formik.errors.toCity}
              touched={formik.touched.toCity}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-white/80">Date</label>
            <div className="flex gap-2">
              <input
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={getToday()}
                className={`flex-1 px-4 py-2 text-white transition-all border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 ${
                  formik.errors.date && formik.touched.date
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/15 focus:border-white/25'
                }`}
                style={{ colorScheme: 'dark' }}
              />
              <button
                type="button"
                onClick={() => formik.setFieldValue('date', getToday())}
                className="px-3 py-2 text-sm font-medium transition-all border text-white/70 bg-white/5 border-white/15 rounded-xl hover:bg-white/10 hover:text-white"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => formik.setFieldValue('date', getTomorrow())}
                className="px-3 py-2 text-sm font-medium transition-all border text-white/70 bg-white/5 border-white/15 rounded-xl hover:bg-white/10 hover:text-white"
              >
                Tomorrow
              </button>
            </div>
            {formik.errors.date && formik.touched.date && (
              <p className="mt-1 text-xs text-red-400">{formik.errors.date}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-3 font-semibold text-black transition-all border-0 shadow-lg bg-white/60 rounded-xl hover:bg-white/70 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search Bus'}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {formik.values.fromCity} → {formik.values.toCity}
            </h3>
            <button
              onClick={() => setSearchResults([])}
              className="text-sm text-white/60 hover:text-white"
            >
              Modify
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowWomenSeatsOnly(!showWomenSeatsOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                showWomenSeatsOnly
                  ? 'bg-pink-500/80 text-white border-pink-400'
                  : 'bg-white/5 text-white/70 border-white/15 hover:bg-white/10'
              }`}
            >
              Show Women Seats Only
            </button>
          </div>
          <div className="space-y-2 overflow-auto max-h-80">
            {searchResults
              .filter((bus) => !showWomenSeatsOnly || bus.womenSeats > 0)
              .map((bus) => (
                <div
                  key={bus.id}
                  className="p-4 transition-colors border bg-white/10 border-white/15 rounded-xl hover:bg-white/15"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{bus.operator}</p>
                      <p className="text-sm text-white/60">
                        {bus.departure} - {bus.arrival}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {bus.seats} seats available
                        {bus.womenSeats > 0 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-pink-500/80 text-white text-xs">
                            Women: {bus.womenSeats}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        ₹{bus.price}
                      </p>
                      <button
                        onClick={() => bookBus(bus)}
                        className="mt-2 px-4 py-1.5 text-sm font-medium text-black bg-white/90 rounded-lg hover:bg-white"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 p-3 mx-4 mt-4 text-sm font-medium text-center text-white rounded-lg bg-emerald-500/70 backdrop-blur-md"
        >
          Booking successful! Your bus ticket has been confirmed.
        </motion.div>
      )}
    </motion.div>
  );
}

const AutocompleteInput = forwardRef(function AutocompleteInput(
  {
    label,
    name,
    value,
    onChange,
    onSelect,
    suggestions = [],
    showDropdown,
    setShowDropdown,
    error,
    touched,
    placeholder = 'Enter value',
  },
  ref
) {
  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm text-white/80">{label}</label>

      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        className={`w-full px-4 py-2 text-white transition-all border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 placeholder-white/30 ${
          error && touched
            ? 'border-red-500 focus:border-red-500'
            : 'border-white/15 focus:border-white/25'
        }`}
      />

      {error && touched && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-30 w-full mt-1 overflow-auto border rounded-lg shadow-xl max-h-48 bg-black/95 backdrop-blur-lg border-white/20">
          {suggestions.map((item) => (
            <li
              key={item}
              onClick={() => onSelect(item)}
              className="px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default AutocompleteInput;
