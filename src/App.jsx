import './App.css'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
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
import ExecutiveDashboard from './pages/common/dashboard/ExecutiveDashboard';
import SalesDashboard from './pages/common/dashboard/SalesDashboard';
import UserDashboard from './pages/common/dashboard/UserDashboard';
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

import AllPaymentHistory from './pages/payments/AllPaymentHistory';
import AssignedPaymentHistory from './pages/payments/AssignedPaymentHistory';
import MyPaymentHistory from './pages/payments/MyPaymentHistory';
import PurchaseBookingManagement from './pages/bookings/PurchaseBookingManagement';
import RentalBookingManagement from './pages/bookings/RentalBookingManagement';

// Purchase Booking Components
import AllPurchaseBookings from './pages/bookings/AllPurchaseBookings';
import MyAssignedBookings from './pages/bookings/MyAssignedBookings';
import MyPurchaseBookings from './pages/bookings/MyPurchaseBookings';
import CreateNewPurchase from './pages/bookings/CreateNewPurchase';
import EditPurchaseBooking from './pages/bookings/EditPurchaseBooking';
import PendingInstallments from './pages/bookings/PendingInstallments';
import OverdueInstallments from './pages/bookings/OverdueInstallments';

// Rental Booking Components
import AllRentalBookings from './pages/bookings/AllRentalBookings';
import MyAssignedRentals from './pages/bookings/MyAssignedRentals';
import MyRentalBookings from './pages/bookings/MyRentalBookings';
import CreateNewRental from './pages/bookings/CreateNewRental';
import PendingRents from './pages/bookings/PendingRents';

import UserProfile from './pages/profile/UserProfile';
import ReferenceSource from './pages/lead/ReferenceSource';
import Banner from './components/Banner';
import TopDevelopers from './components/TopDevelopers';
import Unauthorized from './pages/common/Unauthorized';

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
            
            {/* Dashboard Routes */}
            <Route path={ROUTES.DASHBOARD} element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/executive-dashboard" element={<ProtectedRoute><DashboardLayout><ExecutiveDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/sales-dashboard" element={<ProtectedRoute><DashboardLayout><SalesDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/user-dashboard" element={<ProtectedRoute><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
              
            {/* Admin Routes */}
            <Route path={ROUTES.ADMIN_USER_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><UserManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_ROLE_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><RoleManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_DOCUMENT_TYPE_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><DocumentTypeManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_DOCUMENT_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><DocumentManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_MEETING_STATUS_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><MeetingStatusManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_REPORTS} element={<ProtectedRoute><DashboardLayout><Reports /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_SALESPERSON_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><SalespersonManagement /></DashboardLayout></ProtectedRoute>} />
            
            {/* Property Routes */}
            <Route path={ROUTES.PROPERTY_MASTER} element={<ProtectedRoute><DashboardLayout><PropertyMaster /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PROPERTY_TYPES} element={<ProtectedRoute><DashboardLayout><PropertyTypes /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PROPERTY_FAVORITES} element={<ProtectedRoute><DashboardLayout><PropertyFavoriteProperties /></DashboardLayout></ProtectedRoute>} />
            
            {/* Display Properties Routes - Public access */}
            <Route path={ROUTES.PROPERTIES}element={<ProtectedRoute><DashboardLayout><PropertyMaster isViewOnly={true} /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.DISPLAY_FAVORITES} element={<ProtectedRoute><DashboardLayout><FavoriteProperties /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PROPERTY_MASTER_DISPLAY} element={<ProtectedRoute><DashboardLayout><PropertyMasterDisplay /></DashboardLayout></ProtectedRoute>} />
            
            {/* Lead Management Routes */}
            <Route path={ROUTES.LEAD_ADD} element={<ProtectedRoute><DashboardLayout><Leads /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.LEAD_VIEW} element={<ProtectedRoute><DashboardLayout><LeadStatus /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.LEAD_QUALIFICATION} element={<ProtectedRoute><DashboardLayout><LeadFollowUp /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.LEAD_REFERENCE_SOURCE} element={<ProtectedRoute><DashboardLayout><ReferenceSource /></DashboardLayout></ProtectedRoute>} />
            
            {/* Customer Management Routes */}
            <Route path={ROUTES.CUSTOMER_PROFILES} element={<ProtectedRoute><DashboardLayout><CustomerProfiles /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CUSTOMER_DOCUMENTS} element={<ProtectedRoute><DashboardLayout><CustomerDocuments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CUSTOMER_DOCUMENT_TYPES} element={<ProtectedRoute><DashboardLayout><CustomerDocumentTypeManagement /></DashboardLayout></ProtectedRoute>} />
    
            
            {/* Sales Management Routes */}
            <Route path={ROUTES.SALES_LIST} element={<ProtectedRoute><DashboardLayout><SalesList /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.SALES_ADD_PAYMENT} element={<ProtectedRoute><DashboardLayout><AddPayment /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.SALES_PENDING_PAYMENTS} element={<ProtectedRoute><DashboardLayout><PendingPayments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.SALES_REPORTS} element={<ProtectedRoute><DashboardLayout><SalesReports /></DashboardLayout></ProtectedRoute>} />
            
            {/* Bookings Routes */}
            <Route path={ROUTES.BOOKINGS_INVENTORY} element={<ProtectedRoute><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.BOOKINGS_BOOKED_UNITS} element={<ProtectedRoute><DashboardLayout><BookedUnits /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.BOOKINGS_PAYMENT_STATUS} element={<ProtectedRoute><DashboardLayout><PaymentStatus /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.BOOKINGS_PURCHASE_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><PurchaseBookingManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.BOOKINGS_RENTAL_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><RentalBookingManagement /></DashboardLayout></ProtectedRoute>} />
            
            {/* Purchase Bookings Routes */}
            <Route path={ROUTES.PURCHASE_ALL_BOOKINGS} element={<ProtectedRoute><DashboardLayout><AllPurchaseBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_MY_BOOKINGS} element={<ProtectedRoute><DashboardLayout><MyAssignedBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_MY_BOOKINGS_VIEW} element={<ProtectedRoute><DashboardLayout><MyPurchaseBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_CREATE_NEW} element={<ProtectedRoute><DashboardLayout><CreateNewPurchase /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_EDIT} element={<ProtectedRoute><DashboardLayout><EditPurchaseBooking /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_PENDING_INSTALLMENTS} element={<ProtectedRoute><DashboardLayout><PendingInstallments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_OVERDUE_INSTALLMENTS} element={<ProtectedRoute><DashboardLayout><OverdueInstallments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PURCHASE_INSTALLMENT_SCHEDULE} element={<ProtectedRoute><DashboardLayout><PendingInstallments /></DashboardLayout></ProtectedRoute>} />
            
            {/* Rental Bookings Routes */}
            <Route path={ROUTES.RENTAL_ALL_BOOKINGS} element={<ProtectedRoute><DashboardLayout><AllRentalBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_MY_RENTALS} element={<ProtectedRoute><DashboardLayout><MyAssignedRentals /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_MY_BOOKINGS_VIEW} element={<ProtectedRoute><DashboardLayout><MyRentalBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_CREATE_NEW} element={<ProtectedRoute><DashboardLayout><CreateNewRental /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_PENDING_RENTS} element={<ProtectedRoute><DashboardLayout><PendingRents /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_RENT_SCHEDULE} element={<ProtectedRoute><DashboardLayout><RentRoll /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENTAL_OVERDUE_RENTS} element={<ProtectedRoute><DashboardLayout><RentRoll /></DashboardLayout></ProtectedRoute>} />
            
            {/* Payments Routes */}
            <Route path={ROUTES.PAYMENT_HISTORY_ALL} element={<ProtectedRoute><DashboardLayout><AllPaymentHistory /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PAYMENT_HISTORY_ASSIGNED} element={<ProtectedRoute><DashboardLayout><AssignedPaymentHistory /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.PAYMENT_HISTORY_MY} element={<ProtectedRoute><DashboardLayout><MyPaymentHistory /></DashboardLayout></ProtectedRoute>} />
            
            {/* Rent Management Routes */}
            <Route path={ROUTES.RENT_ROLL} element={<ProtectedRoute><DashboardLayout><RentRoll /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.LEASE_MANAGEMENT} element={<ProtectedRoute><DashboardLayout><LeaseManagement /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENT_SCHEDULE} element={<ProtectedRoute><DashboardLayout><RentRoll /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.RENT_OVERDUE_RENTS} element={<ProtectedRoute><DashboardLayout><RentRoll /></DashboardLayout></ProtectedRoute>} />


            
            {/* Post-Sale Routes */}
            <Route path={ROUTES.POST_SALE_REFERRALS} element={<ProtectedRoute><DashboardLayout><Referrals /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.POST_SALE_REWARDS} element={<ProtectedRoute><DashboardLayout><Rewards /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.POST_SALE_POINTS} element={<ProtectedRoute><DashboardLayout><Points /></DashboardLayout></ProtectedRoute>} />
            
            {/* Schedule Meetings Routes */}
            <Route path={ROUTES.ADMIN_MEETINGS} element={<ProtectedRoute><DashboardLayout><AdminMeetings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.SALES_MEETINGS} element={<ProtectedRoute><DashboardLayout><SalesMeetings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.MY_MEETINGS} element={<ProtectedRoute><DashboardLayout><MyMeetings /></DashboardLayout></ProtectedRoute>} />
            
            {/* Client Portal Routes */}
            <Route path={ROUTES.CLIENT_MY_BOOKINGS} element={<ProtectedRoute><DashboardLayout><MyBookings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CLIENT_MY_MEETINGS} element={<ProtectedRoute><DashboardLayout><MyMeetings /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CLIENT_DOCUMENTS} element={<ProtectedRoute><DashboardLayout><ClientDocuments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CLIENT_PAYMENTS} element={<ProtectedRoute><DashboardLayout><ClientPayments /></DashboardLayout></ProtectedRoute>} />
            <Route path={ROUTES.CLIENT_REFERRALS} element={<ProtectedRoute><DashboardLayout><ClientReferrals /></DashboardLayout></ProtectedRoute>} />
            
            {/* Settings Route */}
            <Route path={ROUTES.SETTINGS} element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            
            {/* Profile Route */}
            <Route path={ROUTES.PROFILE} element={<ProtectedRoute><DashboardLayout><UserProfile /></DashboardLayout></ProtectedRoute>} />

            {/* Theme Demo Route */}
            <Route path={ROUTES.THEME_DEMO} element={<DashboardLayout><ThemeDemo /></DashboardLayout>} />
            
            {/* Unauthorized Route */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HouseProvider>
      </NetworkStatusProvider>
    </AppProvider>
  );
};

export default App;