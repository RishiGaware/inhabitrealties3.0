import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaDownload, 
  FaEye, 
  FaCalendarAlt, 
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaEdit,
  FaCheck,
  FaBan
} from 'react-icons/fa';
import { MdPayment, MdCheckCircle, MdReceipt } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { paymentHistoryService } from '../../services/paymentManagement/paymentHistoryService';
import { toast } from 'react-toastify';

const PaymentHistoryEnhanced = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    totalAmount: 0,
    unreconciled: 0
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const data = await paymentHistoryService.getAllPayments();
      setPayments(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Fallback to mock data for development
      const mockData = getMockPaymentData();
      setPayments(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getMockPaymentData = () => [
    {
      id: 1,
      transactionId: 'TXN-001',
      propertyName: 'Sunset Villa',
      customerName: 'John Smith',
      amount: 25000,
      totalAmount: 25000,
      paymentType: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'COMPLETED',
      paymentNotes: 'Monthly rent payment',
      remarks: 'Payment received on time',
      isReconciled: true,
      reconciliationDate: '2024-01-15T10:30:00Z',
      approvedByUserId: 'user_001',
      date: '2024-01-15',
      time: '14:30',
      reference: 'REF-2024-001',
      responsiblePersonId: 'sales_001',
      responsiblePersonName: 'Sarah Johnson'
    },
    {
      id: 2,
      transactionId: 'TXN-002',
      propertyName: 'Ocean View Apartment',
      customerName: 'Sarah Johnson',
      amount: 15000,
      totalAmount: 15000,
      paymentType: 'DOWN_PAYMENT',
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'COMPLETED',
      paymentNotes: 'Property down payment',
      remarks: 'Initial payment received',
      isReconciled: false,
      reconciliationDate: null,
      approvedByUserId: 'user_002',
      date: '2024-01-14',
      time: '09:15',
      reference: 'REF-2024-002',
      responsiblePersonId: 'sales_002',
      responsiblePersonName: 'Mike Wilson'
    },
    {
      id: 3,
      transactionId: 'TXN-003',
      propertyName: 'Mountain Lodge',
      customerName: 'Mike Wilson',
      amount: 30000,
      totalAmount: 30000,
      paymentType: 'INSTALLMENT',
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      paymentNotes: 'Monthly installment payment',
      remarks: 'Awaiting verification',
      isReconciled: false,
      reconciliationDate: null,
      approvedByUserId: null,
      date: '2024-01-13',
      time: '16:45',
      reference: 'REF-2024-003',
      responsiblePersonId: 'sales_003',
      responsiblePersonName: 'Emily Davis'
    },
    {
      id: 4,
      transactionId: 'TXN-004',
      propertyName: 'City Center Condo',
      customerName: 'Emily Davis',
      amount: 12000,
      totalAmount: 12000,
      paymentType: 'RENT',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'FAILED',
      paymentNotes: 'Insufficient funds',
      remarks: 'Payment failed due to insufficient balance',
      isReconciled: false,
      reconciliationDate: null,
      approvedByUserId: null,
      date: '2024-01-12',
      time: '11:20',
      reference: 'REF-2024-004',
      responsiblePersonId: 'sales_004',
      responsiblePersonName: 'David Brown'
    },
    {
      id: 5,
      transactionId: 'TXN-005',
      propertyName: 'Garden House',
      customerName: 'David Brown',
      amount: 20000,
      totalAmount: 20000,
      paymentType: 'INSTALLMENT',
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'COMPLETED',
      paymentNotes: 'Property installment payment',
      remarks: 'Payment processed successfully',
      isReconciled: true,
      reconciliationDate: '2024-01-11T13:10:00Z',
      approvedByUserId: 'user_005',
      date: '2024-01-11',
      time: '13:10',
      reference: 'REF-2024-005',
      responsiblePersonId: 'sales_005',
      responsiblePersonName: 'Lisa Anderson'
    }
  ];

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      completed: data.filter(p => p.paymentStatus === 'COMPLETED').length,
      pending: data.filter(p => p.paymentStatus === 'PENDING').length,
      failed: data.filter(p => p.paymentStatus === 'FAILED').length,
      refunded: data.filter(p => p.paymentStatus === 'REFUNDED').length,
      totalAmount: data.filter(p => p.paymentStatus === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
      unreconciled: data.filter(p => !p.isReconciled).length
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'REFUNDED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <FaCheckCircle className="text-green-500" />;
      case 'PENDING':
        return <FaClock className="text-yellow-500" />;
      case 'FAILED':
        return <FaTimesCircle className="text-red-500" />;
      case 'REFUNDED':
        return <FaBan className="text-blue-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
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

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'date-range' && dateRange.startDate && dateRange.endDate) {
      try {
        const data = await paymentHistoryService.getPaymentsByDateRange(
          dateRange.startDate, 
          dateRange.endDate
        );
        setPayments(data);
        calculateStats(data);
      } catch (error) {
        console.error('Error filtering by date range:', error);
        toast.error('Error filtering payments by date range');
      }
    } else if (newFilter !== 'date-range') {
      try {
        const data = await paymentHistoryService.getPaymentsByStatus(newFilter);
        setPayments(data);
        calculateStats(data);
      } catch (error) {
        console.error('Error filtering by status:', error);
        toast.error('Error filtering payments by status');
      }
    }
  };

  const handlePaymentTypeFilter = async (type) => {
    setPaymentTypeFilter(type);
    if (type !== 'all') {
      try {
        const data = await paymentHistoryService.getPaymentsByType(type);
        setPayments(data);
        calculateStats(data);
      } catch (error) {
        console.error('Error filtering by payment type:', error);
        toast.error('Error filtering payments by type');
      }
    } else {
      fetchPaymentHistory();
    }
  };

  const handleDateRangeFilter = async () => {
    if (dateRange.startDate && dateRange.endDate) {
      try {
        const data = await paymentHistoryService.getPaymentsByDateRange(
          dateRange.startDate, 
          dateRange.endDate
        );
        setPayments(data);
        calculateStats(data);
      } catch (error) {
        console.error('Error filtering by date range:', error);
        toast.error('Error filtering payments by date range');
      }
    }
  };

  const handlePaymentApproval = async (paymentId, approvalData) => {
    try {
      await paymentHistoryService.approvePayment(paymentId, approvalData);
      toast.success('Payment approved successfully');
      fetchPaymentHistory();
      setShowApprovalModal(false);
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Error approving payment');
    }
  };

  const handlePaymentReconciliation = async (paymentId, reconciliationData) => {
    try {
      await paymentHistoryService.reconcilePayment(paymentId, reconciliationData);
      toast.success('Payment reconciled successfully');
      fetchPaymentHistory();
      setShowReconciliationModal(false);
    } catch (error) {
      console.error('Error reconciling payment:', error);
      toast.error('Error reconciling payment');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || payment.paymentStatus === filter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loader fullScreen text="Loading payment history..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Payment History</h1>
        <p className="text-gray-600 mt-1">Comprehensive payment management with approval and reconciliation</p>
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
              <p className="text-sm font-medium text-gray-600">Unreconciled</p>
              <p className="text-2xl font-bold text-red-600">{stats.unreconciled}</p>
            </div>
            <MdReceipt className="text-2xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
              <option value="date-range">Date Range</option>
            </select>

            <select
              value={paymentTypeFilter}
              onChange={(e) => handlePaymentTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="RENT">Rent</option>
              <option value="DOWN_PAYMENT">Down Payment</option>
              <option value="INSTALLMENT">Installment</option>
            </select>
          </div>
        </div>

        {/* Date Range Picker */}
        {filter === 'date-range' && (
          <div className="mt-4 flex gap-4 items-end">
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
            <button
              onClick={handleDateRangeFilter}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-sm text-gray-500">{payment.reference}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.propertyName}</div>
                      <div className="text-sm text-gray-500">{payment.customerName}</div>
                      <div className="text-xs text-gray-400">{payment.responsiblePersonName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                    {payment.totalAmount !== payment.amount && (
                      <div className="text-xs text-gray-500">
                        Total: {formatCurrency(payment.totalAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeColor(payment.paymentType)}`}>
                        {payment.paymentType}
                      </span>
                      <span className="text-sm text-gray-500">{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.paymentStatus)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                    {payment.isReconciled && (
                      <div className="text-xs text-green-600 mt-1">✓ Reconciled</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                    <div className="text-sm text-gray-500">{payment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {payment.paymentStatus === 'PENDING' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowApprovalModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Payment"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {!payment.isReconciled && payment.paymentStatus === 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowReconciliationModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Reconcile Payment"
                        >
                          <MdReceipt />
                        </button>
                      )}
                    </div>
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
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                    <p className="text-sm text-gray-900">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <p className="text-sm text-gray-900">{selectedPayment.reference}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Property</label>
                    <p className="text-sm text-gray-900">{selectedPayment.propertyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <p className="text-sm text-gray-900">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.totalAmount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                    <p className="text-sm text-gray-900">{selectedPayment.paymentType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="text-sm text-gray-900">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">{selectedPayment.paymentStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPayment.date)} {selectedPayment.time}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Notes</label>
                  <p className="text-sm text-gray-900">{selectedPayment.paymentNotes || 'No notes'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks</label>
                  <p className="text-sm text-gray-900">{selectedPayment.remarks || 'No remarks'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsible Person</label>
                  <p className="text-sm text-gray-900">{selectedPayment.responsiblePersonName}</p>
                </div>
                
                {selectedPayment.isReconciled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reconciliation Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedPayment.reconciliationDate).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {selectedPayment.approvedByUserId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approved By</label>
                    <p className="text-sm text-gray-900">{selectedPayment.approvedByUserId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Approval Modal */}
      {showApprovalModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Approve Payment</h3>
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedPayment.transactionId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    id="paymentStatus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="COMPLETED"
                  >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approval Notes</label>
                  <textarea
                    id="approvalNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter approval notes..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const status = document.getElementById('paymentStatus').value;
                      const notes = document.getElementById('approvalNotes').value;
                      handlePaymentApproval(selectedPayment.id, {
                        paymentStatus: status,
                        approvedByUserId: 'current_user_id',
                        paymentNotes: notes
                      });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Reconciliation Modal */}
      {showReconciliationModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reconcile Payment</h3>
                <button
                  onClick={() => setShowReconciliationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedPayment.transactionId}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reconciliation Notes</label>
                  <textarea
                    id="reconciliationNotes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter reconciliation notes..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowReconciliationModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const notes = document.getElementById('reconciliationNotes').value;
                      handlePaymentReconciliation(selectedPayment.id, {
                        isReconciled: true,
                        reconciliationDate: new Date().toISOString(),
                        reconciliationNotes: notes
                      });
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Reconcile Payment
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

export default PaymentHistoryEnhanced; 