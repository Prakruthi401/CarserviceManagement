# Car Service Management System - API Documentation

## Overview
This document describes all available REST APIs for the Car Service Management System, including the original APIs and newly added enhanced features.

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Original APIs (Already Implemented)

### Authentication APIs
- `POST /auth/register` - User registration
- `POST /auth/login` - User login  
- `GET /auth/me` - Get current user info

### User Management APIs
- `GET /users` - Get all users (Admin only)
- `GET /users/{id}` - Get user by ID
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user (Admin only)

### Car Management APIs
- `POST /cars` - Add new car
- `GET /cars/user/{userId}` - Get user's cars
- `GET /cars/{id}` - Get car by ID
- `PUT /cars/{id}` - Update car
- `DELETE /cars/{id}` - Delete car
- `GET /cars` - Get all cars (Admin only)

### Service Request APIs
- `POST /service-requests` - Create service request
- `GET /service-requests/user/{userId}` - Get user's requests
- `GET /service-requests/status/{status}` - Get requests by status
- `GET /service-requests/{id}` - Get request by ID
- `PUT /service-requests/{id}` - Update service request
- `PUT /service-requests/{id}/status` - Update request status
- `DELETE /service-requests/{id}` - Delete request

---

## New APIs (Recently Added)

## Notification APIs

### Get User Notifications
```http
GET /notifications/user/{userId}
Authorization: Bearer <token>
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "Service Request Updated",
    "message": "Your service request #123 has been updated to IN_PROGRESS",
    "type": "SERVICE_UPDATE",
    "read": false,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### Send Notification (Admin only)
```http
POST /notifications/send
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "userId": 1,
  "title": "System Maintenance",
  "message": "System will be under maintenance from 2PM to 4PM",
  "type": "SYSTEM"
}
```

### Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
Authorization: Bearer <token>
```

### Get Unread Count
```http
GET /notifications/unread-count/{userId}
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /notifications/{notificationId}
Authorization: Bearer <token>
```

---

## Report APIs

### Service Summary Report (Admin only)
```http
GET /reports/service-summary
Authorization: Bearer <admin_token>
```
**Response:**
```json
{
  "totalRequests": 150,
  "completedRequests": 120,
  "pendingRequests": 20,
  "inProgressRequests": 10,
  "revenue": 15000.00,
  "averageServiceTime": 2.5,
  "popularServices": [
    {"type": "Oil Change", "count": 45},
    {"type": "Tire Service", "count": 30}
  ]
}
```

### Revenue Report (Admin only)
```http
GET /reports/revenue?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

### Customer Activity Report (Admin only)
```http
GET /reports/customer-activity
Authorization: Bearer <admin_token>
```

### Service Trends Report (Admin only)
```http
GET /reports/service-trends?period=monthly
Authorization: Bearer <admin_token>
```

### User Service History
```http
GET /reports/user/{userId}/service-history
Authorization: Bearer <token>
```

### Export to Excel (Admin only)
```http
GET /reports/export/excel?reportType=service-summary
Authorization: Bearer <admin_token>
```

### Dashboard Stats
```http
GET /reports/dashboard-stats
Authorization: Bearer <token>
```

---

## Invoice APIs

### Generate Invoice (Admin only)
```http
POST /invoices/generate
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "serviceRequestId": 123,
  "items": [
    {"description": "Oil Change", "quantity": 1, "price": 50.00},
    {"description": "Oil Filter", "quantity": 1, "price": 15.00}
  ],
  "laborCost": 30.00,
  "tax": 9.50,
  "totalAmount": 104.50
}
```

### Get Invoice by Service Request
```http
GET /invoices/service-request/{serviceRequestId}
Authorization: Bearer <token>
```

### Get User Invoices
```http
GET /invoices/user/{userId}
Authorization: Bearer <token>
```

### Update Invoice Status (Admin only)
```http
PUT /invoices/{invoiceId}/status?status=PAID
Authorization: Bearer <admin_token>
```

### Process Payment
```http
POST /invoices/{invoiceId}/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "CREDIT_CARD",
  "amount": 104.50,
  "transactionId": "txn_123456789"
}
```

### Download Invoice PDF
```http
GET /invoices/{invoiceId}/download
Authorization: Bearer <token>
```

### Get Pending Invoices (Admin only)
```http
GET /invoices/pending
Authorization: Bearer <admin_token>
```

### Get Overdue Invoices (Admin only)
```http
GET /invoices/overdue
Authorization: Bearer <admin_token>
```

---

## Settings APIs

### General Settings (Admin only)
```http
GET /settings/general
Authorization: Bearer <admin_token>

PUT /settings/general
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "companyName": "Auto Care Center",
  "address": "123 Main St, City, State",
  "phone": "+1-555-0123",
  "email": "info@autocare.com",
  "businessHours": "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM"
}
```

### Service Types Management
```http
GET /settings/service-types
Authorization: Bearer <token>

POST /settings/service-types
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Brake Repair",
  "description": "Complete brake system service",
  "basePrice": 150.00,
  "estimatedTime": 2.5,
  "category": "SAFETY"
}

PUT /settings/service-types/{typeId}
Authorization: Bearer <admin_token>

DELETE /settings/service-types/{typeId}
Authorization: Bearer <admin_token>
```

### Pricing Settings
```http
GET /settings/pricing
Authorization: Bearer <token>

PUT /settings/pricing
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "laborRate": 80.00,
  "taxRate": 0.09,
  "diagnosticFee": 50.00,
  "serviceTypes": [
    {"type": "Oil Change", "price": 50.00},
    {"type": "Tire Rotation", "price": 25.00}
  ]
}
```

### Notification Settings
```http
GET /settings/notifications?userId=1
Authorization: Bearer <token>

PUT /settings/notifications?userId=1
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": false,
  "serviceUpdates": true,
  "promotionalEmails": false,
  "paymentReminders": true
}
```

### Backup and Restore (Admin only)
```http
GET /settings/backup
Authorization: Bearer <admin_token>

POST /settings/backup/create
Authorization: Bearer <admin_token>

POST /settings/backup/restore
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "backupFile": "backup_20240115.sql",
  "restoreData": true,
  "restoreSettings": true
}
```

---

## Additional Suggested APIs

### File Upload APIs
```http
POST /files/upload
Content-Type: multipart/form-data

POST /cars/{carId}/documents
POST /service-requests/{requestId}/attachments
GET /files/{fileId}/download
```

### Appointment APIs
```http
GET /appointments/available?date=2024-01-20
POST /appointments/book
PUT /appointments/{id}/reschedule
DELETE /appointments/{id}
```

### Review/Rating APIs
```http
POST /reviews
GET /reviews/service-request/{requestId}
GET /reviews/user/{userId}
PUT /reviews/{reviewId}
```

### Inventory APIs
```http
GET /inventory/parts
POST /inventory/parts
PUT /inventory/parts/{id}
GET /inventory/low-stock
```

### WebSocket APIs (Real-time)
```
/ws/notifications
/ws/service-status-updates
/ws/admin-dashboard
```

---

## Error Responses

All APIs return consistent error responses:

```json
{
  "error": "Error message description",
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/endpoint",
  "status": 400
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute

---

## Pagination

List endpoints support pagination:
```http
GET /users?page=0&size=20&sort=name,asc
```

Response includes pagination metadata:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0,
  "first": true,
  "last": false
}
```

---

## Testing Examples

### Test with cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Get users (with token)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer <jwt_token>"

# Create service request
curl -X POST http://localhost:8080/api/service-requests \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"serviceType":"Oil Change","description":"Regular service","userId":1}'
```

### Test with Postman
Import the Postman collection (if available) or manually configure:
1. Set base URL: `http://localhost:8080/api`
2. Configure JWT authentication
3. Test endpoints sequentially

---

## API Versioning

Current version: v1
Future versions will be prefixed: `/api/v2/`

---

## Security Notes
- All sensitive data is encrypted
- JWT tokens expire after 24 hours
- Rate limiting prevents abuse
- Input validation on all endpoints
- SQL injection protection
- XSS protection enabled
