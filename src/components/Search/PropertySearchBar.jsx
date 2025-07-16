import React, { useState, useEffect } from 'react';
import { FaBuilding, FaHome, FaUserTie, FaLandmark, FaHotel, FaRegBuilding, FaSearch } from 'react-icons/fa';

const tabOptions = [
  { label: 'Buy', icon: <FaHome /> },
  { label: 'Rental', icon: <FaRegBuilding /> },
  { label: 'Projects', icon: <FaBuilding /> },
  { label: 'PG / Hostels', icon: <FaHotel /> },
  { label: 'Plot & Land', icon: <FaLandmark /> },
  { label: 'Commercial', icon: <FaBuilding /> },
  { label: 'Agents', icon: <FaUserTie /> },
];

const cityOptions = [
  'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida'
];

const budgetOptions = [
  'Any', 'Under 50L', '50L - 1Cr', '1Cr - 2Cr', '2Cr - 5Cr', '5Cr+' 
];

const propertyTypeOptions = [
  'Any', 'Apartment', 'Villa', 'Plot', 'Office', 'Shop', 'PG', 'Hostel'
];

const possessionOptions = [
  'Any', 'Ready to Move', 'Under Construction', 'New Launch'
];

const PropertySearchBar = ({ value = {}, onChange, onSearch }) => {
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

  // On md+ always expanded
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsCollapsed(false);
      else setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-4 mb-8 p-3 sm:p-4 md:p-6 bg-white rounded-2xl shadow-xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {tabOptions.map((tab, idx) => (
          <button
            key={tab.label}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-200
              ${activeTab === idx
                ? 'bg-[var(--color-purple-600)] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-[var(--color-purple-600)]/10 hover:text-[var(--color-purple-600)]'}`}
            onClick={() => setActiveTab(idx)}
            style={{ minWidth: '96px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {/* Collapsed Search Button for mobile */}
      <div className="block md:hidden mb-2">
        {isCollapsed && (
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg bg-[var(--color-purple-600)] text-white font-bold hover:bg-[var(--color-purple-700)] transition-all duration-200 shadow-md"
            onClick={() => setIsCollapsed(false)}
          >
            <FaSearch /> Search Properties
          </button>
        )}
      </div>
      {/* Search Bar */}
      <div className={`w-full flex flex-col md:flex-row gap-2 md:gap-3 items-stretch md:items-center ${isCollapsed ? 'hidden' : ''} md:flex`}>
        {/* City Dropdown */}
        <select
          className="w-full md:w-44 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-sm bg-white"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cityOptions.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-sm bg-white"
            placeholder="Search by Project, Locality, or Builder"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
        </div>
        {/* Budget Dropdown */}
        <select
          className="w-full md:w-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-sm bg-white"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        >
          {budgetOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Property Type Dropdown */}
        <select
          className="w-full md:w-36 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-sm bg-white"
          value={propertyType}
          onChange={e => setPropertyType(e.target.value)}
        >
          {propertyTypeOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Possession Status Dropdown */}
        <select
          className="w-full md:w-40 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--color-purple-600)] focus:border-transparent text-sm bg-white"
          value={possession}
          onChange={e => setPossession(e.target.value)}
        >
          {possessionOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Search Button */}
        <button
          className="w-full md:w-auto px-3 py-2 md:px-8 md:py-2 rounded-lg bg-[var(--color-purple-600)] text-white font-bold text-sm md:text-base hover:bg-[var(--color-purple-700)] transition-all duration-200 shadow-md order-last md:order-none"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>
    </div>
  );
};

export default PropertySearchBar; 