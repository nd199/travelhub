import React, { useState, useEffect } from 'react';
import {
  FaBus,
  FaMapMarkerAlt,
  FaFilter,
  FaCloudSun,
  FaCloudMoon,
  FaSnowflake,
  FaBed,
  FaChair,
  FaWind,
  FaSun,
  FaCloud,
  FaWifi,
  FaCoffee,
  FaTimes,
  FaSearch,
} from 'react-icons/fa';
import {
  IoLocationSharp,
  IoTime,
  IoWater,
  IoBook,
  IoVideocam,
} from 'react-icons/io5';
import { MdPower } from 'react-icons/md';

const FilterSideBar = ({ buses, setFiltered }) => {
  const [busType, setBusType] = useState([]);
  const [departureTimes, setDepartureTimes] = useState({
    '12 midnight - 6 AM': false,
    '6 AM - 12 noon': false,
    '12 noon - 6 PM': false,
    '6 PM - 12 midnight': false,
  });

  const [arrivalTimes, setArrivalTimes] = useState({
    '12 midnight - 6 AM': false,
    '6 AM - 12 noon': false,
    '12 noon - 6 PM': false,
    '6 PM - 12 midnight': false,
  });

  const [boardingPoint, setBoardingPoint] = useState('');
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoint, setDroppingPoint] = useState('');
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [operator, setOperator] = useState('');
  const [operators, setOperators] = useState([]);

  const departureTimeIcons = {
    '12 midnight - 6 AM': <FaCloudMoon />,
    '6 AM - 12 noon': <FaSun />,
    '12 noon - 6 PM': <FaCloud />,
    '6 PM - 12 midnight': <FaCloudMoon />,
  };

  const arrivalTimeIcons = {
    '12 midnight - 6 AM': <FaCloudMoon />,
    '6 AM - 12 noon': <FaSun />,
    '12 noon - 6 PM': <FaCloud />,
    '6 PM - 12 midnight': <FaCloudMoon />,
  };

  const amenityIcons = {
    AC: <FaSnowflake />,
    WiFi: <FaWifi />,
    'Charging Point': <MdPower />,
    'Water Bottle': <IoWater />,
    'Reading Light': <IoBook />,
    Snacks: <FaCoffee />,
    CCTV: <IoVideocam />,
    'Track ETA': <IoTime />,
    'Pushback Seats': <FaChair />,
    'Water Facility': <IoWater />,
  };

  const [amenities, setAmenities] = useState({
    AC: false,
    WiFi: false,
    'Charging Point': false,
    'Water Bottle': false,
    'Reading Light': false,
    Snacks: false,
    CCTV: false,
    'Track ETA': false,
    'Pushback Seats': false,
    'Water Facility': false,
  });

  useEffect(() => {
    if (!buses?.length) return;

    setBoardingPoints(
      [...new Set(buses.map((b) => b.boardingPoint))].filter(Boolean)
    );
    setDroppingPoints(
      [...new Set(buses.map((b) => b.droppingPoint))].filter(Boolean)
    );
    setOperators([...new Set(buses.map((b) => b.operator))].filter(Boolean));
  }, [buses]);

  useEffect(() => {
    if (!buses?.length) return;

    let filtered = [...buses];

    const selectedDepartureSlots = Object.entries(departureTimes)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    if (selectedDepartureSlots.length > 0) {
      filtered = filtered.filter((bus) => {
        const hour = new Date(`2000-01-01T${bus.departure}`).getHours();
        return selectedDepartureSlots.some((slot) => {
          if (slot === '12 midnight - 6 AM') return hour >= 0 && hour < 6;
          if (slot === '6 AM - 12 noon') return hour >= 6 && hour < 12;
          if (slot === '12 noon - 6 PM') return hour >= 12 && hour < 18;
          if (slot === '6 PM - 12 midnight') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    const selectedArrivalSlots = Object.entries(arrivalTimes)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    if (selectedArrivalSlots.length > 0) {
      filtered = filtered.filter((bus) => {
        const hour = new Date(`2000-01-01T${bus.arrival}`).getHours();
        return selectedArrivalSlots.some((slot) => {
          if (slot === '12 midnight - 6 AM') return hour >= 0 && hour < 6;
          if (slot === '6 AM - 12 noon') return hour >= 6 && hour < 12;
          if (slot === '12 noon - 6 PM') return hour >= 12 && hour < 18;
          if (slot === '6 PM - 12 midnight') return hour >= 18 && hour < 24;
          return false;
        });
      });
    }

    if (boardingPoint) {
      filtered = filtered.filter((bus) =>
        bus.boardingPoint?.toLowerCase().includes(boardingPoint.toLowerCase())
      );
    }

    if (droppingPoint) {
      filtered = filtered.filter((bus) =>
        bus.droppingPoint?.toLowerCase().includes(droppingPoint.toLowerCase())
      );
    }

    if (operator) {
      filtered = filtered.filter((bus) =>
        bus.operator?.toLowerCase().includes(operator.toLowerCase())
      );
    }

    const selectedAmenities = Object.entries(amenities)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((bus) =>
        selectedAmenities.every((amenity) => bus.amenities?.[amenity])
      );
    }

    if (busType.length > 0) {
      filtered = filtered.filter((bus) =>
        busType.some((type) =>
          bus.type?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    setFiltered(filtered);
  }, [
    buses,
    departureTimes,
    arrivalTimes,
    boardingPoint,
    droppingPoint,
    operator,
    amenities,
    busType,
  ]);

  const resetFilters = () => {
    setBusType([]);
    setDepartureTimes({
      '12 midnight - 6 AM': false,
      '6 AM - 12 noon': false,
      '12 noon - 6 PM': false,
      '6 PM - 12 midnight': false,
    });
    setArrivalTimes({
      '12 midnight - 6 AM': false,
      '6 AM - 12 noon': false,
      '12 noon - 6 PM': false,
      '6 PM - 12 midnight': false,
    });
    setBoardingPoint('');
    setDroppingPoint('');
    setOperator('');
    setAmenities({
      AC: false,
      WiFi: false,
      'Charging Point': false,
      'Water Bottle': false,
      'Reading Light': false,
      Snacks: false,
      CCTV: false,
      'Track ETA': false,
      'Pushback Seats': false,
      'Water Facility': false,
    });
  };

  return (
    <div className="w-64 overflow-hidden bg-white border shadow-xl rounded-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600">
        <div className="flex items-center gap-2 text-white">
          <FaFilter />
          <span className="font-semibold">Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-orange-200 hover:text-orange-100"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        {/* POPULAR FILTERS */}
        <div className="p-3 border rounded-xl bg-orange-50">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
            <FaFilter />
            Popular Filters
          </div>
          <div className="flex flex-wrap gap-2">
            <PopularFilter
              label="AC"
              icon={<FaSnowflake />}
              active={amenities.AC}
              onClick={() => setAmenities({ ...amenities, AC: !amenities.AC })}
            />
            <PopularFilter
              label="Sleeper"
              icon={<FaBed />}
              active={busType.includes('Sleeper')}
              onClick={() =>
                setBusType((prev) =>
                  prev.includes('Sleeper')
                    ? prev.filter((t) => t !== 'Sleeper')
                    : [...prev, 'Sleeper']
                )
              }
            />
            <PopularFilter
              label="6PM - 12AM"
              icon={<FaCloudMoon />}
              active={departureTimes['6 PM - 12 midnight']}
              onClick={() =>
                setDepartureTimes({
                  ...departureTimes,
                  '6 PM - 12 midnight': !departureTimes['6 PM - 12 midnight'],
                })
              }
            />
            <PopularFilter
              label="Seater"
              icon={<FaChair />}
              active={busType.includes('Seater')}
              onClick={() =>
                setBusType((prev) =>
                  prev.includes('Seater')
                    ? prev.filter((t) => t !== 'Seater')
                    : [...prev, 'Seater']
                )
              }
            />
          </div>
        </div>

        {/* BUS TYPE */}
        <FilterSection title="Bus Type" icon={<FaBus />}>
          <div className="space-y-1">
            <Checkbox
              label="AC"
              icon={<FaSnowflake />}
              checked={busType.includes('AC')}
              onChange={() =>
                setBusType((prev) =>
                  prev.includes('AC')
                    ? prev.filter((t) => t !== 'AC')
                    : [...prev, 'AC']
                )
              }
            />
            <Checkbox
              label="Non-AC"
              icon={<FaWind />}
              checked={busType.includes('Non-AC')}
              onChange={() =>
                setBusType((prev) =>
                  prev.includes('Non-AC')
                    ? prev.filter((t) => t !== 'Non-AC')
                    : [...prev, 'Non-AC']
                )
              }
            />
            <Checkbox
              label="Sleeper"
              icon={<FaBed />}
              checked={busType.includes('Sleeper')}
              onChange={() =>
                setBusType((prev) =>
                  prev.includes('Sleeper')
                    ? prev.filter((t) => t !== 'Sleeper')
                    : [...prev, 'Sleeper']
                )
              }
            />
            <Checkbox
              label="Seater"
              icon={<FaChair />}
              checked={busType.includes('Seater')}
              onChange={() =>
                setBusType((prev) =>
                  prev.includes('Seater')
                    ? prev.filter((t) => t !== 'Seater')
                    : [...prev, 'Seater']
                )
              }
            />
          </div>
        </FilterSection>

        {/* DEPARTURE TIME */}
        <FilterSection title="Departure Time" icon={<FaCloudSun />}>
          <div className="space-y-1">
            {Object.entries(departureTimes).map(([time, checked]) => (
              <Checkbox
                key={time}
                label={time}
                icon={departureTimeIcons[time]}
                checked={checked}
                onChange={() =>
                  setDepartureTimes({
                    ...departureTimes,
                    [time]: !checked,
                  })
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* ARRIVAL TIME */}
        <FilterSection title="Arrival Time" icon={<FaCloudMoon />}>
          <div className="space-y-1">
            {Object.entries(arrivalTimes).map(([time, checked]) => (
              <Checkbox
                key={time}
                label={time}
                icon={arrivalTimeIcons[time]}
                checked={checked}
                onChange={() =>
                  setArrivalTimes({
                    ...arrivalTimes,
                    [time]: !checked,
                  })
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* BOARDING POINT */}
        <FilterSection title="Boarding Point" icon={<FaMapMarkerAlt />}>
          <div className="flex items-center gap-2">
            <SearchInput
              value={boardingPoint}
              setValue={setBoardingPoint}
              placeholder="Enter/Search boarding point"
            />
            {boardingPoint && (
              <button
                onClick={() => setBoardingPoint('')}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <List>
            {boardingPoints
              .filter((p) =>
                p.toLowerCase().includes(boardingPoint.toLowerCase())
              )
              .slice(0, 5)
              .map((p) => (
                <ListItem key={p} onClick={() => setBoardingPoint(p)}>
                  {p}
                </ListItem>
              ))}
          </List>
          {boardingPoints.length > 5 && (
            <span className="text-xs text-gray-500">
              + Show all boarding points
            </span>
          )}
        </FilterSection>

        {/* DROPPING POINT */}
        <FilterSection title="Dropping Point" icon={<IoLocationSharp />}>
          <div className="flex items-center gap-2">
            <SearchInput
              value={droppingPoint}
              setValue={setDroppingPoint}
              placeholder="Enter/Search dropping point"
            />
            {droppingPoint && (
              <button
                onClick={() => setDroppingPoint('')}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <List>
            {droppingPoints
              .filter((p) =>
                p.toLowerCase().includes(droppingPoint.toLowerCase())
              )
              .slice(0, 5)
              .map((p) => (
                <ListItem key={p} onClick={() => setDroppingPoint(p)}>
                  {p}
                </ListItem>
              ))}
          </List>
          {droppingPoints.length > 5 && (
            <span className="text-xs text-gray-500">
              + Show all dropping points
            </span>
          )}
        </FilterSection>

        {/* OPERATOR */}
        <FilterSection title="Operator" icon={<FaBus />}>
          <div className="flex items-center gap-2">
            <SearchInput
              value={operator}
              setValue={setOperator}
              placeholder="Enter/Search operator"
            />
            {operator && (
              <button
                onClick={() => setOperator('')}
                className="text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <List>
            {operators
              .filter((o) => o.toLowerCase().includes(operator.toLowerCase()))
              .slice(0, 5)
              .map((o) => (
                <ListItem key={o} onClick={() => setOperator(o)}>
                  {o}
                </ListItem>
              ))}
          </List>
          {operators.length > 5 && (
            <span className="text-xs text-gray-500">+ Show all operators</span>
          )}
        </FilterSection>

        {/* AMENITIES */}
        <FilterSection title="Amenities" icon={<FaSnowflake />}>
          <div className="space-y-1">
            {Object.entries(amenities).map(([amenity, checked]) => (
              <Checkbox
                key={amenity}
                label={amenity}
                icon={amenityIcons[amenity]}
                checked={checked}
                onChange={() =>
                  setAmenities({
                    ...amenities,
                    [amenity]: !checked,
                  })
                }
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterSideBar;

/* REUSABLE COMPONENTS */

const FilterSection = ({ title, icon, children }) => (
  <div className="p-3 border rounded-xl bg-orange-50">
    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-800">
      {icon}
      {title}
    </div>
    {children}
  </div>
);

const Checkbox = ({ label, icon, checked, onChange }) => (
  <label className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="accent-orange-500"
    />
    {icon && <span className="text-gray-500">{icon}</span>}
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const SearchInput = ({ value, setValue, placeholder }) => (
  <div className="relative">
    <FaSearch className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full py-2 pl-10 pr-3 mb-2 text-sm text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const List = ({ children }) => (
  <div className="overflow-y-auto bg-white border rounded-lg max-h-32">
    {children}
  </div>
);

const ListItem = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="block w-full px-3 py-2 text-sm text-left hover:bg-blue-50"
  >
    {children}
  </button>
);

const PopularFilter = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
      active
        ? 'bg-orange-500 text-white border-orange-500'
        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
    }`}
  >
    <span className={active ? 'text-white' : 'text-orange-500'}>{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);
