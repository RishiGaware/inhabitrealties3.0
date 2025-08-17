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
import MeetingStatusManagement from './pages/admin/meetingStatusManagement/MeetingStatusManagement';
import Reports from './pages/admin/Reports';
import SalespersonManagement from './pages/admin/SalespersonManagement';
import Leads from './pages/lead/Leads';
import LeadStatus from './pages/lead/LeadStatus';
import LeadFollowUp from './pages/lead/LeadFollowUp';
import CustomerProfiles from './pages/customers/CustomerProfiles';
import CustomerDocuments from './pages/customers/Documents';
import CustomerDocumentTypeManagement from './pages/customers/DocumentTypeManagement';

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
import PropertyFavoriteProperties from './pages/property/PropertyFavoriteProperties';
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
import PaymentHistoryEnhanced from './pages/payments/PaymentHistoryEnhanced';
import PaymentReports from './pages/payments/PaymentReports';
import PaymentFiltering from './pages/payments/PaymentFiltering';
import PurchaseBookingManagement from './pages/bookings/PurchaseBookingManagement';
import RentalBookingManagement from './pages/bookings/RentalBookingManagement';

import UserProfile from './pages/profile/UserProfile';
import ReferenceSource from './pages/lead/ReferenceSource';
import Banner from './components/Banner';
import TopDevelopers from './components/TopDevelopers';

// Import route constants
import { ROUTES } from './utils/constants';
import AdminMeetings from './pages/admin/AdminMeetings';
import SalesMeetings from './pages/sales/SalesMeetings';

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
              path={ROUTES.LOGIN}
              element={
                <AuthLayout>
                  <NewLogin />
                </AuthLayout>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <AuthLayout>
                  <NewRegister />
                </AuthLayout>
              }
            />

            {/* Main Routes */}
            <Route path={ROUTES.HOME} element={<MainLayout><Home /></MainLayout>} />
            <Route path={ROUTES.FEATURES} element={<MainLayout><Features /></MainLayout>} />
            <Route path={ROUTES.ABOUT} element={<MainLayout><AboutUs /></MainLayout>} />
            <Route path={ROUTES.CONTACT} element={<MainLayout><Contact /></MainLayout>} />
            <Route path={ROUTES.PROPERTY_DETAILS} element={<MainLayout><PropertyDetails /></MainLayout>} />
            
            {/* Dashboard Route */}
            <Route path={ROUTES.DASHBOARD} element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              
            {/* Admin Routes */}
            <Route path={ROUTES.ADMIN_USER_MANAGEMENT} element={<DashboardLayout><UserManagement /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_ROLE_MANAGEMENT} element={<DashboardLayout><RoleManagement /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_DOCUMENT_TYPE_MANAGEMENT} element={<DashboardLayout><DocumentTypeManagement /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_DOCUMENT_MANAGEMENT} element={<DashboardLayout><DocumentManagement /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_MEETING_STATUS_MANAGEMENT} element={<DashboardLayout><MeetingStatusManagement /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_REPORTS} element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path={ROUTES.ADMIN_SALESPERSON_MANAGEMENT} element={<DashboardLayout><SalespersonManagement /></DashboardLayout>} />
            
            {/* Property Routes */}
            <Route path={ROUTES.PROPERTY_MASTER} element={<DashboardLayout><PropertyMaster /></DashboardLayout>} />
            <Route path={ROUTES.PROPERTY_TYPES} element={<DashboardLayout><PropertyTypes /></DashboardLayout>} />
            <Route path={ROUTES.PROPERTY_FAVORITES} element={<DashboardLayout><PropertyFavoriteProperties /></DashboardLayout>} />
            
            {/* Display Properties Routes */}
            <Route path={ROUTES.PROPERTIES} element={<DashboardLayout><Properties /></DashboardLayout>} />
            <Route path={ROUTES.DISPLAY_FAVORITES} element={<DashboardLayout><FavoriteProperties /></DashboardLayout>} />
            <Route path={ROUTES.PROPERTY_MASTER_DISPLAY} element={<DashboardLayout><PropertyMasterDisplay /></DashboardLayout>} />
            
            {/* Lead Management Routes */}
            <Route path={ROUTES.LEAD_ADD} element={<DashboardLayout><Leads /></DashboardLayout>} />
            <Route path={ROUTES.LEAD_VIEW} element={<DashboardLayout><LeadStatus /></DashboardLayout>} />
            <Route path={ROUTES.LEAD_QUALIFICATION} element={<DashboardLayout><LeadFollowUp /></DashboardLayout>} />
            <Route path={ROUTES.LEAD_REFERENCE_SOURCE} element={<DashboardLayout><ReferenceSource /></DashboardLayout>} />
            
            {/* Customer Management Routes */}
            <Route path={ROUTES.CUSTOMER_PROFILES} element={<DashboardLayout><CustomerProfiles /></DashboardLayout>} />
            <Route path={ROUTES.CUSTOMER_DOCUMENTS} element={<DashboardLayout><CustomerDocuments /></DashboardLayout>} />
            <Route path={ROUTES.CUSTOMER_DOCUMENT_TYPES} element={<DashboardLayout><CustomerDocumentTypeManagement /></DashboardLayout>} />
    
            
            {/* Sales Management Routes */}
            <Route path={ROUTES.SALES_LIST} element={<DashboardLayout><SalesList /></DashboardLayout>} />
            <Route path={ROUTES.SALES_ADD_PAYMENT} element={<DashboardLayout><AddPayment /></DashboardLayout>} />
            <Route path={ROUTES.SALES_PENDING_PAYMENTS} element={<DashboardLayout><PendingPayments /></DashboardLayout>} />
            <Route path={ROUTES.SALES_REPORTS} element={<DashboardLayout><SalesReports /></DashboardLayout>} />
            
            {/* Bookings Routes */}
            <Route path={ROUTES.BOOKINGS_INVENTORY} element={<DashboardLayout><Inventory /></DashboardLayout>} />
            <Route path={ROUTES.BOOKINGS_BOOKED_UNITS} element={<DashboardLayout><BookedUnits /></DashboardLayout>} />
            <Route path={ROUTES.BOOKINGS_PAYMENT_STATUS} element={<DashboardLayout><PaymentStatus /></DashboardLayout>} />
            <Route path={ROUTES.BOOKINGS_PURCHASE_MANAGEMENT} element={<DashboardLayout><PurchaseBookingManagement /></DashboardLayout>} />
            <Route path={ROUTES.BOOKINGS_RENTAL_MANAGEMENT} element={<DashboardLayout><RentalBookingManagement /></DashboardLayout>} />
            
            {/* Payments Routes */}
            <Route path={ROUTES.PAYMENTS_INSTALLMENTS} element={<DashboardLayout><Installments /></DashboardLayout>} />
            <Route path={ROUTES.PAYMENTS_HISTORY} element={<DashboardLayout><PaymentHistory /></DashboardLayout>} />
            <Route path={ROUTES.PAYMENTS_DUE} element={<DashboardLayout><DuePayments /></DashboardLayout>} />
            <Route path={ROUTES.PAYMENTS_HISTORY_ENHANCED} element={<DashboardLayout><PaymentHistoryEnhanced /></DashboardLayout>} />
            <Route path={ROUTES.PAYMENTS_REPORTS} element={<DashboardLayout><PaymentReports /></DashboardLayout>} />
            <Route path={ROUTES.PAYMENTS_FILTERING} element={<DashboardLayout><PaymentFiltering /></DashboardLayout>} />
            
            {/* Rent Management Routes */}
            <Route path={ROUTES.RENT_ROLL} element={<DashboardLayout><RentRoll /></DashboardLayout>} />
            <Route path={ROUTES.LEASE_MANAGEMENT} element={<DashboardLayout><LeaseManagement /></DashboardLayout>} />


            
            {/* Post-Sale Routes */}
            <Route path={ROUTES.POST_SALE_REFERRALS} element={<DashboardLayout><Referrals /></DashboardLayout>} />
            <Route path={ROUTES.POST_SALE_REWARDS} element={<DashboardLayout><Rewards /></DashboardLayout>} />
            <Route path={ROUTES.POST_SALE_POINTS} element={<DashboardLayout><Points /></DashboardLayout>} />
            
            {/* Schedule Meetings Routes */}
            <Route path={ROUTES.ADMIN_MEETINGS} element={<DashboardLayout><AdminMeetings /></DashboardLayout>} />
            <Route path={ROUTES.SALES_MEETINGS} element={<DashboardLayout><SalesMeetings /></DashboardLayout>} />
            <Route path={ROUTES.MY_MEETINGS} element={<DashboardLayout><MyMeetings /></DashboardLayout>} />
            
            {/* Client Portal Routes */}
            <Route path={ROUTES.CLIENT_MY_BOOKINGS} element={<DashboardLayout><MyBookings /></DashboardLayout>} />
            <Route path={ROUTES.CLIENT_DOCUMENTS} element={<DashboardLayout><ClientDocuments /></DashboardLayout>} />
            <Route path={ROUTES.CLIENT_PAYMENTS} element={<DashboardLayout><ClientPayments /></DashboardLayout>} />
            <Route path={ROUTES.CLIENT_REFERRALS} element={<DashboardLayout><ClientReferrals /></DashboardLayout>} />
            
            {/* Settings Route */}
            <Route path={ROUTES.SETTINGS} element={<DashboardLayout><Settings /></DashboardLayout>} />
            
            {/* Profile Route */}
            <Route path={ROUTES.PROFILE} element={<DashboardLayout><UserProfile /></DashboardLayout>} />

            {/* Theme Demo Route */}
            <Route path={ROUTES.THEME_DEMO} element={<DashboardLayout><ThemeDemo /></DashboardLayout>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HouseProvider>
      </NetworkStatusProvider>
    </AppProvider>
  );
};

export default App;