import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaClock, FaCalendarAlt, FaMoneyBillWave, FaEnvelope, FaPhone } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import Loader from '../../components/common/Loader';

const DuePayments = () => {
  const [loading, setLoading] = useState(true);
  const [duePayments, setDuePayments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDuePayments = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        setDuePayments([
          {
            id: 1,
            propertyName: 'Sunset Villa',
            customerName: 'John Smith',
            customerEmail: 'john.smith@email.com',
            customerPhone: '+1 (555) 123-4567',
            amount: 25000,
            dueDate: '2024-01-15',
            daysOverdue: 5,
            status: 'overdue',
            installmentNumber: 3,
            totalInstallments: 12,
            lastReminder: '2024-01-10'
          },
          {
            id: 2,
            propertyName: 'Ocean View Apartment',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.johnson@email.com',
            customerPhone: '+1 (555) 234-5678',
            amount: 15000,
            dueDate: '2024-01-20',
            daysOverdue: 0,
            status: 'due_today',
            installmentNumber: 2,
            totalInstallments: 24,
            lastReminder: '2024-01-18'
          },
          {
            id: 3,
            propertyName: 'Mountain Lodge',
            customerName: 'Mike Wilson',
            customerEmail: 'mike.wilson@email.com',
            customerPhone: '+1 (555) 345-6789',
            amount: 30000,
            dueDate: '2024-01-25',
            daysOverdue: -3,
            status: 'upcoming',
            installmentNumber: 4,
            totalInstallments: 18,
            lastReminder: null
          },
          {
            id: 4,
            propertyName: 'City Center Condo',
            customerName: 'Emily Davis',
            customerEmail: 'emily.davis@email.com',
            customerPhone: '+1 (555) 456-7890',
            amount: 12000,
            dueDate: '2024-01-12',
            daysOverdue: 8,
            status: 'overdue',
            installmentNumber: 1,
            totalInstallments: 36,
            lastReminder: '2024-01-15'
          },
          {
            id: 5,
            propertyName: 'Garden House',
            customerName: 'David Brown',
            customerEmail: 'david.brown@email.com',
            customerPhone: '+1 (555) 567-8901',
            amount: 20000,
            dueDate: '2024-01-30',
            daysOverdue: -8,
            status: 'upcoming',
            installmentNumber: 5,
            totalInstallments: 12,
            lastReminder: null
          },
          {
            id: 6,
            propertyName: 'Luxury Penthouse',
            customerName: 'Lisa Anderson',
            customerEmail: 'lisa.anderson@email.com',
            customerPhone: '+1 (555) 678-9012',
            amount: 45000,
            dueDate: '2024-01-18',
            daysOverdue: 2,
            status: 'overdue',
            installmentNumber: 6,
            totalInstallments: 24,
            lastReminder: '2024-01-16'
          }
        ]);
      } catch (error) {
        console.error('Error fetching due payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDuePayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'due_today':
        return 'text-orange-600 bg-orange-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overdue':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'due_today':
        return <FaClock className="text-orange-500" />;
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

  const getDaysText = (days) => {
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else {
      return `Due in ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''}`;
    }
  };

  const filteredPayments = duePayments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const stats = {
    total: duePayments.length,
    overdue: duePayments.filter(p => p.status === 'overdue').length,
    dueToday: duePayments.filter(p => p.status === 'due_today').length,
    upcoming: duePayments.filter(p => p.status === 'upcoming').length,
    totalAmount: duePayments.reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: duePayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  };

  const sendReminder = (paymentId) => {
    console.log(`Sending reminder for payment ${paymentId}`);
    // Here you would typically make an API call to send a reminder
  };

  const callCustomer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const emailCustomer = (email) => {
    window.open(`mailto:${email}`, '_self');
  };

  if (loading) {
    return <Loader fullScreen text="Loading due payments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Due Payments</h1>
        <p className="text-gray-600 mt-1">Track and manage overdue and upcoming payments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Due</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MdPayment className="text-2xl text-blue-500" />
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
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-orange-600">{stats.dueToday}</p>
            </div>
            <FaClock className="text-2xl text-orange-500" />
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
              <option value="overdue">Overdue</option>
              <option value="due_today">Due Today</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-light-primary text-white rounded-md hover:bg-blue-600 transition-colors">
            <FaEnvelope className="inline mr-2" />
            Send Bulk Reminders
          </button>
        </div>
      </div>

      {/* Due Payments Table */}
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
                  Contact
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
                        {payment.propertyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.installmentNumber} of {payment.totalInstallments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.dueDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getDaysText(payment.daysOverdue)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status.replace('_', ' ').charAt(0).toUpperCase() + payment.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => emailCustomer(payment.customerEmail)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Send Email"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        onClick={() => callCustomer(payment.customerPhone)}
                        className="text-green-600 hover:text-green-800"
                        title="Call Customer"
                      >
                        <FaPhone />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => sendReminder(payment.id)}
                      className="text-light-primary hover:text-blue-600 mr-3"
                    >
                      Send Reminder
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      Mark Paid
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Amount Due</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Overdue Amount</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Days Overdue</p>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(duePayments.filter(p => p.daysOverdue > 0).reduce((sum, p) => sum + p.daysOverdue, 0) / Math.max(duePayments.filter(p => p.daysOverdue > 0).length, 1))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuePayments; 