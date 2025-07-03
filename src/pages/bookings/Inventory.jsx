import React, { useState, useEffect } from 'react';
import { FaBuilding, FaCheckCircle, FaTimesCircle, FaClock, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import Loader from '../../components/common/Loader';

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setInventory([
          {
            id: 1,
            propertyName: 'Sunset Villa',
            propertyType: 'Villa',
            location: 'Miami Beach, FL',
            price: 450000,
            status: 'available',
            bedrooms: 4,
            bathrooms: 3,
            area: 2800,
            unitNumber: 'SV-001',
            lastUpdated: '2024-01-15'
          },
          {
            id: 2,
            propertyName: 'Ocean View Apartment',
            propertyType: 'Apartment',
            location: 'San Diego, CA',
            price: 320000,
            status: 'booked',
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            unitNumber: 'OVA-002',
            lastUpdated: '2024-01-14'
          },
          {
            id: 3,
            propertyName: 'Mountain Lodge',
            propertyType: 'Cabin',
            location: 'Aspen, CO',
            price: 680000,
            status: 'available',
            bedrooms: 3,
            bathrooms: 2,
            area: 2100,
            unitNumber: 'ML-003',
            lastUpdated: '2024-01-13'
          },
          {
            id: 4,
            propertyName: 'City Center Condo',
            propertyType: 'Condo',
            location: 'New York, NY',
            price: 890000,
            status: 'reserved',
            bedrooms: 1,
            bathrooms: 1,
            area: 850,
            unitNumber: 'CCC-004',
            lastUpdated: '2024-01-12'
          },
          {
            id: 5,
            propertyName: 'Garden House',
            propertyType: 'House',
            location: 'Austin, TX',
            price: 520000,
            status: 'available',
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            unitNumber: 'GH-005',
            lastUpdated: '2024-01-11'
          },
          {
            id: 6,
            propertyName: 'Luxury Penthouse',
            propertyType: 'Penthouse',
            location: 'Los Angeles, CA',
            price: 1200000,
            status: 'booked',
            bedrooms: 4,
            bathrooms: 4,
            area: 3500,
            unitNumber: 'LP-006',
            lastUpdated: '2024-01-10'
          },
          {
            id: 7,
            propertyName: 'Beach House',
            propertyType: 'House',
            location: 'Malibu, CA',
            price: 950000,
            status: 'available',
            bedrooms: 3,
            bathrooms: 3,
            area: 2200,
            unitNumber: 'BH-007',
            lastUpdated: '2024-01-09'
          }
        ]);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'booked':
        return 'text-red-600 bg-red-100';
      case 'reserved':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return <FaCheckCircle className="text-green-500" />;
      case 'booked':
        return <FaTimesCircle className="text-red-500" />;
      case 'reserved':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || item.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inventory.length,
    available: inventory.filter(i => i.status === 'available').length,
    booked: inventory.filter(i => i.status === 'booked').length,
    reserved: inventory.filter(i => i.status === 'reserved').length,
    totalValue: inventory.reduce((sum, i) => sum + i.price, 0),
    averagePrice: inventory.reduce((sum, i) => sum + i.price, 0) / inventory.length
  };

  if (loading) {
    return <Loader fullScreen text="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Property Inventory</h1>
        <p className="text-gray-600 mt-1">Manage and track property availability and bookings</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MdInventory className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Booked</p>
              <p className="text-2xl font-bold text-red-600">{stats.booked}</p>
            </div>
            <FaTimesCircle className="text-2xl text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <FaBuilding className="text-2xl text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent w-full sm:w-80"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
              <FaFilter className="mr-2" />
              Advanced Filter
            </button>
            <button className="px-4 py-2 bg-light-primary text-white rounded-md hover:bg-blue-600 transition-colors flex items-center">
              <FaPlus className="mr-2" />
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.propertyName}</h3>
                  <p className="text-sm text-gray-500">{item.propertyType}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(item.status)}
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FaBuilding className="mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Unit:</span>
                  <span className="ml-2">{item.unitNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Bedrooms:</span>
                    <span className="ml-2 font-medium">{item.bedrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bathrooms:</span>
                    <span className="ml-2 font-medium">{item.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Area:</span>
                    <span className="ml-2 font-medium">{item.area} sq ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-medium text-green-600">{formatCurrency(item.price)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Updated: {formatDate(item.lastUpdated)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-light-primary hover:text-blue-600 text-sm font-medium">
                      View Details
                    </button>
                    {item.status === 'available' && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Properties</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Price</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.averagePrice)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Availability Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((stats.available / stats.total) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 