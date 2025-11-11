import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const tabOptions = [
  { label: 'Buy' },
  { label: 'Rental' },
];

// Predefined cities list (alphabetically sorted)
const predefinedCities = [
  'Aurangabad',
  'Chalisgaon',
  'Chhatrapati Sambhajinagar',
  'Jalgaon',
  'Mumbai',
  'Nashik',
  'Pune'
];

// Property status options (excluding Sold and Rented as requested)
const propertyStatusOptions = [
  { label: 'All Properties', value: 'Any' },
  { label: 'For Sale', value: 'FOR SALE' },
  { label: 'For Rent', value: 'FOR RENT' },
  { label: 'Rent', value: 'RENT' },
  { label: 'Lease', value: 'LEASE' },
  { label: 'Ready to Move', value: 'Ready to Move' },
  { label: 'Under Construction', value: 'Under Construction' },
  { label: 'New Launch', value: 'New Launch' },
  { label: 'After 1 Yr Possession', value: 'After 1 Yr Possession' }
];

const PropertySearchBar = ({ value = {}, onChange, onSearch, propertyTypes = [], cities = [] }) => {
  const [activeTab, setActiveTab] = useState(value.tabIndex || 0);
  const [city, setCity] = useState(value.city || '');
  const [query, setQuery] = useState(value.query || '');
  const [budget] = useState(value.budget || 'Any'); // Kept for backend compatibility, no UI control
  const [propertyType, setPropertyType] = useState(value.propertyType || 'Any');
  const [propertyStatus, setPropertyStatus] = useState(value.propertyStatus || 'Any');
  const [possession] = useState(value.possession || 'Any'); // Kept for backend compatibility, no UI control

  useEffect(() => {
    if (onChange) {
      onChange({
        tabIndex: activeTab,
        type: tabOptions[activeTab].label,
        city,
        query,
        budget,
        propertyType,
        propertyStatus,
        possession,
      });
    }
    // eslint-disable-next-line
  }, [activeTab, city, query, budget, propertyType, propertyStatus, possession]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        tabIndex: activeTab,
        type: tabOptions[activeTab].label,
        city,
        query,
        budget,
        propertyType,
        propertyStatus,
        possession,
      });
    }
  };

  // Merge predefined cities with dynamic cities from API, remove duplicates (case-insensitive), and sort alphabetically
  const allCities = React.useMemo(() => {
    const merged = [...predefinedCities, ...cities];
    // Normalize cities: trim and convert to lowercase for comparison
    const normalized = merged.map(city => city.trim()).filter(city => city.length > 0);
    // Remove duplicates using case-insensitive comparison
    const unique = [];
    const seen = new Set();
    normalized.forEach(city => {
      const lower = city.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(city);
      }
    });
    return unique.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  }, [cities]);

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mt-8 sm:mt-4 md:mt-4 mb-4 sm:mb-6 px-2 sm:px-3 md:px-4 lg:px-5 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-purple-200">
      {/* Compact Header - Mobile Optimized */}
      <div className="mb-2 sm:mb-3 pt-2 sm:pt-3">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-1 text-center px-1" style={{ color: '#111827', fontWeight: 700 }}>Find Your Dream Property</h3>
      </div>

      {/* Compact Tabs - Mobile Optimized */}
      <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-1 justify-center px-1">
        {tabOptions.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-bold text-[11px] sm:text-xs md:text-sm transition-all duration-300 flex-shrink-0 touch-manipulation 
              ${activeTab === idx
                ? 'bg-gradient-to-r from-purple-700 to-purple-800 shadow-md border border-purple-800'
                : 'bg-white text-gray-900 hover:bg-purple-50 border border-gray-300 hover:border-purple-400 shadow-sm'}`}
            onClick={() => setActiveTab(idx)}
            style={{ 
              minWidth: '60px', 
              WebkitTapHighlightColor: 'transparent',
              color: '#000000',
              fontWeight: 700
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Compact Search Bar - Mobile First Responsive */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-2.5 pb-2 sm:pb-3">
        {/* City Dropdown */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1" style={{ color: '#111827', fontWeight: 600 }}>City</label>
          <select
            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-[11px] sm:text-xs font-semibold bg-white transition-all duration-200 hover:border-purple-400 shadow-sm touch-manipulation"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ WebkitTapHighlightColor: 'transparent', color: '#111827' }}
          >
            <option value="" style={{ color: '#111827' }}>All Cities</option>
            {allCities.map(c => (
              <option key={c} value={c} style={{ color: '#111827' }}>{c}</option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="w-full sm:col-span-2">
          <label className="block text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1" style={{ color: '#111827', fontWeight: 600 }}>Search</label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg border border-gray-300 
                focus:ring-2 focus:ring-purple-500 focus:border-purple-600 
                text-[11px] sm:text-xs font-semibold bg-white transition-all duration-200 
                hover:border-purple-400 hover:bg-gray-50 
                shadow-sm placeholder:text-gray-500"
              placeholder="Project, Locality, or Builder"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              style={{ color: '#111827' }}
            />
            <span className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: '#6B7280' }}>
              <FaSearch className="w-3 h-3" />
            </span>
          </div>
        </div>
        
        {/* Property Type Dropdown */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1" style={{ color: '#111827', fontWeight: 600 }}>Property Type</label>
          <select
            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-[11px] sm:text-xs font-semibold bg-white transition-all duration-200 hover:border-purple-400 shadow-sm touch-manipulation"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
            style={{ WebkitTapHighlightColor: 'transparent', color: '#111827' }}
          >
            <option value="Any" style={{ color: '#111827' }}>All Types</option>
            {propertyTypes.map(type => (
              <option key={type._id} value={type.typeName} style={{ color: '#111827' }}>{type.typeName}</option>
            ))}
          </select>
        </div>

        {/* Property Status Dropdown */}
        <div className="w-full">
          <label className="block text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1" style={{ color: '#111827', fontWeight: 600 }}>Status</label>
          <select
            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-md sm:rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-[11px] sm:text-xs font-semibold bg-white transition-all duration-200 hover:border-purple-400 shadow-sm touch-manipulation"
            value={propertyStatus}
            onChange={e => setPropertyStatus(e.target.value)}
            style={{ WebkitTapHighlightColor: 'transparent', color: '#111827' }}
          >
            {propertyStatusOptions.map(option => (
              <option key={option.value} value={option.value} style={{ color: '#111827' }}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="w-full sm:col-span-2 lg:col-span-1 flex items-end justify-center">
          <button
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-gradient-to-r from-purple-700 to-purple-800 font-bold text-[11px] sm:text-xs hover:from-purple-800 hover:to-purple-900 transition-all duration-300 shadow-md active:scale-95 sm:hover:scale-105 flex items-center justify-center gap-1 sm:gap-1.5 touch-manipulation"
            onClick={handleSearch}
            style={{ WebkitTapHighlightColor: 'transparent', color: '#000000', fontWeight: 700 }}
          >
            <FaSearch className="w-3 h-3" style={{ color: '#000000' }} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchBar; 