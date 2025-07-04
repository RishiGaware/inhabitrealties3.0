# Document Management System

This document describes the implementation of the Document Management System for the Real Estate application, which includes Document Type Management and Document Management features.

## Overview

The Document Management System consists of two main components:
1. **Document Type Management** - Admin interface for managing document types (e.g., Aadhar Card, PAN Card, etc.)
2. **Document Management** - Interface for managing actual customer documents

## Features

### Document Type Management
- ✅ Create, edit, and delete document types
- ✅ Configure allowed file extensions for each document type
- ✅ Set maximum file size limits
- ✅ Mark document types as required or optional
- ✅ Search and filter document types
- ✅ Pagination support
- ✅ Soft delete functionality (sets published to false)

### Document Management
- ✅ View all customer documents
- ✅ Add new documents with file upload
- ✅ Edit document metadata
- ✅ Delete documents
- ✅ View document details in modal
- ✅ Download documents
- ✅ Search and filter by document type
- ✅ Pagination support
- ✅ File size and type validation

## API Endpoints

### Document Types
```
GET    /api/documenttypes/                    - Get all published document types
GET    /api/documenttypes/:id                 - Get document type by ID
POST   /api/documenttypes/create              - Create new document type (Admin only)
PUT    /api/documenttypes/edit/:id            - Edit document type (Admin only)
DELETE /api/documenttypes/delete/:id          - Delete document type (Admin only)
GET    /api/documenttypes/notpublished        - Get unpublished document types (Admin only)
POST   /api/documenttypes/withparams          - Get document types with filters (Management only)
```

### Documents
```
GET    /api/documents/                        - Get all documents
GET    /api/documents/:id                     - Get document by ID
POST   /api/documents/create                  - Create new document
PUT    /api/documents/edit/:id                - Edit document
DELETE /api/documents/delete/:id              - Delete document
GET    /api/documents/user/:userId            - Get documents by user
GET    /api/documents/type/:documentTypeId    - Get documents by type
```

## File Structure

```
src/
├── services/
│   ├── documenttypes/
│   │   └── documentTypeService.js          # Document type API service
│   └── documents/
│       └── documentService.js              # Document API service
├── context/
│   ├── DocumentTypeContext.jsx             # Document type state management
│   └── DocumentContext.jsx                 # Document state management
├── pages/
│   ├── admin/
│   │   ├── documentTypeManagement/
│   │   │   └── DocumentTypeManagement.jsx  # Admin document type management
│   │   └── documentManagement/
│   │       └── DocumentManagement.jsx      # Admin document management
│   └── customers/
│       ├── DocumentTypeManagement.jsx      # Customer document type management
│       └── Documents.jsx                   # Customer document management
└── routes/
    └── routes.js                           # Route definitions (updated)
```

## Components

### Admin DocumentTypeManagement.jsx
- **Location**: `src/pages/admin/documentTypeManagement/DocumentTypeManagement.jsx`
- **Purpose**: Admin interface for managing document types
- **Features**:
  - CRUD operations for document types
  - File extension management with add/remove functionality
  - File size configuration with number input
  - Required/optional toggle
  - Search and pagination
  - Form validation

### Admin DocumentManagement.jsx
- **Location**: `src/pages/admin/documentManagement/DocumentManagement.jsx`
- **Purpose**: Admin interface for managing all documents
- **Features**:
  - View all documents with detailed information
  - Add/edit document metadata
  - Document preview modal
  - Download functionality
  - Search and filter by document type and status
  - Tab-based filtering (All, Active, Inactive)
  - Pagination support

### Customer DocumentTypeManagement.jsx
- **Location**: `src/pages/customers/DocumentTypeManagement.jsx`
- **Purpose**: Customer interface for viewing document types
- **Features**:
  - View published document types
  - Search and filter functionality

### Customer Documents.jsx
- **Location**: `src/pages/customers/Documents.jsx`
- **Purpose**: Customer interface for managing their documents
- **Features**:
  - View customer's own documents
  - Add/edit document metadata
  - Document preview modal
  - Download functionality
  - Search and filter by document type
  - Pagination support

## Context Providers

### DocumentTypeContext
- **Location**: `src/context/DocumentTypeContext.jsx`
- **Features**:
  - State management for document types
  - CRUD operations
  - Error handling with toast notifications
  - Loading states

### DocumentContext
- **Location**: `src/context/DocumentContext.jsx`
- **Features**:
  - State management for documents
  - CRUD operations
  - Error handling with toast notifications
  - Loading states

## API Services

### documentTypeService.js
- **Location**: `src/services/documenttypes/documentTypeService.js`
- **Functions**:
  - `fetchDocumentTypes()` - Get all published document types
  - `fetchNotPublishedDocumentTypes()` - Get unpublished document types
  - `fetchDocumentTypesWithParams(params)` - Get filtered document types
  - `getDocumentTypeById(id)` - Get specific document type
  - `createDocumentType(data)` - Create new document type
  - `editDocumentType(id, data)` - Update document type
  - `deleteDocumentType(id)` - Delete document type

### documentService.js
- **Location**: `src/services/documents/documentService.js`
- **Functions**:
  - `fetchDocuments()` - Get all documents
  - `getDocumentById(id)` - Get specific document
  - `getDocumentsByUser(userId)` - Get user's documents
  - `getDocumentsByType(documentTypeId)` - Get documents by type
  - `createDocument(data)` - Create new document
  - `editDocument(id, data)` - Update document
  - `deleteDocument(id)` - Delete document

## Routes

### Admin Document Type Management
- **Path**: `/admin/document-type-management`
- **Component**: `DocumentTypeManagement`
- **Permissions**: Admin only

### Admin Document Management
- **Path**: `/admin/document-management`
- **Component**: `DocumentManagement`
- **Permissions**: Admin only

### Customer Document Type Management
- **Path**: `/customers/document-types`
- **Component**: `CustomerDocumentTypeManagement`
- **Permissions**: All authenticated users

### Customer Document Management
- **Path**: `/customers/documents`
- **Component**: `Documents`
- **Permissions**: All authenticated users

## Database Schema

### DocumentTypesModel
```javascript
{
  name: String,                    // Document type name (e.g., "AADHAR CARD")
  description: String,             // Description of the document type
  allowedExtensions: [String],     // Array of allowed file extensions
  maxFileSize: Number,             // Maximum file size in bytes
  isRequired: Boolean,             // Whether this document is required
  createdByUserId: ObjectId,       // User who created the document type
  updatedByUserId: ObjectId,       // User who last updated the document type
  published: Boolean,              // Whether the document type is active
  timestamps: true                 // Created and updated timestamps
}
```

### DocumentModel
```javascript
{
  userId: ObjectId,                // Customer who owns the document
  documentTypeId: ObjectId,        // Reference to document type
  fileName: String,                // Original file name
  originalUrl: String,             // Original file URL
  thumbnailUrl: String,            // Thumbnail URL (for images)
  mediumUrl: String,               // Medium size URL (for images)
  displayUrl: String,              // Display URL (for preview)
  imageId: String,                 // Cloudinary image ID
  cloudinaryId: String,            // Cloudinary file ID
  size: Number,                    // File size in bytes
  width: Number,                   // Image width (for images)
  height: Number,                  // Image height (for images)
  mimeType: String,                // MIME type of the file
  createdByUserId: ObjectId,       // User who uploaded the document
  updatedByUserId: ObjectId,       // User who last updated the document
  published: Boolean,              // Whether the document is active
  timestamps: true                 // Created and updated timestamps
}
```

## Usage Examples

### Creating a Document Type
```javascript
const documentTypeData = {
  name: "PAN Card",
  description: "Permanent Account Number card for tax purposes",
  allowedExtensions: ["pdf", "jpg", "jpeg", "png"],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  isRequired: true
};

await addDocumentType(documentTypeData);
```

### Adding a Document
```javascript
const documentData = {
  fileName: "pan_card.pdf",
  documentTypeId: "documentTypeId",
  description: "PAN card for customer verification"
};

await addDocument(documentData);
```

## Security & Permissions

### Document Type Management
- **Create/Edit/Delete**: Admin only
- **View**: All authenticated users
- **Advanced filtering**: Management and admin only

### Document Management
- **View**: All authenticated users
- **Create/Edit/Delete**: Based on user permissions
- **Download**: Based on user permissions

## Error Handling

The system includes comprehensive error handling:
- Network errors
- Validation errors
- Permission errors
- Server errors
- User-friendly error messages with toast notifications

## Future Enhancements

1. **File Upload Integration**: Integrate with Cloudinary or similar service
2. **Document Verification**: Add verification status tracking
3. **Bulk Operations**: Support for bulk upload and operations
4. **Document Templates**: Pre-defined document templates
5. **Version Control**: Document versioning system
6. **Audit Trail**: Track all document operations
7. **OCR Integration**: Extract text from uploaded documents
8. **Digital Signatures**: Support for digital signatures

## Testing

To test the document management system:

1. **Admin Document Type Management**:
   - Navigate to `/admin/document-type-management`
   - Create a new document type
   - Edit existing document types
   - Test search and filtering
   - Verify soft delete functionality

2. **Admin Document Management**:
   - Navigate to `/admin/document-management`
   - Add new documents
   - Edit document metadata
   - Test search and filtering with tabs
   - Verify document preview and download

3. **Customer Document Type Management**:
   - Navigate to `/customers/document-types`
   - View published document types
   - Test search and filtering

4. **Customer Document Management**:
   - Navigate to `/customers/documents`
   - Add/edit customer documents
   - Test search and filtering
   - Verify document preview and download

## Dependencies

- **Chakra UI**: UI components
- **React Icons**: Icon library
- **Axios**: HTTP client
- **js-cookie**: Cookie management
- **React Router**: Navigation

## Notes

- The system uses soft deletes for document types (sets `published: false`)
- File upload functionality needs to be integrated with a cloud storage service
- Document preview supports images and PDFs
- The system is designed to be scalable and maintainable
- All API calls include proper error handling and loading states 