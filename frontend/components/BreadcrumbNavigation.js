import React from 'react';
import { FaChevronRight, FaHome, FaPlane, FaTrain } from 'react-icons/fa';

export default function BreadcrumbNavigation({ currentPath, transportType = 'flight' }) {
  const TransportIcon = transportType === 'flight' ? FaPlane : FaTrain;
  
  const breadcrumbs = transportType === 'flight' 
    ? [
        { name: 'Home', icon: FaHome, href: '/', active: false },
        { name: 'Flight Search', icon: FaPlane, href: '/flight/flightResults', active: false },
        { name: 'Review Booking', icon: null, href: '/flight/review', active: true },
      ]
    : [
        { name: 'Home', icon: FaHome, href: '/', active: false },
        { name: 'Train Search', icon: FaTrain, href: '/train/trainResults', active: false },
        { name: 'Review Booking', icon: null, href: '/train/review', active: true },
      ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <FaChevronRight className="w-3 h-3 text-gray-400" />}
          <div className="flex items-center space-x-1">
            {crumb.icon && <crumb.icon className="w-4 h-4" />}
            <a
              href={crumb.href}
              className={`${
                crumb.active
                  ? 'text-purple-600 font-medium'
                  : 'text-gray-600 hover:text-purple-600 transition-colors'
              }`}
            >
              {crumb.name}
            </a>
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}
