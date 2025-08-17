# Payment Management System

## Overview

This comprehensive payment management system provides complete control over property payments, purchase bookings, rental bookings, and financial reporting. The system handles all aspects of payment processing, from initial booking creation to final reconciliation.

## Features

### 🏠 **Purchase Booking Management**
- Create and manage property purchase bookings
- Handle installment schedules and payments
- Track down payments and financing details
- Manage bank loan information and EMI calculations
- Monitor payment status and overdue installments

### 🏢 **Rental Booking Management**
- Create and manage property rental agreements
- Track monthly rent payments and schedules
- Handle security deposits and maintenance charges
- Monitor rent due dates and late fees
- Record rent payment transactions

### 💰 **Payment History & Management**
- Comprehensive payment tracking and history
- Payment approval workflow
- Payment reconciliation system
- Advanced filtering and search capabilities
- Status management (Pending, Completed, Failed, Refunded)

### 📊 **Reports & Analytics**
- Payment summary reports
- Unreconciled payment tracking
- Pending and overdue installment reports
- Pending and overdue rent reports
- Export functionality for all reports
- Analytics dashboard with charts (placeholder)

## API Endpoints

### Payment History Management

#### Get All Payments
```
GET /api/payment-history/all
Headers: Authorization: Bearer <token>
Response: All payment records with populated references
```

#### Filter by Payment Type
```
GET /api/payment-history/type/:paymentType
Headers: Authorization: Bearer <token>
Response: Payments filtered by type (RENT, DOWN_PAYMENT, INSTALLMENT, etc.)
```

#### Filter by Status
```
GET /api/payment-history/status/:status
Headers: Authorization: Bearer <token>
Response: Payments filtered by status (PENDING, COMPLETED, FAILED, REFUNDED)
```

#### Filter by Date Range
```
POST /api/payment-history/date-range
Headers: Authorization: Bearer <token>
Payload: {
  startDate: "2024-01-01",
  endDate: "2024-12-31"
}
Response: Payments within date range
```

#### Get Payment Details
```
GET /api/payment-history/:id
Headers: Authorization: Bearer <token>
Response: Single payment record with full details
```

#### Update Payment
```
PUT /api/payment-history/update/:id
Headers: Authorization: Bearer <token>
Payload: {
  amount: 50000,
  totalAmount: 55000,
  paymentStatus: "COMPLETED",
  paymentNotes: "Payment received via bank transfer",
  remarks: "Customer paid on time"
}
Response: Updated payment record
```

#### Approve Payment
```
PUT /api/payment-history/approve/:id
Headers: Authorization: Bearer <token>
Payload: {
  paymentStatus: "COMPLETED",
  approvedByUserId: "user_id_here"
}
Response: Approved payment record
```

#### Reconcile Payment
```
PUT /api/payment-history/reconcile/:id
Headers: Authorization: Bearer <token>
Payload: {
  isReconciled: true,
  reconciliationDate: "2024-01-15T10:30:00Z"
}
Response: Reconciled payment record
```

### Purchase Booking Management

#### Get All Purchase Bookings
```
GET /api/purchase-booking/all
Headers: Authorization: Bearer <token>
Response: All purchase bookings with populated references
```

#### Create Purchase Booking
```
POST /api/purchase-booking/create
Headers: Authorization: Bearer <token>
Payload: {
  propertyId: "property_id_here",
  customerId: "customer_id_here",
  assignedSalespersonId: "salesperson_id_here",
  totalPropertyValue: 5000000,
  downPayment: 1000000,
  paymentTerms: "INSTALLMENTS",
  installmentCount: 24,
  isFinanced: true,
  bankName: "HDFC Bank",
  loanTenure: 240,
  interestRate: 8.5,
  emiAmount: 45000
}
Response: Created purchase booking with installment schedule
```

#### Get Installment Schedule
```
GET /api/purchase-booking/:id/installment-schedule
Headers: Authorization: Bearer <token>
Response: Complete installment schedule for the booking
```

#### Record Installment Payment
```
POST /api/purchase-booking/:id/record-installment
Headers: Authorization: Bearer <token>
Payload: {
  installmentNumber: 5,
  amount: 45000,
  paymentMode: "BANK_TRANSFER",
  paidDate: "2024-01-15T10:30:00Z",
  paymentNotes: "EMI payment for January 2024"
}
Response: Recorded installment payment
```

### Rental Booking Management

#### Get All Rental Bookings
```
GET /api/rental-booking/all
Headers: Authorization: Bearer <token>
Response: All rental bookings with populated references
```

#### Create Rental Booking
```
POST /api/rental-booking/create
Headers: Authorization: Bearer <token>
Payload: {
  propertyId: "property_id_here",
  customerId: "customer_id_here",
  assignedSalespersonId: "salesperson_id_here",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  monthlyRent: 25000,
  securityDeposit: 50000,
  maintenanceCharges: 2000,
  advanceRent: 2,
  rentDueDate: 5
}
Response: Created rental booking with rent schedule
```

#### Record Rent Payment
```
POST /api/rental-booking/:id/record-rent-payment
Headers: Authorization: Bearer <token>
Payload: {
  rentMonth: "2024-01",
  amount: 25000,
  paymentMode: "ONLINE",
  paidDate: "2024-01-05T10:30:00Z",
  paymentNotes: "Rent payment for January 2024"
}
Response: Recorded rent payment
```

### Reports & Analytics

#### Payment Summary Reports
```
GET /api/payment-history/reports/summary
Headers: Authorization: Bearer <token>
Response: Payment summary with totals and statistics
```

#### Unreconciled Payments
```
GET /api/payment-history/reports/unreconciled
Headers: Authorization: Bearer <token>
Response: All unreconciled payments
```

#### Pending Installments
```
GET /api/purchase-booking/reports/pending-installments
Headers: Authorization: Bearer <token>
Response: Pending installment payments with details
```

#### Overdue Installments
```
GET /api/purchase-booking/reports/overdue-installments
Headers: Authorization: Bearer <token>
Response: Overdue installment payments with late fees
```

#### Pending Rents
```
GET /api/rental-booking/reports/pending-rents
Headers: Authorization: Bearer <token>
Response: Pending rent payments with details
```

#### Overdue Rents
```
GET /api/rental-booking/reports/overdue-rents
Headers: Authorization: Bearer <token>
Response: Overdue rent payments with late fees
```

## Pages & Components

### 1. Enhanced Payment History (`/payments/payment-history-enhanced`)
- **Features:**
  - Comprehensive payment listing with advanced filters
  - Payment approval workflow
  - Payment reconciliation system
  - Status-based filtering (Completed, Pending, Failed, Refunded)
  - Payment type filtering (Rent, Down Payment, Installment)
  - Date range filtering
  - Search by customer, property, or transaction ID
  - Payment details modal with full information
  - Approval modal for pending payments
  - Reconciliation modal for completed payments

### 2. Purchase Booking Management (`/bookings/purchase-management`)
- **Features:**
  - Create new purchase bookings
  - Edit existing bookings
  - View installment schedules
  - Record installment payments
  - Track payment status
  - Manage financing details
  - Monitor overdue installments
  - Salesperson assignment tracking

### 3. Rental Booking Management (`/bookings/rental-management`)
- **Features:**
  - Create new rental agreements
  - Edit rental terms
  - Track monthly rent schedules
  - Record rent payments
  - Monitor due dates and late fees
  - Manage security deposits
  - Handle maintenance charges

### 4. Payment Reports & Analytics (`/payments/reports`)
- **Features:**
  - Payment summary statistics
  - Unreconciled payment tracking
  - Pending installment reports
  - Overdue installment reports
  - Pending rent reports
  - Overdue rent reports
  - Export functionality
  - Date range filtering
  - Analytics dashboard (placeholder for charts)

## Data Models

### Payment Record
```typescript
interface PaymentRecord {
  id: string;
  transactionId: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  amount: number;
  totalAmount: number;
  paymentType: 'RENT' | 'DOWN_PAYMENT' | 'INSTALLMENT';
  paymentMethod: 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'CHEQUE' | 'ONLINE';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentNotes?: string;
  remarks?: string;
  isReconciled: boolean;
  reconciliationDate?: string;
  approvedByUserId?: string;
  date: string;
  time: string;
  reference: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
}
```

### Purchase Booking
```typescript
interface PurchaseBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  totalPropertyValue: number;
  downPayment: number;
  paymentTerms: 'INSTALLMENTS' | 'FULL_PAYMENT';
  installmentCount: number;
  isFinanced: boolean;
  bankName?: string;
  loanTenure?: number;
  interestRate?: number;
  emiAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  installmentSchedule: InstallmentSchedule[];
}
```

### Rental Booking
```typescript
interface RentalBooking {
  id: string;
  propertyId: string;
  propertyName: string;
  customerId: string;
  customerName: string;
  assignedSalespersonId: string;
  assignedSalespersonName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges: number;
  advanceRent: number;
  rentDueDate: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  rentSchedule: RentSchedule[];
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Endpoints
Update the API base URL in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### 3. Add Routes
The new routes are automatically added to the routing system. Access the pages at:
- `/payments/payment-history-enhanced` - Enhanced Payment History
- `/bookings/purchase-management` - Purchase Booking Management
- `/bookings/rental-management` - Rental Booking Management
- `/payments/reports` - Payment Reports & Analytics

### 4. Configure Authentication
Ensure your authentication token is properly set in cookies as `AuthToken`.

## Usage Examples

### Creating a Purchase Booking
1. Navigate to `/bookings/purchase-management`
2. Click "Create Booking"
3. Fill in property and customer details
4. Set financial terms and installment count
5. Configure financing details if applicable
6. Submit to create the booking

### Recording an Installment Payment
1. In the purchase booking list, click the payment icon
2. Enter installment number and amount
3. Select payment mode and date
4. Add payment notes
5. Submit to record the payment

### Creating a Rental Agreement
1. Navigate to `/bookings/rental-management`
2. Click "Create Rental"
3. Set rental period and terms
4. Configure rent amount and deposits
5. Set rent due date
6. Submit to create the rental

### Recording Rent Payment
1. In the rental booking list, click the payment icon
2. Select rent month and amount
3. Choose payment mode and date
4. Add payment notes
5. Submit to record the payment

### Approving a Payment
1. Navigate to `/payments/payment-history-enhanced`
2. Find a pending payment
3. Click the approval icon
4. Set payment status and add notes
5. Submit to approve the payment

### Reconciling a Payment
1. Find a completed, unreconciled payment
2. Click the reconciliation icon
3. Add reconciliation notes
4. Submit to reconcile the payment

## Features in Development

### Analytics Dashboard
- Payment trend charts
- Monthly comparison graphs
- Performance metrics visualization
- Interactive data exploration

### Advanced Reporting
- Custom report builder
- Scheduled report generation
- Email report delivery
- PDF export functionality

### Workflow Automation
- Automatic payment reminders
- Late fee calculations
- Payment status updates
- Notification system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For technical support or questions about the payment management system, please refer to the project documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 