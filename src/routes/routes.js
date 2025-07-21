// Centralized route definitions for the app
// Each route has a name, path, component, and permissions (all public for now)

import Home from './Home';
import PropertyDetails from './PropertyDetails';
import NewLogin from '../pages/login/NewLogin';
import NewRegister from '../pages/register/NewRegister';
import Features from '../pages/common/Features';
import AboutUs from '../pages/common/AboutUs';
import Contact from '../pages/common/Contact';
import Dashboard from '../pages/common/dashboard/Dashboard';
import UserManagement from '../pages/admin/userManagement/UserManagement';
import RoleManagement from '../pages/admin/roleManagement/RoleManagement';
import DocumentTypeManagement from '../pages/admin/documentTypeManagement/DocumentTypeManagement';
import DocumentManagement from '../pages/admin/documentManagement/DocumentManagement';
import Reports from '../pages/admin/Reports';
import LeadManagement from '../pages/lead/LeadManagement';
import AddLead from '../pages/lead/AddLead';
import ViewLeads from '../pages/lead/ViewLeads';
import LeadQualification from '../pages/lead/LeadQualification';
import CustomerProfiles from '../pages/customers/CustomerProfiles';
import CustomerDocuments from '../pages/customers/Documents';
import CustomerDocumentTypeManagement from '../pages/customers/DocumentTypeManagement';
import MeetingScheduler from '../pages/customers/MeetingScheduler';
import MeetingStatusManagement from '../pages/admin/meetingStatusManagement/MeetingStatusManagement';
import Inventory from '../pages/bookings/Inventory';
import BookedUnits from '../pages/bookings/BookedUnits';
import PaymentStatus from '../pages/bookings/PaymentStatus';
import Installments from '../pages/payments/Installments';
import PaymentHistory from '../pages/payments/PaymentHistory';
import DuePayments from '../pages/payments/DuePayments';
import Referrals from '../pages/postSale/Referrals';
import Rewards from '../pages/postSale/Rewards';
import Points from '../pages/postSale/Points';
import MyBookings from '../pages/client/MyBookings';
import MyMeetings from '../pages/client/MyMeetings';
import ClientDocuments from '../pages/client/Documents';
import ClientPayments from '../pages/client/Payments';
import ClientReferrals from '../pages/client/Referrals';
import PropertyMaster from '../pages/property/propertyMaster/PropertyMaster';
import PropertyTypes from '../pages/property/propertyTypes/PropertyTypes';
import Properties from '../pages/displayproperties/Properties';
import FavoriteProperties from '../pages/displayproperties/FavoriteProperties';
import PropertyMasterDisplay from '../pages/displayproperties/PropertyMasterDisplay';
import SalesList from '../pages/admin/sales/SalesList';
import AddPayment from '../pages/admin/sales/AddPayment';
import PendingPayments from '../pages/admin/sales/PendingPayments';
import SalesReports from '../pages/admin/sales/SalesReports';
import ThemeDemo from '../pages/ThemeDemo';
import RentRoll from '../pages/rent/RentRoll';
import LeaseManagement from '../pages/rent/LeaseManagement';
import ExpenseTracking from '../pages/admin/accounting/ExpenseTracking';
import IncomeStatement from '../pages/admin/accounting/IncomeStatement';
import UserProfile from '../pages/profile/UserProfile';
import Settings from '../pages/Settings';
import ReferenceSource from '../pages/lead/ReferenceSource';

export const ROUTES = [
  // Auth
  { name: 'login', path: '/login', component: NewLogin, permissions: 'public' },
  { name: 'register', path: '/register', component: NewRegister, permissions: 'public' },

  // Main
  { name: 'home', path: '/', component: Home, permissions: 'public' },
  { name: 'features', path: '/features', component: Features, permissions: 'public' },
  { name: 'about', path: '/about', component: AboutUs, permissions: 'public' },
  { name: 'contact', path: '/contact', component: Contact, permissions: 'public' },
  { name: 'propertyDetails', path: '/property-details', component: PropertyDetails, permissions: 'public' },

  // Dashboard
  { name: 'dashboard', path: '/dashboard', component: Dashboard, permissions: 'public' },

  // Admin
  { name: 'adminUserManagement', path: '/admin/user-management', component: UserManagement, permissions: 'public' },
  { name: 'adminRoleManagement', path: '/admin/role-management', component: RoleManagement, permissions: 'public' },
  { name: 'adminDocumentTypeManagement', path: '/admin/document-type-management', component: DocumentTypeManagement, permissions: 'public' },
  { name: 'adminDocumentManagement', path: '/admin/document-management', component: DocumentManagement, permissions: 'public' },
  { name: 'adminReports', path: '/admin/reports', component: Reports, permissions: 'public' },
  { name: 'adminMeetingStatusManagement', path: '/admin/meeting-status-management', component: MeetingStatusManagement, permissions: 'public' },

  // Property
  { name: 'propertyMaster', path: '/property/property-master', component: PropertyMaster, permissions: 'public' },
  { name: 'propertyTypes', path: '/property/property-types', component: PropertyTypes, permissions: 'public' },
  
  // Display Properties
  { name: 'properties', path: '/properties', component: Properties, permissions: 'public' },
  { name: 'displayFavoriteProperties', path: '/properties/favorite-properties', component: FavoriteProperties, permissions: 'public' },
  { name: 'propertyFavoriteProperties', path: '/property/favorite-properties', component: FavoriteProperties, permissions: 'public' },
  { name: 'propertyMasterDisplay', path: '/property-master-display', component: PropertyMasterDisplay, permissions: 'public' },

  // Lead
  { name: 'leadAdd', path: '/lead/add', component: AddLead, permissions: 'public' },
  { name: 'leadView', path: '/lead/view', component: ViewLeads, permissions: 'public' },
  { name: 'leadQualification', path: '/lead/qualification', component: LeadQualification, permissions: 'public' },
  { name: 'referenceSource', path: '/lead/reference-source', component: ReferenceSource, permissions: 'public' },

  // Customers
  { name: 'customerProfiles', path: '/customers/profiles', component: CustomerProfiles, permissions: 'public' },
  { name: 'customerDocuments', path: '/customers/documents', component: CustomerDocuments, permissions: 'public' },
  { name: 'customerDocumentTypes', path: '/customers/document-types', component: CustomerDocumentTypeManagement, permissions: 'public' },
  { name: 'customerMeetingScheduler', path: '/customers/meeting-scheduler', component: MeetingScheduler, permissions: 'public' },

  // Sales
  { name: 'salesList', path: '/sales/sales-list', component: SalesList, permissions: 'public' },
  { name: 'salesAddPayment', path: '/sales/add-payment', component: AddPayment, permissions: 'public' },
  { name: 'salesPendingPayments', path: '/sales/pending-payments', component: PendingPayments, permissions: 'public' },
  { name: 'salesReports', path: '/sales/sales-reports', component: SalesReports, permissions: 'public' },

  // Bookings
  { name: 'bookingsInventory', path: '/bookings/inventory', component: Inventory, permissions: 'public' },
  { name: 'bookingsBookedUnits', path: '/bookings/booked-units', component: BookedUnits, permissions: 'public' },
  { name: 'bookingsPaymentStatus', path: '/bookings/payment-status', component: PaymentStatus, permissions: 'public' },

  // Payments
  { name: 'paymentsInstallments', path: '/payments/installments', component: Installments, permissions: 'public' },
  { name: 'paymentsHistory', path: '/payments/payment-history', component: PaymentHistory, permissions: 'public' },
  { name: 'paymentsDue', path: '/payments/due-payments', component: DuePayments, permissions: 'public' },

  // Rent
  { name: 'rentRoll', path: '/rent/rent-roll', component: RentRoll, permissions: 'public' },
  { name: 'leaseManagement', path: '/rent/lease-management', component: LeaseManagement, permissions: 'public' },

  // Accounting
  { name: 'accountingExpenseTracking', path: '/accounting/expense-tracking', component: ExpenseTracking, permissions: 'public' },
  { name: 'accountingIncomeStatement', path: '/accounting/income-statement', component: IncomeStatement, permissions: 'public' },

  // Post-Sale
  { name: 'postSaleReferrals', path: '/post-sale/referrals', component: Referrals, permissions: 'public' },
  { name: 'postSaleRewards', path: '/post-sale/rewards', component: Rewards, permissions: 'public' },
  { name: 'postSalePoints', path: '/post-sale/points', component: Points, permissions: 'public' },

  // Client
  { name: 'clientMyBookings', path: '/client/my-bookings', component: MyBookings, permissions: 'public' },
  { name: 'clientMyMeetings', path: '/client/my-meetings', component: MyMeetings, permissions: 'public' },
  { name: 'clientDocuments', path: '/client/documents', component: ClientDocuments, permissions: 'public' },
  { name: 'clientPayments', path: '/client/payments', component: ClientPayments, permissions: 'public' },
  { name: 'clientReferrals', path: '/client/referrals', component: ClientReferrals, permissions: 'public' },

  // Settings
  { name: 'settings', path: '/settings', component: Settings, permissions: 'public' },

  // Profile
  { name: 'profile', path: '/profile', component: UserProfile, permissions: 'public' },

  // Theme Demo
  { name: 'themeDemo', path: '/theme-demo', component: ThemeDemo, permissions: 'public' },
]; 