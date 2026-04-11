import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import {
  cities,
  cityCodes,
  mockTrainResults,
  mockPnrResult,
} from '../../lib/data/lib';

const trainValidationSchema = Yup.object({
  fromCity: Yup.string()
    .required('From city is required')
    .notOneOf([Yup.ref('toCity')], 'From and To cities cannot be the same'),
  toCity: Yup.string()
    .required('To city is required')
    .notOneOf([Yup.ref('fromCity')], 'From and To cities cannot be the same'),
  date: Yup.string().required('Date is required'),
});

export function TrainForm({ onTabChange, activeTab: externalTab }) {
  const [internalTab, setInternalTab] = useState('train');
  const activeTab = externalTab !== undefined ? externalTab : internalTab;

  const [showSuccess, setShowSuccess] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pnrMode, setPnrMode] = useState(false);
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrResult, setPnrResult] = useState(null);
  const [checkingPnr, setCheckingPnr] = useState(false);
  const [trainNumber, setTrainNumber] = useState('');
  const [liveStatusResult, setLiveStatusResult] = useState(null);
  const [checkingLive, setCheckingLive] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      fromCity: '',
      toCity: '',
      date: '',
      travelClass: 'All Class',
      quota: 'General',
      ladiesQuota: false,
      seniorCitizen: false,
    },
    validationSchema: trainValidationSchema,
    onSubmit: (values) => {
      setIsSearching(true);
      setTimeout(() => {
        const mockResults = mockTrainResults;
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFromChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('fromCity', value);
    if (value.length > 0) {
      const filtered = cities
        .filter(
          (city) =>
            city.toLowerCase().includes(value.toLowerCase()) ||
            cityCodes[city].toLowerCase().includes(value.toLowerCase())
        )
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
        .filter(
          (city) =>
            city.toLowerCase().includes(value.toLowerCase()) ||
            cityCodes[city].toLowerCase().includes(value.toLowerCase())
        )
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

  const swapCities = () => {
    const temp = formik.values.fromCity;
    formik.setFieldValue('fromCity', formik.values.toCity);
    formik.setFieldValue('toCity', temp);
  };

  const handleTabChange = (tab) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const checkPnrStatus = () => {
    setCheckingPnr(true);
    setTimeout(() => {
      setPnrResult({
        ...mockPnrResult,
        pnr: pnrNumber,
        date: getToday(),
      });
      setCheckingPnr(false);
    }, 1500);
  };

  const checkLiveStatus = () => {
    setCheckingLive(true);
    setTimeout(() => {
      setLiveStatusResult({
        trainName: 'Vande Bharat Exp',
        trainNumber: trainNumber,
        currentStation: 'Bangalore City',
        delay: 5,
        lastUpdated: new Date().toLocaleTimeString(),
        nextStation: 'Krishnarajapuram'
      });
      setCheckingLive(false);
    }, 1500);
  };

  const bookTrain = (train) => {
    setShowSuccess(true);
    setSearchResults([]);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative w-full max-w-6xl p-6 mx-auto border shadow-2xl rounded-3xl backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-br from-white/10 to-transparent" />
      <div className="absolute top-0 h-px left-4 right-4 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex max-w-md p-1 mb-6 rounded-xl bg-white/5">
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
        Train Booking
      </h2>

      <div className="relative flex p-1 mb-6 rounded-xl bg-white/5">
        {['Book Ticket', 'PNR Status', 'Live Status'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              if (tab === 'Book Ticket') setPnrMode(false);
              if (tab === 'PNR Status') setPnrMode('pnr');
              if (tab === 'Live Status') setPnrMode('live');
            }}
            className={`flex-1 py-2 rounded-lg capitalize font-medium transition-all relative z-10 text-sm ${
              (!pnrMode && tab === 'Book Ticket') || (pnrMode === tab.toLowerCase().replace(' ', ''))
                ? 'bg-white/70 text-black shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {pnrMode === 'pnr' ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-6 border bg-white/10 border-white/15 rounded-2xl">
            <label className="block mb-2 text-sm text-white/80">
              Enter PNR Number
            </label>
            <input
              type="text"
              placeholder="10 digit PNR number"
              value={pnrNumber}
              onChange={(e) => setPnrNumber(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full px-4 py-3 font-mono text-lg text-center text-white border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 placeholder-white/30 border-white/15 focus:border-white/25"
            />
            <button
              type="button"
              disabled={pnrNumber.length !== 10}
              onClick={checkPnrStatus}
              className="w-full py-3 mt-4 font-semibold text-black transition-all border-0 shadow-lg bg-white/60 rounded-xl hover:bg-white/70 disabled:opacity-50"
            >
              {checkingPnr ? 'Checking...' : 'Check PNR Status'}
            </button>
          </div>

          {pnrResult && (
            <div className="p-6 border bg-white/10 border-white/15 rounded-2xl">
              <h3 className="mb-3 text-lg font-semibold text-white">
                PNR Status
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80">
                  <span className="text-white/50">PNR:</span> {pnrResult.pnr}
                </p>
                <p className="text-white/80">
                  <span className="text-white/50">Train:</span>{' '}
                  {pnrResult.trainName} ({pnrResult.trainNumber})
                </p>
                <p className="text-white/80">
                  <span className="text-white/50">Status:</span>{' '}
                  <span
                    className={`font-semibold ${pnrResult.status === 'Confirmed' ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {pnrResult.status}
                  </span>
                </p>
                <p className="text-white/80">
                  <span className="text-white/50">Journey:</span>{' '}
                  {pnrResult.from} → {pnrResult.to}
                </p>
                <p className="text-white/80">
                  <span className="text-white/50">Date:</span> {pnrResult.date}
                </p>
                <p className="text-white/80">
                  <span className="text-white/50">Class:</span>{' '}
                  {pnrResult.trainClass}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : pnrMode === 'live' ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="p-6 border bg-white/10 border-white/15 rounded-2xl">
            <label className="block mb-2 text-sm text-white/80">Enter Train Number</label>
            <input
              type="text"
              placeholder="5 digit train number"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={5}
              className="w-full px-4 py-3 text-lg font-mono text-white text-center border outline-none bg-white/5 rounded-xl focus:ring-2 focus:ring-white/25 placeholder-white/30 border-white/15 focus:border-white/25"
            />
            <button
              type="button"
              disabled={trainNumber.length !== 5}
              onClick={checkLiveStatus}
              className="w-full mt-4 py-3 font-semibold text-black transition-all border-0 shadow-lg bg-white/60 rounded-xl hover:bg-white/70 disabled:opacity-50"
            >
              {checkingLive ? 'Fetching Status...' : 'Check Live Status'}
            </button>
          </div>

          {liveStatusResult && (
            <div className="p-6 border bg-white/10 border-white/15 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-3">Live Train Status</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80"><span className="text-white/50">Train:</span> {liveStatusResult.trainName} ({liveStatusResult.trainNumber})</p>
                <p className="text-white/80"><span className="text-white/50">Current Station:</span> {liveStatusResult.currentStation}</p>
                <p className="text-white/80"><span className="text-white/50">Status:</span> <span className={`font-semibold ${liveStatusResult.delay <= 0 ? 'text-green-400' : 'text-yellow-400'}`}>{liveStatusResult.delay <= 0 ? 'On Time' : `${liveStatusResult.delay} min late`}</span></p>
                <p className="text-white/80"><span className="text-white/50">Last Updated:</span> {liveStatusResult.lastUpdated}</p>
                <p className="text-white/80"><span className="text-white/50">Next Station:</span> {liveStatusResult.nextStation}</p>
              </div>
            </div>
          )}
        </div>
      ) : searchResults.length === 0 ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 p-4 border bg-white/10 border-white/15 rounded-2xl">
              <div
                className="flex-1 min-w-[140px] relative group"
                ref={fromRef}
              >
                <div className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">
                  FROM
                </div>
                <input
                  type="text"
                  placeholder="Enter city"
                  name="fromCity"
                  value={formik.values.fromCity}
                  onChange={handleFromChange}
                  onFocus={() =>
                    fromSuggestions.length > 0 && setShowFromDropdown(true)
                  }
                  className={`w-full px-3 py-2 text-sm text-white bg-transparent border rounded-lg outline-none transition-colors placeholder-white/40 ${
                    formik.errors.fromCity && formik.touched.fromCity
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {formik.errors.fromCity && formik.touched.fromCity && (
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.fromCity}
                  </p>
                )}
                {formik.values.fromCity && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded">
                    {cityCodes[formik.values.fromCity]}
                  </span>
                )}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <ul className="absolute z-30 w-full mt-1 overflow-auto border rounded-lg shadow-xl max-h-48 bg-black/95 backdrop-blur-lg border-white/20">
                    {fromSuggestions.map((city) => (
                      <li
                        key={city}
                        onClick={() => selectFromCity(city)}
                        className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        <span className="font-medium">{city}</span>
                        <span className="font-mono text-xs text-white/40">
                          {cityCodes[city]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={swapCities}
                className="flex-shrink-0 p-2.5 transition-colors rounded-full hover:bg-white/20 border border-white/10"
              >
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>

              <div className="flex-1 min-w-[140px] relative group" ref={toRef}>
                <div className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">
                  TO
                </div>
                <input
                  type="text"
                  placeholder="Enter city"
                  name="toCity"
                  value={formik.values.toCity}
                  onChange={handleToChange}
                  onFocus={() =>
                    toSuggestions.length > 0 && setShowToDropdown(true)
                  }
                  className={`w-full px-3 py-2 text-sm text-white bg-transparent border rounded-lg outline-none transition-colors placeholder-white/40 ${
                    formik.errors.toCity && formik.touched.toCity
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {formik.errors.toCity && formik.touched.toCity && (
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.toCity}
                  </p>
                )}
                {formik.values.toCity && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded">
                    {cityCodes[formik.values.toCity]}
                  </span>
                )}
                {showToDropdown && toSuggestions.length > 0 && (
                  <ul className="absolute z-30 w-full mt-1 overflow-auto border rounded-lg shadow-xl max-h-48 bg-black/95 backdrop-blur-lg border-white/20">
                    {toSuggestions.map((city) => (
                      <li
                        key={city}
                        onClick={() => selectToCity(city)}
                        className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        <span className="font-medium">{city}</span>
                        <span className="font-mono text-xs text-white/40">
                          {cityCodes[city]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="w-px h-12 bg-white/20" />

              <div className="flex flex-col gap-1 min-w-[140px]">
                <span className="text-[10px] text-white/60 font-medium">
                  JOURNEY DATE
                </span>
                <input
                  type="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  className={`px-3 py-2 text-sm text-white border rounded-lg outline-none transition-colors ${
                    formik.errors.date && formik.touched.date
                      ? 'border-red-500 focus:border-red-500 bg-red-500/10'
                      : 'bg-white/10 border-white/20 focus:border-white/40'
                  }`}
                  style={{ colorScheme: 'dark' }}
                />
                {formik.errors.date && formik.touched.date && (
                  <p className="mt-1 text-xs text-red-400">
                    {formik.errors.date}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 min-w-[140px]">
                <span className="text-[10px] text-white/60 font-medium">
                  CLASS
                </span>
                <div className="relative">
                  <select
                    name="travelClass"
                    value={formik.values.travelClass}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 text-sm text-white border rounded-lg outline-none appearance-none cursor-pointer bg-white/10 border-white/20 focus:border-white/40"
                    style={{ color: 'white' }}
                  >
                    <option
                      value="All Class"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      All Class
                    </option>
                    <option
                      value="General"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      General (SL)
                    </option>
                    <option
                      value="AC 3 Tier"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      AC 3 Tier (3A)
                    </option>
                    <option
                      value="AC 2 Tier"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      AC 2 Tier (2A)
                    </option>
                    <option
                      value="AC First Class"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      AC First Class (1A)
                    </option>
                    <option
                      value="Executive"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      Executive (EA)
                    </option>
                  </select>
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-[120px]">
                <span className="text-[10px] text-white/60 font-medium">
                  QUOTA
                </span>
                <div className="relative">
                  <select
                    name="quota"
                    value={formik.values.quota}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 text-sm text-white border rounded-lg outline-none appearance-none cursor-pointer bg-white/10 border-white/20 focus:border-white/40"
                    style={{ color: 'white' }}
                  >
                    <option
                      value="General"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      General
                    </option>
                    <option
                      value="Tatkal"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      Tatkal
                    </option>
                    <option
                      value="Senior Citizen"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      Senior Citizen
                    </option>
                    <option
                      value="Ladies"
                      style={{ background: '#1a1a1a', color: 'white' }}
                    >
                      Ladies
                    </option>
                  </select>
                  <svg
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 mt-5 text-sm font-bold text-black transition-all rounded-lg shadow-lg bg-white/90 hover:bg-white disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'SEARCH TRAINS'}
              </button>
            </div>

            <div className="flex gap-6 pt-4 mt-4 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="ladiesQuota"
                  checked={formik.values.ladiesQuota}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-pink-500 rounded border-white/30 bg-white/10 focus:ring-pink-500"
                />
                <span className="text-sm text-white/70">Ladies Quota</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="seniorCitizen"
                  checked={formik.values.seniorCitizen}
                  onChange={formik.handleChange}
                  className="w-4 h-4 text-blue-500 rounded border-white/30 bg-white/10 focus:ring-blue-500"
                />
                <span className="text-sm text-white/70">Senior Citizen</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <span className="text-xs font-medium text-white/50">Quick:</span>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Check PNR
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Live Status
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Seat Availability
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Train Schedule
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {formik.values.fromCity} → {formik.values.toCity} |{' '}
              {formik.values.travelClass}
            </h3>
            <button
              onClick={() => setSearchResults([])}
              className="text-sm text-white/60 hover:text-white"
            >
              Modify
            </button>
          </div>
          <div className="space-y-2 overflow-auto max-h-96">
            {searchResults.map((train) => (
              <div
                key={train.id}
                className="p-4 transition-colors border bg-white/10 border-white/15 rounded-xl hover:bg-white/15"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {train.trainName}
                    </p>
                    <p className="text-sm text-white/60">
                      Train No: {train.trainNumber}
                    </p>
                    <p className="text-sm text-white/60">
                      {train.departure} - {train.arrival} | {train.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      ₹
                      {train.price[formik.values.travelClass] ||
                        train.price['All Class']}
                    </p>
                    <p className="text-xs text-white/50">
                      {train.seats[formik.values.travelClass] ||
                        train.seats['All Class']}{' '}
                      seats available
                    </p>
                    <button
                      onClick={() => bookTrain(train)}
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
          Booking successful! Your train ticket has been confirmed.
        </motion.div>
      )}
    </motion.div>
  );
}
