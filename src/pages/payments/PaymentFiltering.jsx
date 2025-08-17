import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaCalendarAlt, 
  FaMoneyBillWave,
  FaUser,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import { MdPayment, MdCalendarToday } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { paymentHistoryService } from '../../services/paymentManagement/paymentHistoryService';
import { toast } from 'react-toastify';

const PaymentFiltering = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    paymentType: 'all',
    status: 'all',
    bookingType: 'all',
    responsiblePerson: 'all',
    dateRange: { startDate: '', endDate: '' },
    amountRange: { min: '', max: '' }
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [stats, setStats] = useState({
    totalResults: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  useEffect(() => {
    // Initial load with default filters
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      let data = [];
      
      // Apply filters based on selection
      if (filters.paymentType !== 'all') {
        data = await paymentHistoryService.getPaymentsByType(filters.paymentType);
      } else if (filters.status !== 'all') {
        data = await paymentHistoryService.getPaymentsByStatus(filters.status);
      } else if (filters.bookingType !== 'all') {
        data = await paymentHistoryService.getPaymentsByBookingType(filters.bookingType);
      } else if (filters.dateRange.startDate && filters.dateRange.endDate) {
        data = await paymentHistoryService.getPaymentsByDateRange(
          filters.dateRange.startDate,
          filters.dateRange.endDate
        );
      } else {
        // Get all payments and apply client-side filtering
        data = await paymentHistoryService.getAllPayments();
      }

      // Apply additional client-side filters
      let filteredData = data;
      
      if (searchTerm) {
        filteredData = filteredData.filter(payment => 
          payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.amountRange.min || filters.amountRange.max) {
        filteredData = filteredData.filter(payment => {
          const amount = parseFloat(payment.amount);
          const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : 0;
          const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
          return amount >= min && amount <= max;
        });
      }

      setPayments(filteredData);
      calculateStats(filteredData);
    } catch (error) {
      console.error('Error searching payments:', error);
      // Fallback to mock data
      const mockData = getMockPaymentData();
      setPayments(mockData);
      calculateStats(mockData);
    } finally {
      // setLoading(false); // Removed loading state
    }
  };

  const getMockPaymentData = () => [
    {
      id: '1',
      transactionId: 'TXN-001',
      customerName: 'John Smith',
      propertyName: 'Sunset Villa',
      paymentType: 'DOWN_PAYMENT',
      bookingType: 'PURCHASE',
      amount: 50000,
      status: 'COMPLETED',
      responsiblePerson: 'Sarah Johnson',
      paymentDate: '2024-01-15',
      paymentMode: 'BANK_TRANSFER',
      reference: 'REF-2024-001'
    },
    {
      id: '2',
      transactionId: 'TXN-002',
      customerName: 'Emily Davis',
      propertyName: 'Ocean View Apartment',
      paymentType: 'RENT',
      bookingType: 'RENTAL',
      amount: 2500,
      status: 'PENDING',
      responsiblePerson: 'Mike Wilson',
      paymentDate: '2024-01-14',
      paymentMode: 'CREDIT_CARD',
      reference: 'REF-2024-002'
    },
    {
      id: '3',
      transactionId: 'TXN-003',
      customerName: 'David Brown',
      propertyName: 'Mountain Lodge',
      paymentType: 'INSTALLMENT',
      bookingType: 'PURCHASE',
      amount: 75000,
      status: 'COMPLETED',
      responsiblePerson: 'Sarah Johnson',
      paymentDate: '2024-01-13',
      paymentMode: 'CASH',
      reference: 'REF-2024-003'
    },
    {
      id: '4',
      transactionId: 'TXN-004',
      customerName: 'Lisa Wilson',
      propertyName: 'City Center Condo',
      paymentType: 'MAINTENANCE',
      bookingType: 'RENTAL',
      amount: 500,
      status: 'FAILED',
      responsiblePerson: 'Emily Davis',
      paymentDate: '2024-01-12',
      paymentMode: 'ONLINE',
      reference: 'REF-2024-004'
    }
  ];

  const calculateStats = (data) => {
    const totalResults = data.length;
    const totalAmount = data.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    const averageAmount = totalResults > 0 ? totalAmount / totalResults : 0;

    setStats({
      totalResults,
      totalAmount,
      averageAmount
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [key]: value
      }
    }));
  };

  const handleAmountRangeChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      amountRange: {
        ...prev.amountRange,
        [key]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      paymentType: 'all',
      status: 'all',
      bookingType: 'all',
      responsiblePerson: 'all',
      dateRange: { startDate: '', endDate: '' },
      amountRange: { min: '', max: '' }
    });
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'REFUNDED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'DOWN_PAYMENT': return 'text-blue-600 bg-blue-100';
      case 'RENT': return 'text-purple-600 bg-purple-100';
      case 'INSTALLMENT': return 'text-green-600 bg-green-100';
      case 'MAINTENANCE': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBookingTypeColor = (type) => {
    switch (type) {
      case 'PURCHASE': return 'text-indigo-600 bg-indigo-100';
      case 'RENTAL': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const exportResults = () => {
    // Implementation for exporting filtered results
    toast.info('Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Filtering & Search</h1>
          <p className="text-gray-600">Advanced payment search and filtering capabilities</p>
        </div>
        <button
          onClick={exportResults}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaDownload />
          Export Results
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaSearch className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResults}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaMoneyBillWave className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaChartBar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Basic Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, property, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filters.paymentType}
              onChange={(e) => handleFilterChange('paymentType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payment Types</option>
              <option value="DOWN_PAYMENT">Down Payment</option>
              <option value="RENT">Rent</option>
              <option value="INSTALLMENT">Installment</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FaFilter />
              Advanced
            </button>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
                <select
                  value={filters.bookingType}
                  onChange={(e) => handleFilterChange('bookingType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Booking Types</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="RENTAL">Rental</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Person</label>
                <select
                  value={filters.responsiblePerson}
                  onChange={(e) => handleFilterChange('responsiblePerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Persons</option>
                  <option value="Sarah Johnson">Sarah Johnson</option>
                  <option value="Mike Wilson">Mike Wilson</option>
                  <option value="Emily Davis">Emily Davis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.amountRange.min}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={filters.amountRange.max}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <FaTimesCircle />
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsible Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-sm text-gray-500">{formatDate(payment.paymentDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                      <div className="text-sm text-gray-500">{payment.propertyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      <div className="text-sm text-gray-500">{payment.paymentMode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                          {payment.paymentType}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBookingTypeColor(payment.bookingType)}`}>
                          {payment.bookingType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.responsiblePerson}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewPayment(payment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye className="inline mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Details - {selectedPayment.transactionId}
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.propertyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.paymentMode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPayment.paymentDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.reference}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Payment Classification</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Type</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(selectedPayment.paymentType)}`}>
                        {selectedPayment.paymentType}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Booking Type</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBookingTypeColor(selectedPayment.bookingType)}`}>
                        {selectedPayment.bookingType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFiltering; 