import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaSearch, 
  FaEye, 
  FaEdit, 
  FaMoneyBillWave,
  FaBuilding,
  FaUser,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import { MdPayment, MdCalendarToday } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';
import { toast } from 'react-toastify';

const PurchaseBookingManagement = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalValue: 0
  });

  const [formData, setFormData] = useState({
    propertyId: '',
    customerId: '',
    assignedSalespersonId: '',
    totalPropertyValue: '',
    downPayment: '',
    paymentTerms: 'INSTALLMENTS',
    installmentCount: '',
    isFinanced: true,
    bankName: '',
    loanTenure: '',
    interestRate: '',
    emiAmount: ''
  });

  useEffect(() => {
    fetchPurchaseBookings();
  }, []);

  const fetchPurchaseBookings = async () => {
    setLoading(true);
    try {
      const data = await purchaseBookingService.getAllPurchaseBookings();
      setBookings(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching purchase bookings:', error);
      const mockData = getMockPurchaseBookings();
      setBookings(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockPurchaseBookings = () => [
    {
      id: 1,
      propertyName: 'Sunset Villa',
      customerName: 'John Smith',
      assignedSalespersonName: 'Sarah Johnson',
      totalPropertyValue: 5000000,
      downPayment: 1000000,
      emiAmount: 45000,
      status: 'ACTIVE',
      installmentSchedule: [
        { installmentNumber: 1, dueDate: '2024-02-01', amount: 45000, status: 'PAID' },
        { installmentNumber: 2, dueDate: '2024-03-01', amount: 45000, status: 'PENDING' }
      ]
    }
  ];

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      active: data.filter(b => b.status === 'ACTIVE').length,
      totalValue: data.reduce((sum, b) => sum + b.totalPropertyValue, 0)
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
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

  const handleCreateBooking = async () => {
    try {
      await purchaseBookingService.createPurchaseBooking(formData);
      toast.success('Purchase booking created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchPurchaseBookings();
    } catch (error) {
      console.error('Error creating purchase booking:', error);
      toast.error('Error creating purchase booking');
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      customerId: '',
      assignedSalespersonId: '',
      totalPropertyValue: '',
      downPayment: '',
      paymentTerms: 'INSTALLMENTS',
      installmentCount: '',
      isFinanced: true,
      bankName: '',
      loanTenure: '',
      interestRate: '',
      emiAmount: ''
    });
  };

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      propertyId: booking.propertyId || '',
      customerId: booking.customerId || '',
      assignedSalespersonId: booking.assignedSalespersonId || '',
      totalPropertyValue: booking.totalPropertyValue || '',
      downPayment: booking.downPayment || '',
      paymentTerms: booking.paymentTerms || 'INSTALLMENTS',
      installmentCount: booking.installmentCount || '',
      isFinanced: booking.isFinanced || true,
      bankName: booking.bankName || '',
      loanTenure: booking.loanTenure || '',
      interestRate: booking.interestRate || '',
      emiAmount: booking.emiAmount || ''
    });
    setShowEditModal(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return <Loader fullScreen text="Loading purchase bookings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Purchase Booking Management</h1>
            <p className="text-gray-600 mt-1">Manage property purchase bookings and installment schedules</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <FaPlus /> Create Booking
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaBuilding className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
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

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financial Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salesperson
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.propertyName}</div>
                      <div className="text-sm text-gray-500">{booking.customerName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Total: {formatCurrency(booking.totalPropertyValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Down: {formatCurrency(booking.downPayment)}
                      </div>
                      <div className="text-sm text-gray-500">
                        EMI: {formatCurrency(booking.emiAmount)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.assignedSalespersonName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(booking)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Booking"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Purchase Booking</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property ID</label>
                    <input
                      type="text"
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter property ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                    <input
                      type="text"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter customer ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Property Value</label>
                    <input
                      type="number"
                      value={formData.totalPropertyValue}
                      onChange={(e) => setFormData({ ...formData, totalPropertyValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter total value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                    <input
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter down payment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Installment Count</label>
                    <input
                      type="number"
                      value={formData.installmentCount}
                      onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter installment count"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EMI Amount</label>
                    <input
                      type="number"
                      value={formData.emiAmount}
                      onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter EMI amount"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBooking}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
              <Heading as="h1" fontSize={{ base: 'lg', sm: 'xl', md: '2xl' }} fontWeight="bold" textAlign={{ base: 'center', md: 'left' }}>
        Edit Purchase Booking
        </Heading>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property ID</label>
                    <input
                      type="text"
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                    <input
                      type="text"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Property Value</label>
                    <input
                      type="number"
                      value={formData.totalPropertyValue}
                      onChange={(e) => setFormData({ ...formData, totalPropertyValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                    <input
                      type="number"
                      value={formData.downPayment}
                      onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle update logic here
                      setShowEditModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseBookingManagement; 