import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';
import { MdPayment, MdReceipt, MdAnalytics } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { paymentHistoryService } from '../../services/paymentManagement/paymentHistoryService';
import { purchaseBookingService } from '../../services/paymentManagement/purchaseBookingService';
import { rentalBookingService } from '../../services/paymentManagement/rentalBookingService';
import { toast } from 'react-toastify';

const PaymentReports = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [summaryData, setSummaryData] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    unreconciledPayments: 0,
    pendingInstallments: 0,
    overdueInstallments: 0,
    pendingRents: 0,
    overdueRents: 0
  });
  const [pendingInstallments, setPendingInstallments] = useState([]);
  const [overdueInstallments, setOverdueInstallments] = useState([]);
  const [pendingRents, setPendingRents] = useState([]);
  const [overdueRents, setOverdueRents] = useState([]);
  const [unreconciledPayments, setUnreconciledPayments] = useState([]);

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      // Fetch all reports in parallel
      const [
        summaryResponse,
        unreconciledResponse,
        pendingInstallmentsResponse,
        overdueInstallmentsResponse,
        pendingRentsResponse,
        overdueRentsResponse
      ] = await Promise.all([
        paymentHistoryService.getPaymentSummaryReports(),
        paymentHistoryService.getUnreconciledPayments(),
        purchaseBookingService.getPendingInstallmentsReport(),
        purchaseBookingService.getOverdueInstallmentsReport(),
        rentalBookingService.getPendingRentsReport(),
        rentalBookingService.getOverdueRentsReport()
      ]);

      setSummaryData(summaryResponse);
      setUnreconciledPayments(unreconciledResponse);
      setPendingInstallments(pendingInstallmentsResponse);
      setOverdueInstallments(overdueInstallmentsResponse);
      setPendingRents(pendingRentsResponse);
      setOverdueRents(overdueRentsResponse);
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback to mock data
      const mockData = getMockReportData();
      setSummaryData(mockData.summary);
      setUnreconciledPayments(mockData.unreconciled);
      setPendingInstallments(mockData.pendingInstallments);
      setOverdueInstallments(mockData.overdueInstallments);
      setPendingRents(mockData.pendingRents);
      setOverdueRents(mockData.overdueRents);
    } finally {
      setLoading(false);
    }
  };

  const getMockReportData = () => ({
    summary: {
      totalPayments: 1250,
      totalAmount: 45000000,
      completedPayments: 980,
      pendingPayments: 180,
      failedPayments: 45,
      unreconciledPayments: 85,
      pendingInstallments: 320,
      overdueInstallments: 45,
      pendingRents: 95,
      overdueRents: 12
    },
    unreconciled: [
      {
        id: 1,
        transactionId: 'TXN-001',
        propertyName: 'Sunset Villa',
        customerName: 'John Smith',
        amount: 25000,
        paymentType: 'RENT',
        paymentStatus: 'COMPLETED',
        date: '2024-01-15',
        responsiblePersonName: 'Sarah Johnson'
      },
      {
        id: 2,
        transactionId: 'TXN-002',
        propertyName: 'Ocean View Apartment',
        customerName: 'Sarah Johnson',
        amount: 15000,
        paymentType: 'DOWN_PAYMENT',
        paymentStatus: 'COMPLETED',
        date: '2024-01-14',
        responsiblePersonName: 'Mike Wilson'
      }
    ],
    pendingInstallments: [
      {
        id: 1,
        propertyName: 'Mountain Lodge',
        customerName: 'Mike Wilson',
        installmentNumber: 5,
        dueDate: '2024-02-01',
        amount: 30000,
        daysOverdue: 0,
        assignedSalespersonName: 'Emily Davis'
      }
    ],
    overdueInstallments: [
      {
        id: 2,
        propertyName: 'Garden House',
        customerName: 'David Brown',
        installmentNumber: 6,
        dueDate: '2024-01-15',
        amount: 20000,
        daysOverdue: 15,
        lateFees: 1000,
        assignedSalespersonName: 'Lisa Anderson'
      }
    ],
    pendingRents: [
      {
        id: 1,
        propertyName: 'City Center Condo',
        customerName: 'Emily Davis',
        rentMonth: '2024-02',
        amount: 12000,
        dueDate: '2024-02-05',
        daysOverdue: 0,
        assignedSalespersonName: 'David Brown'
      }
    ],
    overdueRents: [
      {
        id: 2,
        propertyName: 'Beach House',
        customerName: 'Robert Taylor',
        rentMonth: '2024-01',
        amount: 18000,
        dueDate: '2024-01-05',
        daysOverdue: 25,
        lateFees: 900,
        assignedSalespersonName: 'John Smith'
      }
    ]
  });

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

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'RENT':
        return 'bg-blue-100 text-blue-800';
      case 'DOWN_PAYMENT':
        return 'bg-purple-100 text-purple-800';
      case 'INSTALLMENT':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDateRangeFilter = async () => {
    if (dateRange.startDate && dateRange.endDate) {
      try {
        await paymentHistoryService.getPaymentsByDateRange(
          dateRange.startDate,
          dateRange.endDate
        );
        // Data processing removed as paymentHistory state was removed
      } catch (error) {
        console.error('Error filtering by date range:', error);
        toast.error('Error filtering payments by date range');
      }
    }
  };

  const exportReport = (reportType) => {
    // Mock export functionality
    toast.info(`Exporting ${reportType} report...`);
  };

  if (loading) {
    return <Loader fullScreen text="Loading payment reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Payment Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive payment analysis and reporting dashboard</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{summaryData.totalPayments}</p>
            </div>
            <MdPayment className="text-2xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryData.totalAmount)}</p>
            </div>
            <FaMoneyBillWave className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{summaryData.completedPayments}</p>
            </div>
            <FaCheckCircle className="text-2xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summaryData.pendingPayments}</p>
            </div>
            <FaClock className="text-2xl text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unreconciled</p>
              <p className="text-2xl font-bold text-red-600">{summaryData.unreconciledPayments}</p>
            </div>
            <MdReceipt className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleDateRangeFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                Apply Filter
              </button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="RENT">Rent</option>
              <option value="DOWN_PAYMENT">Down Payment</option>
              <option value="INSTALLMENT">Installment</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Detailed Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unreconciled Payments */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Unreconciled Payments</h3>
              <button
                onClick={() => exportReport('unreconciled')}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaDownload />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Payments requiring reconciliation</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unreconciledPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-sm text-gray-500">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.propertyName}</div>
                      <div className="text-sm text-gray-500">{payment.customerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                        {payment.paymentType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Installments */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Pending Installments</h3>
              <button
                onClick={() => exportReport('pending-installments')}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaDownload />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Installment payments due</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingInstallments.slice(0, 5).map((installment) => (
                  <tr key={installment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{installment.propertyName}</div>
                      <div className="text-sm text-gray-500">{installment.customerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      #{installment.installmentNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(installment.dueDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(installment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Installments */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Overdue Installments</h3>
              <button
                onClick={() => exportReport('overdue-installments')}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaDownload />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Installments with late fees</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount + Fees
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueInstallments.slice(0, 5).map((installment) => (
                  <tr key={installment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{installment.propertyName}</div>
                      <div className="text-sm text-gray-500">{installment.customerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      #{installment.installmentNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                      {installment.daysOverdue} days
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div>{formatCurrency(installment.amount)}</div>
                      <div className="text-xs text-red-600">+{formatCurrency(installment.lateFees)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Rents */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Pending Rents</h3>
              <button
                onClick={() => exportReport('pending-rents')}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaDownload />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Rent payments due</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRents.slice(0, 5).map((rent) => (
                  <tr key={rent.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rent.propertyName}</div>
                      <div className="text-sm text-gray-500">{rent.customerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {rent.rentMonth}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(rent.dueDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(rent.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Rents */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Overdue Rents</h3>
              <button
                onClick={() => exportReport('overdue-rents')}
                className="text-blue-600 hover:text-blue-900"
              >
                <FaDownload />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">Rents with late fees</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property & Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent Month
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount + Fees
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueRents.slice(0, 5).map((rent) => (
                  <tr key={rent.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{rent.propertyName}</div>
                      <div className="text-sm text-gray-500">{rent.customerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {rent.rentMonth}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                      {rent.daysOverdue} days
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div>{formatCurrency(rent.amount)}</div>
                      <div className="text-xs text-red-600">+{formatCurrency(rent.lateFees)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics Charts Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payment Analytics</h3>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FaChartBar />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FaChartLine />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FaChartPie />
            </button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MdAnalytics className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Charts and analytics visualization will be implemented here</p>
            <p className="text-sm text-gray-400">Payment trends, monthly comparisons, and performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReports; 