# Sales Management Module

A comprehensive sales, accounts, and reports module for the Inhabit Realties real estate management application.

## Overview

The Sales Management module provides complete functionality for tracking property sales, managing payments, monitoring pending installments, and generating detailed financial reports.

## Features

### 1. Sales List
- Property sales overview with key information
- Payment history viewing
- Search and filtering capabilities
- Status-based filtering

### 2. Add Payment
- Payment form for new transactions
- Property and buyer selection
- Multiple payment modes
- Validation and error handling

### 3. Pending Payments
- Due payments tracking
- Reminder functionality
- Bulk operations
- Status-based filtering

### 4. Sales Reports
- Financial analytics dashboard
- Interactive charts
- Export functionality
- Time period selection

## Components

- `SalesList.jsx` - Main sales listing
- `ViewPaymentsModal.jsx` - Payment history modal
- `AddPayment.jsx` - Payment form
- `PendingPayments.jsx` - Pending payments management
- `SalesReports.jsx` - Reports dashboard

## API Integration

Comprehensive service layer with endpoints for:
- Sales management
- Payment processing
- Reports generation
- Data export

## Installation

```bash
npm install recharts
```

## Usage

The module is integrated into the main navigation and accessible via:
- Sales List: `/sales/sales-list`
- Add Payment: `/sales/add-payment`
- Pending Payments: `/sales/pending-payments`
- Sales Reports: `/sales/sales-reports` 