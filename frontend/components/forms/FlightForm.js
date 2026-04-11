import { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion } from 'framer-motion'
import { cities, cityCodes, mockFlightResults } from '../../lib/data/lib'

const flightValidationSchema = Yup.object({
  fromCity: Yup.string()
    .required('From city is required')
    .notOneOf([Yup.ref('toCity')], 'From and To cities cannot be the same'),
  toCity: Yup.string()
    .required('To city is required')
    .notOneOf([Yup.ref('fromCity')], 'From and To cities cannot be the same'),
  date: Yup.string()
    .required('Departure date is required'),
  returnDate: Yup.string()
    .when('tripType', {
      is: 'roundtrip',
      then: (schema) => schema.required('Return date is required for round trip'),
      otherwise: (schema) => schema.notRequired()
    })
})

export function FlightForm({ onTabChange, activeTab: externalTab }) {
  const [internalTab, setInternalTab] = useState("flight")
  const activeTab = externalTab !== undefined ? externalTab : internalTab

  const [showSuccess, setShowSuccess] = useState(false)
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showPassengers, setShowPassengers] = useState(false)
  const fromRef = useRef(null)
  const toRef = useRef(null)

  const formik = useFormik({
    initialValues: {
      fromCity: '',
      toCity: '',
      date: '',
      returnDate: '',
      tripType: 'oneway',
      passengers: 1,
      travelClass: 'Economy'
    },
    validationSchema: flightValidationSchema,
    onSubmit: (values) => {
      setIsSearching(true)
      setTimeout(() => {
        const mockResults = mockFlightResults
        setSearchResults(mockResults)
        setIsSearching(false)
      }, 1500)
    }
  })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromDropdown(false)
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFromChange = (e) => {
    const value = e.target.value
    formik.setFieldValue('fromCity', value)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase()) ||
        cityCodes[city].toLowerCase().includes(value.toLowerCase())
      ).filter(city => city !== formik.values.toCity)
      setFromSuggestions(filtered.slice(0, 5))
      setShowFromDropdown(filtered.length > 0)
    } else {
      setFromSuggestions([])
      setShowFromDropdown(false)
    }
  }

  const handleToChange = (e) => {
    const value = e.target.value
    formik.setFieldValue('toCity', value)
    if (value.length > 0) {
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase()) ||
        cityCodes[city].toLowerCase().includes(value.toLowerCase())
      ).filter(city => city !== formik.values.fromCity)
      setToSuggestions(filtered.slice(0, 5))
      setShowToDropdown(filtered.length > 0)
    } else {
      setToSuggestions([])
      setShowToDropdown(false)
    }
  }

  const selectFromCity = (city) => {
    formik.setFieldValue('fromCity', city)
    setFromSuggestions([])
    setShowFromDropdown(false)
  }

  const selectToCity = (city) => {
    formik.setFieldValue('toCity', city)
    setToSuggestions([])
    setShowToDropdown(false)
  }

  const swapCities = () => {
    const temp = formik.values.fromCity
    formik.setFieldValue('fromCity', formik.values.toCity)
    formik.setFieldValue('toCity', temp)
  }

  const handleTabChange = (tab) => {
    setInternalTab(tab)
    if (onTabChange) onTabChange(tab)
  }

  const bookFlight = (flight) => {
    setShowSuccess(true)
    setSearchResults([])
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative w-full max-w-6xl p-6 mx-auto border shadow-2xl rounded-3xl backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
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

      <h2 className="mb-4 text-xl font-semibold text-center capitalize">Flight Booking</h2>

      {searchResults.length === 0 ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center gap-6 p-2 rounded-lg bg-white/5">
              {['oneway', 'roundtrip'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="tripType"
                    value={type}
                    checked={formik.values.tripType === type}
                    onChange={formik.handleChange}
                    className="w-4 h-4 accent-white"
                  />
                  <span className={`text-sm font-medium ${formik.values.tripType === type ? "text-white" : "text-white/50"}`}>
                    {type === 'oneway' ? 'One Way' : 'Round Trip'}
                  </span>
                </label>
              ))}
              <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
                <span>Student</span>
                <input type="checkbox" className="w-3 h-3 accent-white" />
                <span className="ml-2">Senior</span>
                <input type="checkbox" className="w-3 h-3 accent-white" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-4 border bg-white/10 border-white/15 rounded-2xl">
              <div className="flex-1 min-w-[140px] relative group" ref={fromRef}>
                <div className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">FROM</div>
                <input
                  type="text"
                  placeholder="Enter city"
                  name="fromCity"
                  value={formik.values.fromCity}
                  onChange={handleFromChange}
                  onFocus={() => setShowFromDropdown(fromSuggestions.length > 0)}
                  className={`w-full px-3 py-2 text-sm text-white bg-transparent border rounded-lg outline-none transition-colors placeholder-white/40 ${
                    formik.errors.fromCity && formik.touched.fromCity
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {formik.errors.fromCity && formik.touched.fromCity && (
                  <p className="mt-1 text-xs text-red-400">{formik.errors.fromCity}</p>
                )}
                {formik.values.fromCity && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded">{cityCodes[formik.values.fromCity]}</span>
                )}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <ul className="absolute z-30 w-full mt-1 max-h-48 overflow-auto bg-black/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl">
                    {fromSuggestions.map((city) => (
                      <li
                        key={city}
                        onClick={() => selectFromCity(city)}
                        className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        <span className="font-medium">{city}</span>
                        <span className="text-xs text-white/40 font-mono">{cityCodes[city]}</span>
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
                <svg className="w-5 h-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <div className="flex-1 min-w-[140px] relative group" ref={toRef}>
                <div className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">TO</div>
                <input
                  type="text"
                  placeholder="Enter city"
                  name="toCity"
                  value={formik.values.toCity}
                  onChange={handleToChange}
                  onFocus={() => setShowToDropdown(toSuggestions.length > 0)}
                  className={`w-full px-3 py-2 text-sm text-white bg-transparent border rounded-lg outline-none transition-colors placeholder-white/40 ${
                    formik.errors.toCity && formik.touched.toCity
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {formik.errors.toCity && formik.touched.toCity && (
                  <p className="mt-1 text-xs text-red-400">{formik.errors.toCity}</p>
                )}
                {formik.values.toCity && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded">{cityCodes[formik.values.toCity]}</span>
                )}
                {showToDropdown && toSuggestions.length > 0 && (
                  <ul className="absolute z-30 w-full mt-1 max-h-48 overflow-auto bg-black/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl">
                    {toSuggestions.map((city) => (
                      <li
                        key={city}
                        onClick={() => selectToCity(city)}
                        className="flex justify-between items-center px-4 py-2.5 text-sm cursor-pointer hover:bg-white/10 text-white/80 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      >
                        <span className="font-medium">{city}</span>
                        <span className="text-xs text-white/40 font-mono">{cityCodes[city]}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="w-px h-12 bg-white/20" />

              <div className="flex flex-col gap-1 min-w-[120px]">
                <span className="text-[10px] text-white/60 font-medium">DEPARTURE</span>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    className={`w-full px-3 py-2 text-sm text-white border rounded-lg outline-none transition-colors ${
                      formik.errors.date && formik.touched.date
                        ? 'border-red-500 focus:border-red-500 bg-red-500/10'
                        : 'bg-white/10 border-white/20 focus:border-white/40'
                    }`}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                {formik.errors.date && formik.touched.date && (
                  <p className="mt-1 text-xs text-red-400">{formik.errors.date}</p>
                )}
              </div>

              {formik.values.tripType === 'roundtrip' && (
                <div className="flex flex-col gap-1 min-w-[120px]">
                  <span className="text-[10px] text-white/60 font-medium">RETURN</span>
                  <div className="relative">
                    <input
                      type="date"
                      name="returnDate"
                      value={formik.values.returnDate}
                      onChange={formik.handleChange}
                      className={`w-full px-3 py-2 text-sm text-white border rounded-lg outline-none transition-colors ${
                        formik.errors.returnDate && formik.touched.returnDate
                          ? 'border-red-500 focus:border-red-500 bg-red-500/10'
                          : 'bg-white/10 border-white/20 focus:border-white/40'
                      }`}
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  {formik.errors.returnDate && formik.touched.returnDate && (
                    <p className="mt-1 text-xs text-red-400">{formik.errors.returnDate}</p>
                  )}
                </div>
              )}

              <div className="relative">
                <span className="absolute -top-2 left-3 px-1 bg-white/10 text-[10px] text-white/60 rounded">TRAVELLERS</span>
                <button
                  type="button"
                  onClick={() => setShowPassengers(!showPassengers)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors min-w-[140px]"
                >
                  <span>{formik.values.passengers} Traveller{formik.values.passengers > 1 ? 's' : ''}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">{formik.values.travelClass}</span>
                  <svg className="w-4 h-4 ml-auto text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPassengers && (
                  <div className="absolute right-0 z-30 mt-2 w-56 p-4 bg-black/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl">
                    <div className="mb-4 pb-3 border-b border-white/10">
                      <label className="block mb-2 text-xs text-white/60 font-medium">ADULTS (12+ YRS)</label>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue('passengers', Math.max(1, formik.values.passengers - 1))}
                          className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20"
                        >
                          -
                        </button>
                        <span className="text-lg font-medium text-white w-8 text-center">{formik.values.passengers}</span>
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue('passengers', formik.values.passengers + 1)}
                          className="w-8 h-8 flex items-center justify-center text-white bg-white/10 rounded-full hover:bg-white/20"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs text-white/60 font-medium">CLASS</label>
                      <div className="flex gap-2">
                        {['Economy', 'Business', 'First Class'].map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => formik.setFieldValue('travelClass', cls)}
                            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                              formik.values.travelClass === cls 
                                ? 'bg-white/20 text-white border-white/40' 
                                : 'text-white/60 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-3 text-sm font-bold text-black transition-all bg-white/90 rounded-lg hover:bg-white shadow-lg disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'SEARCH'}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <span className="text-xs font-medium text-white/50">Quick:</span>
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Flight Status
              </button>
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Fare Comparison
              </button>
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Web Check-in
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{formik.values.fromCity} → {formik.values.toCity} | {formik.values.passengers} Pax | {formik.values.travelClass}</h3>
            <button onClick={() => setSearchResults([])} className="text-sm text-white/60 hover:text-white">Modify</button>
          </div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {searchResults.map((flight) => (
              <div key={flight.id} className="p-4 bg-white/10 border border-white/15 rounded-xl hover:bg-white/15 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{flight.airline}</p>
                    <p className="text-sm text-white/60">Flight: {flight.flightNumber}</p>
                    <p className="text-sm text-white/60">{flight.departure} - {flight.arrival} | {flight.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">₹{flight.price[formik.values.travelClass]}</p>
                    <p className="text-xs text-white/50">{flight.seats[formik.values.travelClass]} seats left</p>
                    <button onClick={() => bookFlight(flight)} className="mt-2 px-4 py-1.5 text-sm font-medium text-black bg-white/90 rounded-lg hover:bg-white">
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 p-3 mx-4 mt-4 text-sm font-medium text-center text-white rounded-lg bg-emerald-500/70 backdrop-blur-md">
          Booking successful! Your flight ticket has been confirmed.
        </motion.div>
      )}
    </motion.div>
  )
}
