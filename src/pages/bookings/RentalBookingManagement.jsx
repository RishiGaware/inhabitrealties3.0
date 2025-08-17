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
  FaCalendarAlt,
  FaHome
} from 'react-icons/fa';
import { MdPayment, MdCalendarToday } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';
import { toast } from 'react-toastify';

const RentalBookingManagement = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRentPaymentModal, setShowRentPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRent: 0,
    pendingRents: 0
  });

  const [formData, setFormData] = useState({
    propertyId: '',
    customerId: '',
    assignedSalespersonId: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: '',
    advanceRent: '',
    rentDueDate: ''
  });

  const [rentPaymentData, setRentPaymentData] = useState({
    rentMonth: '',
    amount: '',
    paymentMode: 'ONLINE',
    paidDate: '',
    paymentNotes: ''
  });

  useEffect(() => {
    fetchRentalBookings();
  }, []);

  const fetchRentalBookings = async () => {
    setLoading(true);
    try {
      const data = await rentalBookingService.getAllRentalBookings();
      setBookings(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching rental bookings:', error);
      const mockData = getMockRentalBookings();
      setBookings(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockRentalBookings = () => [
    {
      id: 1,
      propertyName: 'Sunset Villa',
      customerName: 'John Smith',
      assignedSalespersonName: 'Sarah Johnson',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 25000,
      securityDeposit: 50000,
      maintenanceCharges: 2000,
      advanceRent: 2,
      rentDueDate: 5,
      status: 'ACTIVE',
      rentSchedule: [
        { rentMonth: '2024-01', amount: 25000, status: 'PAID', paidDate: '2024-01-05' },
        { rentMonth: '2024-02', amount: 25000, status: 'PENDING', dueAmount: 25000 }
      ]
    },
    {
      id: 2,
      propertyName: 'Ocean View Apartment',
      customerName: 'Sarah Johnson',
      assignedSalespersonName: 'Mike Wilson',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      monthlyRent: 18000,
      securityDeposit: 36000,
      maintenanceCharges: 1500,
      advanceRent: 1,
      rentDueDate: 7,
      status: 'ACTIVE',
      rentSchedule: [
        { rentMonth: '2024-02', amount: 18000, status: 'PAID', paidDate: '2024-02-03' },
        { rentMonth: '2024-03', amount: 18000, status: 'PENDING', dueAmount: 18000 }
      ]
    }
  ];

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      active: data.filter(b => b.status === 'ACTIVE').length,
      totalRent: data.reduce((sum, b) => sum + b.monthlyRent, 0),
      pendingRents: data.reduce((sum, b) => {
        return sum + (b.rentSchedule?.filter(r => r.status === 'PENDING').length || 0);
      }, 0)
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'EXPIRED': return 'text-red-600 bg-red-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const handleCreateBooking = async () => {
    try {
      await rentalBookingService.createRentalBooking(formData);
      toast.success('Rental booking created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchRentalBookings();
    } catch (error) {
      console.error('Error creating rental booking:', error);
      toast.error('Error creating rental booking');
    }
  };

  const handleRecordRentPayment = async () => {
    try {
      await rentalBookingService.recordRentPayment(selectedBooking.id, rentPaymentData);
      toast.success('Rent payment recorded successfully');
      setShowRentPaymentModal(false);
      resetRentPaymentForm();
      fetchRentalBookings();
    } catch (error) {
      console.error('Error recording rent payment:', error);
      toast.error('Error recording rent payment');
    }
  };

  const resetForm = () => {
    setFormData({
      propertyId: '',
      customerId: '',
      assignedSalespersonId: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
      securityDeposit: '',
      maintenanceCharges: '',
      advanceRent: '',
      rentDueDate: ''
    });
  };

  const resetRentPaymentForm = () => {
    setRentPaymentData({
      rentMonth: '',
      amount: '',
      paymentMode: 'ONLINE',
      paidDate: '',
      paymentNotes: ''
    });
  };

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      propertyId: booking.propertyId || '',
      customerId: booking.customerId || '',
      assignedSalespersonId: booking.assignedSalespersonId || '',
      startDate: booking.startDate || '',
      endDate: booking.endDate || '',
      monthlyRent: booking.monthlyRent || '',
      securityDeposit: booking.securityDeposit || '',
      maintenanceCharges: booking.maintenanceCharges || '',
      advanceRent: booking.advanceRent || '',
      rentDueDate: booking.rentDueDate || ''
    });
    setShowEditModal(true);
  };

  const openRentPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setRentPaymentData({
      ...rentPaymentData,
      amount: booking.monthlyRent
    });
    setShowRentPaymentModal(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return <Loader fullScreen text="Loading rental bookings..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rental Booking Management</h1>
            <p className="text-gray-600 mt-1">Manage property rental bookings and rent schedules</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <FaPlus /> Create Rental
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Rentals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaHome className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Rentals</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Monthly Rent</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRent)}</p>
            </div>
            <FaMoneyBillWave className="text-2xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Rents</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRents}</p>
            </div>
            <FaCalendarAlt className="text-2xl text-yellow-500" />
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
                  Rental Details
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
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: {booking.rentDueDate}th of month
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Rent: {formatCurrency(booking.monthlyRent)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Deposit: {formatCurrency(booking.securityDeposit)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Maintenance: {formatCurrency(booking.maintenanceCharges)}
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
                        onClick={() => openRentPaymentModal(booking)}
                        className="text-green-600 hover:text-green-900"
                        title="Record Rent Payment"
                      >
                        <MdPayment />
                      </button>
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

      {/* Create Rental Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create Rental Booking</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter monthly rent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                    <input
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter security deposit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Charges</label>
                    <input
                      type="number"
                      value={formData.maintenanceCharges}
                      onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter maintenance charges"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent Due Date</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.rentDueDate}
                      onChange={(e) => setFormData({ ...formData, rentDueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Day of month"
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
                    Create Rental
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rental Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Rental Booking</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent</label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit</label>
                    <input
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
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
                    Update Rental
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Rent Payment Modal */}
      {showRentPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Record Rent Payment</h3>
                <button
                  onClick={() => setShowRentPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <p className="text-sm text-gray-900">{selectedBooking.propertyName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <p className="text-sm text-gray-900">{selectedBooking.customerName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rent Month</label>
                    <input
                      type="month"
                      value={rentPaymentData.rentMonth}
                      onChange={(e) => setRentPaymentData({ ...rentPaymentData, rentMonth: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={rentPaymentData.amount}
                      onChange={(e) => setRentPaymentData({ ...rentPaymentData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                    <select
                      value={rentPaymentData.paymentMode}
                      onChange={(e) => setRentPaymentData({ ...rentPaymentData, paymentMode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CASH">Cash</option>
                      <option value="CHEQUE">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                    <input
                      type="date"
                      value={rentPaymentData.paidDate}
                      onChange={(e) => setRentPaymentData({ ...rentPaymentData, paidDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Notes</label>
                  <textarea
                    value={rentPaymentData.paymentNotes}
                    onChange={(e) => setRentPaymentData({ ...rentPaymentData, paymentNotes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payment notes..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRentPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecordRentPayment}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Record Payment
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

export default RentalBookingManagement; 