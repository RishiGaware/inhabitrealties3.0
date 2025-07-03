import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import Loader from '../../components/common/Loader';

const Installments = () => {
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInstallments = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setInstallments([
          {
            id: 1,
            propertyName: 'Sunset Villa',
            customerName: 'John Smith',
            installmentNumber: 1,
            totalInstallments: 12,
            amount: 25000,
            dueDate: '2024-01-15',
            status: 'paid',
            paidDate: '2024-01-10',
            paymentMethod: 'Bank Transfer'
          },
          {
            id: 2,
            propertyName: 'Ocean View Apartment',
            customerName: 'Sarah Johnson',
            installmentNumber: 3,
            totalInstallments: 24,
            amount: 15000,
            dueDate: '2024-01-20',
            status: 'pending',
            paidDate: null,
            paymentMethod: null
          },
          {
            id: 3,
            propertyName: 'Mountain Lodge',
            customerName: 'Mike Wilson',
            installmentNumber: 6,
            totalInstallments: 18,
            amount: 30000,
            dueDate: '2024-01-25',
            status: 'overdue',
            paidDate: null,
            paymentMethod: null
          },
          {
            id: 4,
            propertyName: 'City Center Condo',
            customerName: 'Emily Davis',
            installmentNumber: 2,
            totalInstallments: 36,
            amount: 12000,
            dueDate: '2024-02-01',
            status: 'upcoming',
            paidDate: null,
            paymentMethod: null
          },
          {
            id: 5,
            propertyName: 'Garden House',
            customerName: 'David Brown',
            installmentNumber: 8,
            totalInstallments: 12,
            amount: 20000,
            dueDate: '2024-01-18',
            status: 'paid',
            paidDate: '2024-01-15',
            paymentMethod: 'Credit Card'
          }
        ]);
      } catch (error) {
        console.error('Error fetching installments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'overdue':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'upcoming':
        return <FaCalendarAlt className="text-blue-500" />;
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

  const filteredInstallments = installments.filter(installment => {
    if (filter === 'all') return true;
    return installment.status === filter;
  });

  const stats = {
    total: installments.length,
    paid: installments.filter(i => i.status === 'paid').length,
    pending: installments.filter(i => i.status === 'pending').length,
    overdue: installments.filter(i => i.status === 'overdue').length,
    totalAmount: installments.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  };

  if (loading) {
    return <Loader fullScreen text="Loading installments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Installments</h1>
        <p className="text-gray-600 mt-1">Manage and track payment installments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Installments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MdPayment className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <FaClock className="text-2xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <FaExclamationTriangle className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-primary focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-light-primary text-white rounded-md hover:bg-blue-600 transition-colors">
            <FaMoneyBillWave className="inline mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Installments Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Installment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
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
              {filteredInstallments.map((installment) => (
                <tr key={installment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {installment.propertyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {installment.customerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {installment.installmentNumber} of {installment.totalInstallments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(installment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(installment.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(installment.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(installment.status)}`}>
                        {installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-light-primary hover:text-blue-600 mr-3">
                      View Details
                    </button>
                    {installment.status !== 'paid' && (
                      <button className="text-green-600 hover:text-green-800">
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Installments; 