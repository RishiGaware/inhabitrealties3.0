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
    <div className="w-full max-w-7xl mx-auto mt-6 mb-8 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
      {/* Enhanced Header */}
      <div className="mb-6 pt-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">Find Your Dream Property</h3>
        <p className="text-sm text-gray-700 font-medium text-center">Search from thousands of properties</p>
      </div>

      {/* Tabs - No Icons */}
      <div className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-2 justify-center">
        {tabOptions.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-6 py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 flex-shrink-0
              ${activeTab === idx
                ? 'bg-gradient-to-r from-purple-700 to-purple-800 text-black shadow-xl transform scale-105 border-2 border-purple-800'
                : 'bg-white text-gray-900 hover:bg-purple-50 hover:text-gray-900 border-2 border-gray-300 hover:border-purple-400 shadow-sm'}`}
            onClick={() => setActiveTab(idx)}
            style={{ minWidth: '100px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Enhanced Search Bar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 pb-6">
        {/* City Dropdown */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-900 mb-1.5">City</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-900 bg-white transition-all duration-200 hover:border-purple-400 hover:text-gray-900 shadow-sm"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {allCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="w-full sm:col-span-2">
          <label className="block text-xs font-bold text-gray-900 mb-1.5">Search</label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 
  focus:ring-2 focus:ring-purple-500 focus:border-purple-600 
  text-sm font-semibold text-gray-900 bg-white transition-all duration-200 
  hover:border-purple-400 hover:bg-gray-50 hover:text-gray-900 
  shadow-md placeholder:text-gray-700"
              placeholder="Project, Locality, or Builder"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600">
              <FaSearch className="w-4 h-4" />
            </span>
          </div>
        </div>
        
        {/* Property Type Dropdown */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-900 mb-1.5">Property Type</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-900 bg-white transition-all duration-200 hover:border-purple-400 hover:text-gray-900 shadow-sm"
            value={propertyType}
            onChange={e => setPropertyType(e.target.value)}
          >
            <option value="Any">All Types</option>
            {propertyTypes.map(type => (
              <option key={type._id} value={type.typeName}>{type.typeName}</option>
            ))}
          </select>
        </div>

        {/* Property Status Dropdown */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-900 mb-1.5">Status</label>
          <select
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-900 bg-white transition-all duration-200 hover:border-purple-400 hover:text-gray-900 shadow-sm"
            value={propertyStatus}
            onChange={e => setPropertyStatus(e.target.value)}
          >
            {propertyStatusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="w-full sm:col-span-2 lg:col-span-1 flex items-end">
          <button
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-800 text-white font-bold text-sm hover:from-purple-800 hover:to-purple-900 transition-all duration-300 shadow-xl border-2 border-purple-900 transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={handleSearch}
          >
            <FaSearch className="w-4 h-4 text-black" />
            <span className="text-black font-bold">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchBar; 