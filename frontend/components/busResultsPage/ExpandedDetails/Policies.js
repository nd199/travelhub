import React from 'react';
import { IoTime, IoCloseCircle, IoRefresh } from 'react-icons/io5';
import { policies as policyData } from '../../../lib/data/policies';

const iconMap = {
  XCircle: IoCloseCircle,
  RefreshCw: IoRefresh,
  Clock: IoTime,
};

const Policies = () => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Policies</h2>

      <div className="space-y-5">
        {policyData.map((policy) => {
          const IconComponent = iconMap[policy.icon];
          return (
            <div
              key={policy.id}
              className="p-5 border rounded-2xl border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <IconComponent className="w-6 h-6 flex-shrink-0 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                  <ul className="space-y-2 mt-2">
                    {policy.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Policies;