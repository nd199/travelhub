import React from 'react';
import { Clock, XCircle, RefreshCw } from 'lucide-react';
import { policies as policyData } from '../../../lib/data/policies';

const iconMap = {
  XCircle,
  RefreshCw,
  Clock,
};

const Policies = () => {
  return (
    <div className="p-4 bg-white rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Policies</h2>

      <div className="space-y-6">
        {policyData.map((policy) => {
          const IconComponent = iconMap[policy.icon];
          return (
          <div key={policy.id} className="p-4 border rounded-lg border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <IconComponent className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">{policy.title}</h3>
            </div>
            <ul className="space-y-2">
              {policy.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default Policies;