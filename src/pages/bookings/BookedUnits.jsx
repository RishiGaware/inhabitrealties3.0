import React, { useState, useEffect } from 'react';
import { FaBuilding, FaCalendarAlt, FaUser, FaMoneyBillWave, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import Loader from '../../components/common/Loader';

const BookedUnits = () => {
  const [loading, setLoading] = useState(true);
  const [bookedUnits, setBookedUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookedUnits = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setBookedUnits([
          {
            id: 1,
            propertyName: 'Ocean View Apartment',
            unitNumber: 'OVA-002',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.johnson@email.com',
            customerPhone: '+1 (555) 234-5678',
            bookingDate: '2024-01-10',
            moveInDate: '2024-02-01',
            totalAmount: 320000,
            downPayment: 64000,
            remainingAmount: 256000,
            status: 'confirmed',
            agentName: 'John Smith',
            propertyType: 'Apartment',
            location: 'San Diego, CA'
          },
          {
            id: 2,
            propertyName: 'Luxury Penthouse',
            unitNumber: 'LP-006',
            customerName: 'Lisa Anderson',
            customerEmail: 'lisa.anderson@email.com',
            customerPhone: '+1 (555) 678-9012',
            bookingDate: '2024-01-08',
            moveInDate: '2024-01-25',
            totalAmount: 1200000,
            downPayment: 240000,
            remainingAmount: 960000,
            status: 'confirmed',
            agentName: 'Mike Wilson',
            propertyType: 'Penthouse',
            location: 'Los Angeles, CA'
          },
          {
            id: 3,
            propertyName: 'City Center Condo',
            unitNumber: 'CCC-004',
            customerName: 'Emily Davis',
            customerEmail: 'emily.davis@email.com',
            customerPhone: '+1 (555) 456-7890',
            bookingDate: '2024-01-12',
            moveInDate: '2024-02-15',
            totalAmount: 890000,
            downPayment: 178000,
            remainingAmount: 712000,
            status: 'pending',
            agentName: 'David Brown',
            propertyType: 'Condo',
            location: 'New York, NY'
          },
          {
            id: 4,
            propertyName: 'Garden House',
            unitNumber: 'GH-005',
            customerName: 'David Brown',
            customerEmail: 'david.brown@email.com',
            customerPhone: '+1 (555) 567-8901',
            bookingDate: '2024-01-05',
            moveInDate: '2024-01-20',
            totalAmount: 520000,
            downPayment: 104000,
            remainingAmount: 416000,
            status: 'confirmed',
            agentName: 'Sarah Johnson',
            propertyType: 'House',
            location: 'Austin, TX'
          },
          {
            id: 5,
            propertyName: 'Mountain Lodge',
            unitNumber: 'ML-003',
            customerName: 'Robert Taylor',
            customerEmail: 'robert.taylor@email.com',
            customerPhone: '+1 (555) 789-0123',
            bookingDate: '2024-01-15',
            moveInDate: '2024-02-10',
            totalAmount: 680000,
            downPayment: 136000,
            remainingAmount: 544000,
            status: 'pending',
            agentName: 'Emily Davis',
            propertyType: 'Cabin',
            location: 'Aspen, CO'
          }
        ]);
      } catch (error) {
        console.error('Error fetching booked units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedUnits();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  const filteredBookedUnits = bookedUnits.filter(unit => {
    const matchesSearch = 
      unit.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || unit.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: bookedUnits.length,
    confirmed: bookedUnits.filter(u => u.status === 'confirmed').length,
    pending: bookedUnits.filter(u => u.status === 'pending').length,
    totalValue: bookedUnits.reduce((sum, u) => sum + u.totalAmount, 0),
    totalDownPayment: bookedUnits.reduce((sum, u) => sum + u.downPayment, 0)
  };

  if (loading) {
    return <Loader fullScreen text="Loading booked units..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Booked Units</h1>
        <p className="text-gray-600 mt-1">View and manage all booked properties</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MdInventory className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <FaBuilding className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <FaCalendarAlt className="text-2xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalValue)}</p>
            </div>
            <FaMoneyBillWave className="text-2xl text-purple-500" />
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
                placeholder="Search properties or customers..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
              <FaFilter className="mr-2" />
              Advanced Filter
            </button>
            <button className="px-4 py-2 bg-light-primary text-white rounded-md hover:bg-blue-600 transition-colors flex items-center">
              <FaEye className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Booked Units Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookedUnits.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {unit.propertyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {unit.unitNumber} • {unit.propertyType}
                      </div>
                      <div className="text-sm text-gray-500">
                        {unit.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {unit.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Booked: {formatDate(unit.bookingDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Move-in: {formatDate(unit.moveInDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(unit.totalAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Down: {formatCurrency(unit.downPayment)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Remaining: {formatCurrency(unit.remainingAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(unit.status)}`}>
                      {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {unit.agentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-light-primary hover:text-blue-600 mr-3">
                      <FaEye className="inline mr-1" />
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Down Payments</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalDownPayment)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Booking Value</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalValue / stats.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedUnits; 