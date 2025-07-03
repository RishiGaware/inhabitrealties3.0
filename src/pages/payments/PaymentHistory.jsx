import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import Loader from '../../components/common/Loader';

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setPayments([
          {
            id: 1,
            transactionId: 'TXN-001',
            propertyName: 'Sunset Villa',
            customerName: 'John Smith',
            amount: 25000,
            paymentMethod: 'Bank Transfer',
            status: 'completed',
            date: '2024-01-15',
            time: '14:30',
            reference: 'REF-2024-001'
          },
          {
            id: 2,
            transactionId: 'TXN-002',
            propertyName: 'Ocean View Apartment',
            customerName: 'Sarah Johnson',
            amount: 15000,
            paymentMethod: 'Credit Card',
            status: 'completed',
            date: '2024-01-14',
            time: '09:15',
            reference: 'REF-2024-002'
          },
          {
            id: 3,
            transactionId: 'TXN-003',
            propertyName: 'Mountain Lodge',
            customerName: 'Mike Wilson',
            amount: 30000,
            paymentMethod: 'Cash',
            status: 'completed',
            date: '2024-01-13',
            time: '16:45',
            reference: 'REF-2024-003'
          },
          {
            id: 4,
            transactionId: 'TXN-004',
            propertyName: 'City Center Condo',
            customerName: 'Emily Davis',
            amount: 12000,
            paymentMethod: 'Bank Transfer',
            status: 'failed',
            date: '2024-01-12',
            time: '11:20',
            reference: 'REF-2024-004'
          },
          {
            id: 5,
            transactionId: 'TXN-005',
            propertyName: 'Garden House',
            customerName: 'David Brown',
            amount: 20000,
            paymentMethod: 'Credit Card',
            status: 'completed',
            date: '2024-01-11',
            time: '13:10',
            reference: 'REF-2024-005'
          },
          {
            id: 6,
            transactionId: 'TXN-006',
            propertyName: 'Luxury Penthouse',
            customerName: 'Lisa Anderson',
            amount: 45000,
            paymentMethod: 'Bank Transfer',
            status: 'completed',
            date: '2024-01-10',
            time: '10:30',
            reference: 'REF-2024-006'
          },
          {
            id: 7,
            transactionId: 'TXN-007',
            propertyName: 'Beach House',
            customerName: 'Robert Taylor',
            amount: 18000,
            paymentMethod: 'Cash',
            status: 'pending',
            date: '2024-01-09',
            time: '15:45',
            reference: 'REF-2024-007'
          }
        ]);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
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

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || payment.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return <Loader fullScreen text="Loading payment history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MdPayment className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <FaMoneyBillWave className="text-2xl text-green-500" />
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
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalAmount)}</p>
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
                placeholder="Search by customer, property, or transaction ID..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center">
              <FaFilter className="mr-2" />
              Advanced Filter
            </button>
            <button className="px-4 py-2 bg-light-primary text-white rounded-md hover:bg-blue-600 transition-colors flex items-center">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.transactionId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.reference}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.propertyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.paymentMethod}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-light-primary hover:text-blue-600 mr-3">
                      <FaEye className="inline mr-1" />
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <FaDownload className="inline mr-1" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-2 bg-light-primary text-white rounded-md">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory; 