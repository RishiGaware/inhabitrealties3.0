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
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdPayment, MdCalendarToday, MdPerson } from 'react-icons/md';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const SalespersonManagement = () => {
  const [loading, setLoading] = useState(true);
  const [salespeople, setSalespeople] = useState([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalSalespeople: 0,
    activeSalespeople: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchSalespeopleData();
  }, []);

  const fetchSalespeopleData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch salespeople from a dedicated API
      // For now, we'll use mock data
      const mockData = getMockSalespeopleData();
      setSalespeople(mockData);
      calculateStats(mockData);
    } catch (error) {
      console.error('Error fetching salespeople data:', error);
      toast.error('Error loading salespeople data');
    } finally {
      setLoading(false);
    }
  };

  const getMockSalespeopleData = () => [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@inhabit.com',
      phone: '+1-555-0101',
      status: 'active',
      joinDate: '2023-01-15',
      totalBookings: 24,
      completedBookings: 18,
      pendingBookings: 6,
      totalRevenue: 4500000,
      commission: 135000,
      assignedProperties: 8,
      performance: 'excellent'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@inhabit.com',
      phone: '+1-555-0102',
      status: 'active',
      joinDate: '2023-03-20',
      totalBookings: 18,
      completedBookings: 12,
      pendingBookings: 6,
      totalRevenue: 3200000,
      commission: 96000,
      assignedProperties: 6,
      performance: 'good'
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.davis@inhabit.com',
      phone: '+1-555-0103',
      status: 'active',
      joinDate: '2023-06-10',
      totalBookings: 15,
      completedBookings: 10,
      pendingBookings: 5,
      totalRevenue: 2800000,
      commission: 84000,
      assignedProperties: 5,
      performance: 'good'
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david.brown@inhabit.com',
      phone: '+1-555-0104',
      status: 'inactive',
      joinDate: '2022-11-05',
      totalBookings: 12,
      completedBookings: 8,
      pendingBookments: 4,
      totalRevenue: 1800000,
      commission: 54000,
      assignedProperties: 3,
      performance: 'average'
    }
  ];

  const calculateStats = (data) => {
    const totalSalespeople = data.length;
    const activeSalespeople = data.filter(sp => sp.status === 'active').length;
    const totalBookings = data.reduce((sum, sp) => sum + sp.totalBookings, 0);
    const totalRevenue = data.reduce((sum, sp) => sum + sp.totalRevenue, 0);

    setStats({
      totalSalespeople,
      activeSalespeople,
      totalBookings,
      totalRevenue
    });
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
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

  const handleViewDetails = (salesperson) => {
    setSelectedSalesperson(salesperson);
    setShowDetailsModal(true);
  };

  const filteredSalespeople = salespeople.filter(salesperson => {
    const matchesSearch = 
      salesperson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesperson.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || salesperson.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loader fullScreen text="Loading salespeople data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salesperson Management</h1>
          <p className="text-gray-600">Manage sales team performance and assignments</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdPerson className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Salespeople</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSalespeople}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Salespeople</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSalespeople}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaBuilding className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaMoneyBillWave className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search salespeople..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Salespeople Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sales Team</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salesperson
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalespeople.map((salesperson) => (
                <tr key={salesperson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{salesperson.name}</div>
                      <div className="text-sm text-gray-500">{salesperson.email}</div>
                      <div className="text-sm text-gray-500">{salesperson.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(salesperson.status)}`}>
                      {salesperson.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(salesperson.performance)}`}>
                      {salesperson.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Total: {salesperson.totalBookings}</div>
                      <div className="text-gray-500">Completed: {salesperson.completedBookings}</div>
                      <div className="text-gray-500">Pending: {salesperson.pendingBookings}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">{formatCurrency(salesperson.totalRevenue)}</div>
                      <div className="text-gray-500">Commission: {formatCurrency(salesperson.commission)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(salesperson)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEye className="inline mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSalesperson && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedSalesperson.name} - Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
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
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSalesperson.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedSalesperson.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSalesperson.joinDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSalesperson.status)}`}>
                      {selectedSalesperson.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-lg font-semibold">{selectedSalesperson.totalBookings}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-lg font-semibold text-green-600">{selectedSalesperson.completedBookings}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-lg font-semibold text-yellow-600">{selectedSalesperson.pendingBookings}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Assigned Properties</p>
                      <p className="text-lg font-semibold">{selectedSalesperson.assignedProperties}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Financial Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-lg font-semibold text-blue-600">{formatCurrency(selectedSalesperson.totalRevenue)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Commission Earned</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(selectedSalesperson.commission)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
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

export default SalespersonManagement; 