import React, { useState, useEffect } from 'react';
import { FaBuilding, FaHome, FaUserTie, FaLandmark, FaHotel, FaRegBuilding, FaSearch } from 'react-icons/fa';

const tabOptions = [
  { label: 'Buy', icon: <FaHome /> },
  { label: 'Rental', icon: <FaRegBuilding /> },
];

const cityOptions = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'
];

const budgetOptions = [
  'Any', 'Under 50L', '50L - 1Cr', '1Cr - 2Cr', '2Cr - 5Cr', '5Cr+' 
];

const possessionOptions = [
  'Any', 'Ready to Move', 'Under Construction', 'New Launch'
];

const PropertySearchBar = ({ value = {}, onChange, onSearch, propertyTypes = [] }) => {
  const [activeTab, setActiveTab] = useState(value.tabIndex || 0);
  const [city, setCity] = useState(value.city || '');
  const [query, setQuery] = useState(value.query || '');
  const [budget, setBudget] = useState(value.budget || 'Any');
  const [propertyType, setPropertyType] = useState(value.propertyType || 'Any');
  const [possession, setPossession] = useState(value.possession || 'Any');
  const [isCollapsed, setIsCollapsed] = useState(true); // for mobile collapse

  useEffect(() => {
    if (onChange) {
      onChange({
        tabIndex: activeTab,
        type: tabOptions[activeTab].label,
        city,
        query,
        budget,
        propertyType,
        possession,
      });
    }
    // eslint-disable-next-line
  }, [activeTab, city, query, budget, propertyType, possession]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        tabIndex: activeTab,
        type: tabOptions[activeTab].label,
        city,
        query,
        budget,
        propertyType,
        possession,
      });
    }
    // On mobile, collapse after search
    if (window.innerWidth < 768) setIsCollapsed(true);
  };

  // On lg+ always expanded
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsCollapsed(false);
      else setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 mb-8 px-2 sm:px-4 md:px-6 lg:px-8 bg-white rounded-2xl shadow-xl">
      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-2">
        {tabOptions.map((tab, idx) => (
          <button
            key={tab.label}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-200 flex-shrink-0
              ${activeTab === idx
                ? 'bg-[var(--color-purple-600)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-[var(--color-purple-600)]/10 hover:text-[var(--color-purple-600)]'}`}
            onClick={() => setActiveTab(idx)}
            style={{ minWidth: '80px' }}
          >
            <span className="text-xs sm:text-sm">{tab.icon}</span>
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Collapsed Search Button for mobile */}
      <div className="block lg:hidden mb-3">
        {isCollapsed && (
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-lg bg-[var(--color-purple-600)] text-white font-bold hover:bg-[var(--color-purple-700)] transition-all duration-200 shadow-md"
            onClick={() => setIsCollapsed(false)}
          >
            <FaSearch /> Search Properties
          </button>
        )}
      </div>
      
      {/* Search Bar */}
      <div className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 ${isCollapsed ? 'hidden' : ''} lg:flex lg:items-center`}>
        {/* City Dropdown */}
        <select
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-xs sm:text-sm bg-white lg:w-44"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cityOptions.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        
        {/* Search Input */}
        <div className="relative w-full lg:col-span-2">
          <input
            type="text"
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-xs sm:text-sm bg-white"
            placeholder="Search by Project, Locality, or Builder"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="sm:w-[18px] sm:h-[18px]">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        
        {/* Budget Dropdown */}
        <select
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-xs sm:text-sm bg-white lg:w-32"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        >
          {budgetOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        {/* Property Type Dropdown */}
        <select
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-xs sm:text-sm bg-white lg:w-36"
          value={propertyType}
          onChange={e => setPropertyType(e.target.value)}
        >
          <option value="Any">Any</option>
          {propertyTypes.map(type => (
            <option key={type._id} value={type.typeName}>{type.typeName}</option>
          ))}
        </select>
        
        {/* Possession Status Dropdown */}
        <select
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-xs sm:text-sm bg-white lg:w-40"
          value={possession}
          onChange={e => setPossession(e.target.value)}
        >
          {possessionOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        
        {/* Search Button */}
        <button
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-[var(--color-purple-600)] text-white font-bold text-xs sm:text-sm hover:bg-[var(--color-purple-700)] transition-all duration-200 shadow-md lg:px-6"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default PropertySearchBar; 