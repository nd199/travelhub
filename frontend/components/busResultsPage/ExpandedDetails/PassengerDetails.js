import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
} from 'react-icons/fa';

const PassengerDetails = ({ passengers, setPassengers, initialPassengers = [] }) => {
  const [localPassengers, setLocalPassengers] = useState(passengers);

  useEffect(() => {
    if (initialPassengers.length > 0) {
      setPassengers(initialPassengers);
      setLocalPassengers(initialPassengers);
    }
  }, [initialPassengers, setPassengers]);

  useEffect(() => {
    setLocalPassengers(passengers);
  }, [passengers]);

  const addPassenger = () => {
    const newId = Math.max(...localPassengers.map(p => p.id), 0) + 1;
    const newPassengers = [
      ...localPassengers,
      { id: newId, name: '', email: '', phone: '', age: '', gender: 'Male', idProof: '' },
    ];
    setLocalPassengers(newPassengers);
    setPassengers(newPassengers);
  };

  const removePassenger = (id) => {
    if (localPassengers.length > 1) {
      const updated = localPassengers.filter((passenger) => passenger.id !== id);
      setLocalPassengers(updated);
      setPassengers(updated);
    }
  };

  const updatePassenger = (id, field, value) => {
    const updated = localPassengers.map((passenger) =>
      passenger.id === id ? { ...passenger, [field]: value } : passenger
    );
    setLocalPassengers(updated);
    setPassengers(updated);
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Passenger Details</h2>
        <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
          {localPassengers.length} passenger(s)
        </span>
      </div>

      {localPassengers.map((passenger, index) => (
        <div
          key={passenger.id}
          className="pb-6 mb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <p className="text-base font-semibold text-gray-800">
                Passenger {index + 1}
              </p>
            </div>
            {localPassengers.length > 1 && (
              <button
                onClick={() => removePassenger(passenger.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs text-gray-500">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute text-xs text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) =>
                    updatePassenger(passenger.id, 'name', e.target.value)
                  }
                  placeholder="As per ID proof"
                  className="w-full py-2 pr-3 text-sm border border-gray-300 rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-500">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute text-xs text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) =>
                    updatePassenger(passenger.id, 'email', e.target.value)
                  }
                  placeholder="For ticket confirmation"
                  className="w-full py-2 pr-3 text-sm border border-gray-300 rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs text-gray-500">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute text-xs text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) =>
                    updatePassenger(passenger.id, 'phone', e.target.value)
                  }
                  placeholder="10-digit mobile"
                  className="w-full py-2 pr-3 text-sm border border-gray-300 rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block mb-1 text-xs text-gray-500">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={passenger.age}
                  onChange={(e) =>
                    updatePassenger(passenger.id, 'age', e.target.value)
                  }
                  placeholder="Years"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-xs text-gray-500">
                  Gender
                </label>
                <select
                  value={passenger.gender}
                  onChange={(e) =>
                    updatePassenger(passenger.id, 'gender', e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block mb-1 text-xs text-gray-500">
                ID Proof (Optional)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FaIdCard className="absolute text-xs text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={passenger.idProof}
                    onChange={(e) =>
                      updatePassenger(passenger.id, 'idProof', e.target.value)
                    }
                    placeholder="Aadhaar / Voter ID / License"
                    className="w-full py-2 pr-3 text-sm border border-gray-300 rounded-lg pl-9 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Required for government schemes or insurance claims
              </p>
            </div>
          </div>
        </div>
      ))}

      {localPassengers.length < 6 && (
        <button
          onClick={addPassenger}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 border border-orange-200"
        >
          + Add more passengers
        </button>
      )}
    </div>
  );
};

export default PassengerDetails;