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
import Leads from '../pages/lead/Leads';
import CustomerProfiles from '../pages/customers/CustomerProfiles';
import CustomerDocuments from '../pages/customers/Documents';
import CustomerDocumentTypeManagement from '../pages/customers/DocumentTypeManagement';

import MeetingStatusManagement from '../pages/admin/meetingStatusManagement/MeetingStatusManagement';
import Inventory from '../pages/bookings/Inventory';
import BookedUnits from '../pages/bookings/BookedUnits';
import PaymentStatus from '../pages/bookings/PaymentStatus';
import AllPaymentHistory from '../pages/payments/AllPaymentHistory';
import AssignedPaymentHistory from '../pages/payments/AssignedPaymentHistory';
import MyPaymentHistory from '../pages/payments/MyPaymentHistory';
import PurchaseBookingManagement from '../pages/bookings/PurchaseBookingManagement';
import RentalBookingManagement from '../pages/bookings/RentalBookingManagement';
import AllPurchaseBookings from '../pages/bookings/AllPurchaseBookings';
import MyAssignedBookings from '../pages/bookings/MyAssignedBookings';
import CreateNewPurchase from '../pages/bookings/CreateNewPurchase';
import EditPurchaseBooking from '../pages/bookings/EditPurchaseBooking';
import PendingInstallments from '../pages/bookings/PendingInstallments';
import OverdueInstallments from '../pages/bookings/OverdueInstallments';
import AllRentalBookings from '../pages/bookings/AllRentalBookings';
import MyAssignedRentals from '../pages/bookings/MyAssignedRentals';
import CreateNewRental from '../pages/bookings/CreateNewRental';
import PendingRents from '../pages/bookings/PendingRents';
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

import UserProfile from '../pages/profile/UserProfile';
import Settings from '../pages/Settings';
import ReferenceSource from '../pages/lead/ReferenceSource';
import AdminMeetings from '../pages/admin/AdminMeetings';
import SalesMeetings from '../pages/sales/SalesMeetings';

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
  { name: 'leads', path: '/leads', component: Leads, permissions: 'public' },
  { name: 'leadAdd', path: '/lead/add', component: AddLead, permissions: 'public' },
  { name: 'leadView', path: '/lead/view', component: ViewLeads, permissions: 'public' },
  { name: 'leadQualification', path: '/lead/qualification', component: LeadQualification, permissions: 'public' },
  { name: 'referenceSource', path: '/lead/reference-source', component: ReferenceSource, permissions: 'public' },

  // Customers
  { name: 'customerProfiles', path: '/customers/profiles', component: CustomerProfiles, permissions: 'public' },
  { name: 'customerDocuments', path: '/customers/documents', component: CustomerDocuments, permissions: 'public' },
  { name: 'customerDocumentTypes', path: '/customers/document-types', component: CustomerDocumentTypeManagement, permissions: 'public' },


  // Sales
  { name: 'salesList', path: '/sales/sales-list', component: SalesList, permissions: 'public' },
  { name: 'salesAddPayment', path: '/sales/add-payment', component: AddPayment, permissions: 'public' },
  { name: 'salesPendingPayments', path: '/sales/pending-payments', component: PendingPayments, permissions: 'public' },
  { name: 'salesReports', path: '/sales/sales-reports', component: SalesReports, permissions: 'public' },

  // Bookings
  { name: 'bookingsInventory', path: '/bookings/inventory', component: Inventory, permissions: 'public' },
  { name: 'bookingsBookedUnits', path: '/bookings/booked-units', component: BookedUnits, permissions: 'public' },
  { name: 'bookingsPaymentStatus', path: '/bookings/payment-status', component: PaymentStatus, permissions: 'public' },
  { name: 'bookingsPurchaseManagement', path: '/bookings/purchase-management', component: PurchaseBookingManagement, permissions: 'public' },
  { name: 'bookingsRentalManagement', path: '/bookings/rental-management', component: RentalBookingManagement, permissions: 'public' },
  
  // Purchase Bookings
  { name: 'purchaseAllBookings', path: '/purchase-bookings/all', component: AllPurchaseBookings, permissions: 'public' },
  { name: 'purchaseMyBookings', path: '/purchase-bookings/my-assigned', component: MyAssignedBookings, permissions: 'public' },
  { name: 'purchaseCreateNew', path: '/purchase-bookings/create', component: CreateNewPurchase, permissions: 'public' },
  { name: 'purchaseEdit', path: '/purchase-bookings/edit/:id', component: EditPurchaseBooking, permissions: 'public' },
  { name: 'purchasePendingInstallments', path: '/purchase-bookings/pending-installments', component: PendingInstallments, permissions: 'public' },
  { name: 'purchaseOverdueInstallments', path: '/purchase-bookings/overdue-installments', component: OverdueInstallments, permissions: 'public' },
  
  // Rental Bookings
  { name: 'rentalAllBookings', path: '/rental-bookings/all', component: AllRentalBookings, permissions: 'public' },
  { name: 'rentalMyRentals', path: '/rental-bookings/my-assigned', component: MyAssignedRentals, permissions: 'public' },
  { name: 'rentalCreateNew', path: '/rental-bookings/create', component: CreateNewRental, permissions: 'public' },
  { name: 'rentalPendingRents', path: '/rental-bookings/pending-rents', component: PendingRents, permissions: 'public' },

  // Payment History
  { name: 'paymentHistoryAll', path: '/payment-history/all', component: AllPaymentHistory, permissions: 'public' },
  { name: 'paymentHistoryAssigned', path: '/payment-history/assigned', component: AssignedPaymentHistory, permissions: 'public' },
  { name: 'paymentHistoryMy', path: '/payment-history/my', component: MyPaymentHistory, permissions: 'public' },

  // Rent
  { name: 'rentRoll', path: '/rent/rent-roll', component: RentRoll, permissions: 'public' },
  { name: 'leaseManagement', path: '/rent/lease-management', component: LeaseManagement, permissions: 'public' },



  // Post-Sale
  { name: 'postSaleReferrals', path: '/post-sale/referrals', component: Referrals, permissions: 'public' },
  { name: 'postSaleRewards', path: '/post-sale/rewards', component: Rewards, permissions: 'public' },
  { name: 'postSalePoints', path: '/post-sale/points', component: Points, permissions: 'public' },

  // Schedule Meetings Routes
  { name: 'adminMeetings', path: '/admin-meetings', component: AdminMeetings, permissions: 'admin' },
  { name: 'salesMeetings', path: '/sales-meetings', component: SalesMeetings, permissions: 'sales,executive' },
  { name: 'myMeetings', path: '/my-meetings', component: MyMeetings, permissions: 'public' },

  // My Meetings (Standalone)
  { name: 'myMeetings', path: '/my-meetings', component: MyMeetings, permissions: 'public' },

  // Client
  { name: 'clientMyBookings', path: '/client/my-bookings', component: MyBookings, permissions: 'public' },
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