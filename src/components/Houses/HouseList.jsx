import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HouseContext } from '../../context/HouseContext';
import HouseItem from './HouseItem';
import Loader from '../common/Loader';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const HouseList = () => {
  const { houses, isLoading } = useContext(HouseContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    priceRange: '',
    bedrooms: '',
    country: '',
    searchQuery: ''
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const types = [...new Set(houses.map(house => house.type))];
    const countries = [...new Set(houses.map(house => house.country))];
    const bedrooms = [...new Set(houses.map(house => house.bedrooms))].sort((a, b) => parseInt(a) - parseInt(b));
    
    return { types, countries, bedrooms };
  }, [houses]);

  // Filter houses based on applied filters
  const filteredHouses = useMemo(() => {
    let filtered = houses;

    if (filters.type) {
      filtered = filtered.filter(house => house.type === filters.type);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(house => {
        const price = parseInt(house.price);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(house => house.bedrooms === filters.bedrooms);
    }

    if (filters.country) {
      filtered = filtered.filter(house => house.country === filters.country);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(house => 
        house.name.toLowerCase().includes(query) ||
        house.address.toLowerCase().includes(query) ||
        house.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [houses, filters]);

  const clearFilters = () => {
    setFilters({
      type: '',
      priceRange: '',
      bedrooms: '',
      country: '',
      searchQuery: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  if (isLoading) {
    return <Loader fullscreen={false} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
            Featured Properties
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <FaTimes />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Form */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Prices</option>
                  <option value="0-100000">Under $100,000</option>
                  <option value="100000-200000">$100,000 - $200,000</option>
                  <option value="200000-300000">$200,000 - $300,000</option>
                  <option value="300000-">$300,000+</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({...filters, bedrooms: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Any</option>
                  {filterOptions.bedrooms.map(bedroom => (
                    <option key={bedroom} value={bedroom}>{bedroom}+ Bedrooms</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.country}
                  onChange={(e) => setFilters({...filters, country: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Locations</option>
                  {filterOptions.countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredHouses.length} of {houses.length} properties
            </p>
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {!hasActiveFilters ? (
        <div className="mb-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Featured Properties
            </h3>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Here are some of our most popular properties. Use the filters above to find your perfect match.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {houses.slice(0, 8).map((house) => (
              <Link to={`/property-details/${house.id}`} key={house.id}>
                <HouseItem house={house} />
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowFilters(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              View All Properties
            </button>
          </div>
        </div>
      ) : filteredHouses.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            No Properties Found
          </h3>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Try adjusting your search criteria or clear some filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <Link to={`/property-details/${house.id}`} key={house.id}>
              <HouseItem house={house} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HouseList;