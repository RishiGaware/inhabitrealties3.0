import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppProvider from './providers/AppProvider';
import NetworkStatusProvider from './components/common/NetworkStatusProvider';
import OfflineIndicator from './components/common/OfflineIndicator';
import NotFound from './components/common/errors/NotFound';
import ScrollToTop from './components/ScrollToTop';
// import AppRoutes from './routes';

import Header from './components/Header/Header';
import Home from './routes/Home';
import PropertyDetails from './routes/PropertyDetails';
import Footer from './components/Footer'
import HouseProvider from './context/HouseContext';
import HouseDetails from './components/PropertyDetails/HouseDetails';
import NewLogin from './pages/login/NewLogin';
import NewRegister from './pages/register/NewRegister';
import Features from './pages/common/Features'
import AboutUs from './pages/common/AboutUs'
import Contact from './pages/common/Contact'
import Dashboard from './pages/common/dashboard/Dashboard';
import UserManagement from './pages/admin/userManagement/UserManagement';
import RoleManagement from './pages/admin/roleManagement/RoleManagement';
import DocumentTypeManagement from './pages/admin/documentTypeManagement/DocumentTypeManagement';
import DocumentManagement from './pages/admin/documentManagement/DocumentManagement';
import Reports from './pages/admin/Reports';
import Leads from './pages/lead/Leads';
import LeadStatus from './pages/lead/LeadStatus';
import LeadFollowUp from './pages/lead/LeadFollowUp';
import CustomerProfiles from './pages/customers/CustomerProfiles';
import CustomerDocuments from './pages/customers/Documents';
import CustomerDocumentTypeManagement from './pages/customers/DocumentTypeManagement';
import MeetingScheduler from './pages/customers/MeetingScheduler';
import Inventory from './pages/bookings/Inventory';
import BookedUnits from './pages/bookings/BookedUnits';
import PaymentStatus from './pages/bookings/PaymentStatus';
import Installments from './pages/payments/Installments';
import PaymentHistory from './pages/payments/PaymentHistory';
import DuePayments from './pages/payments/DuePayments';
import Referrals from './pages/postSale/Referrals';
import Rewards from './pages/postSale/Rewards';
import Points from './pages/postSale/Points';
import MyBookings from './pages/client/MyBookings';
import MyMeetings from './pages/client/MyMeetings';
import ClientDocuments from './pages/client/Documents';
import ClientPayments from './pages/client/Payments';
import ClientReferrals from './pages/client/Referrals';
import PropertyMaster from './pages/property/propertyMaster/PropertyMaster';
import PropertyTypes from './pages/property/propertyTypes/PropertyTypes';
import Properties from './pages/displayproperties/Properties';
import FavoriteProperties from './pages/displayproperties/FavoriteProperties';
import PropertyMasterDisplay from './pages/displayproperties/PropertyMasterDisplay';
import DashboardLayout from './components/navigation/DashboardLayout';
import Settings from './pages/Settings';

// Sales Management Components
import SalesList from './pages/admin/sales/SalesList';
import AddPayment from './pages/admin/sales/AddPayment';
import PendingPayments from './pages/admin/sales/PendingPayments';
import SalesReports from './pages/admin/sales/SalesReports';
import ThemeDemo from './pages/ThemeDemo';

// Newly Created Pages
import RentRoll from './pages/rent/RentRoll';
import LeaseManagement from './pages/rent/LeaseManagement';
import ExpenseTracking from './pages/admin/accounting/ExpenseTracking';
import IncomeStatement from './pages/admin/accounting/IncomeStatement';
import UserProfile from './pages/profile/UserProfile';
import ReferenceSource from './pages/lead/ReferenceSource';
import Banner from './components/Banner';
import TopDevelopers from './components/TopDevelopers';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

const AuthLayout = ({ children }) => {
  return <div className="min-h-screen">{children}</div>;
};

const App = () => {
  return (
    <AppProvider>
      <NetworkStatusProvider>
        <HouseProvider>
          <OfflineIndicator />
          <ScrollToTop />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
          <Routes>
            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <NewLogin />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <NewRegister />
                </AuthLayout>
              }
            />

            {/* Main Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/features" element={<MainLayout><Features /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/property-details" element={<MainLayout><PropertyDetails /></MainLayout>} />
            
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              
            {/* Admin Routes */}
            <Route path='/admin/user-management' element={<DashboardLayout><UserManagement /></DashboardLayout>} />
            <Route path='/admin/role-management' element={<DashboardLayout><RoleManagement /></DashboardLayout>} />
            <Route path='/admin/document-type-management' element={<DashboardLayout><DocumentTypeManagement /></DashboardLayout>} />
            <Route path='/admin/document-management' element={<DashboardLayout><DocumentManagement /></DashboardLayout>} />
            <Route path='/admin/reports' element={<DashboardLayout><Reports /></DashboardLayout>} />
            
            {/* Property Routes */}
            <Route path='/property/property-master' element={<DashboardLayout><PropertyMaster /></DashboardLayout>} />
            <Route path='/property/property-types' element={<DashboardLayout><PropertyTypes /></DashboardLayout>} />
            
            {/* Display Properties Routes */}
            <Route path='/properties' element={<DashboardLayout><Properties /></DashboardLayout>} />
            <Route path='/properties/favorite-properties' element={<DashboardLayout><FavoriteProperties /></DashboardLayout>} />
            <Route path='/property/favorite-properties' element={<DashboardLayout><FavoriteProperties /></DashboardLayout>} />
            <Route path='/property-master-display' element={<DashboardLayout><PropertyMasterDisplay /></DashboardLayout>} />
            
            {/* Lead Management Routes */}
            <Route path='/lead/leads' element={<DashboardLayout><Leads /></DashboardLayout>} />
            <Route path='/lead/status' element={<DashboardLayout><LeadStatus /></DashboardLayout>} />
            <Route path='/lead/follow-up' element={<DashboardLayout><LeadFollowUp /></DashboardLayout>} />
            <Route path='/lead/reference-source' element={<DashboardLayout><ReferenceSource /></DashboardLayout>} />
            
            {/* Customer Management Routes */}
            <Route path='/customers/profiles' element={<DashboardLayout><CustomerProfiles /></DashboardLayout>} />
            <Route path='/customers/documents' element={<DashboardLayout><CustomerDocuments /></DashboardLayout>} />
            <Route path='/customers/document-types' element={<DashboardLayout><CustomerDocumentTypeManagement /></DashboardLayout>} />
            <Route path='/customers/meeting-scheduler' element={<DashboardLayout><MeetingScheduler /></DashboardLayout>} />
            
            {/* Sales Management Routes */}
            <Route path='/sales/sales-list' element={<DashboardLayout><SalesList /></DashboardLayout>} />
            <Route path='/sales/add-payment' element={<DashboardLayout><AddPayment /></DashboardLayout>} />
            <Route path='/sales/pending-payments' element={<DashboardLayout><PendingPayments /></DashboardLayout>} />
            <Route path='/sales/sales-reports' element={<DashboardLayout><SalesReports /></DashboardLayout>} />
            
            {/* Bookings Routes */}
            <Route path='/bookings/inventory' element={<DashboardLayout><Inventory /></DashboardLayout>} />
            <Route path='/bookings/booked-units' element={<DashboardLayout><BookedUnits /></DashboardLayout>} />
            <Route path='/bookings/payment-status' element={<DashboardLayout><PaymentStatus /></DashboardLayout>} />
            
            {/* Payments Routes */}
            <Route path='/payments/installments' element={<DashboardLayout><Installments /></DashboardLayout>} />
            <Route path='/payments/payment-history' element={<DashboardLayout><PaymentHistory /></DashboardLayout>} />
            <Route path='/payments/due-payments' element={<DashboardLayout><DuePayments /></DashboardLayout>} />
            
            {/* Rent Management Routes */}
            <Route path='/rent/rent-roll' element={<DashboardLayout><RentRoll /></DashboardLayout>} />
            <Route path='/rent/lease-management' element={<DashboardLayout><LeaseManagement /></DashboardLayout>} />

            {/* Accounting Routes */}
            <Route path='/accounting/expense-tracking' element={<DashboardLayout><ExpenseTracking /></DashboardLayout>} />
            <Route path='/accounting/income-statement' element={<DashboardLayout><IncomeStatement /></DashboardLayout>} />
            
            {/* Post-Sale Routes */}
            <Route path='/post-sale/referrals' element={<DashboardLayout><Referrals /></DashboardLayout>} />
            <Route path='/post-sale/rewards' element={<DashboardLayout><Rewards /></DashboardLayout>} />
            <Route path='/post-sale/points' element={<DashboardLayout><Points /></DashboardLayout>} />
            
            {/* Client Portal Routes */}
            <Route path='/client/my-bookings' element={<DashboardLayout><MyBookings /></DashboardLayout>} />
            <Route path='/client/my-meetings' element={<DashboardLayout><MyMeetings /></DashboardLayout>} />
            <Route path='/client/documents' element={<DashboardLayout><ClientDocuments /></DashboardLayout>} />
            <Route path='/client/payments' element={<DashboardLayout><ClientPayments /></DashboardLayout>} />
            <Route path='/client/referrals' element={<DashboardLayout><ClientReferrals /></DashboardLayout>} />
            
            {/* Settings Route */}
            <Route path='/settings' element={<DashboardLayout><Settings /></DashboardLayout>} />
            
            {/* Profile Route */}
            <Route path='/profile' element={<DashboardLayout><UserProfile /></DashboardLayout>} />

            {/* Theme Demo Route */}
            <Route path='/theme-demo' element={<DashboardLayout><ThemeDemo /></DashboardLayout>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HouseProvider>
      </NetworkStatusProvider>
    </AppProvider>
  );
};

export default App;