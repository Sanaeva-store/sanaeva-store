# Data Validation Requirements

**Status**: 📋 PLANNED
**Priority**: High
**Last Updated**: 2026-01-26

## 📋 Overview

This document defines data validation rules and input sanitization requirements for the admin dashboard API endpoints, ensuring data integrity and security.

## 🎯 Goals

- Validate all incoming data
- Sanitize user inputs
- Provide clear error messages
- Prevent common injection attacks

## 📐 Requirements

### General Validation

1. **DV-1**: Input Validation
   - All API endpoints validate request data
   - Type checking (string, number, boolean, etc.)
   - Length and format validation
   - Acceptance criteria: Invalid inputs return 400 with error details
   - Priority: High

2. **DV-2**: Sanitization
   - HTML/Script tag removal
   - SQL injection prevention
   - XSS attack prevention
   - Acceptance criteria: All user inputs are sanitized
   - Priority: High

### Module-Specific Validation

#### Orders
- Order number: alphanumeric, 3-50 chars
- Quantity: positive integer, max 999
- Email: valid email format
- Phone: optional, valid format if provided

#### Products
- SKU: alphanumeric, 3-50 chars, unique
- Price: positive number, max 2 decimal places
- Stock: non-negative integer
- Weight: positive number, max 3 decimal places

#### Customers
- Email: valid email format
- Phone: valid E.164 format if provided
- Name: 2-100 chars, letters and spaces only

## 🏗️ Technical Design

### Validation Library
- Using Zod for schema validation
- Custom error messages
- Validation middleware in API

### Example Schema

```typescript
import { z } from 'zod'

const orderSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().positive().max(999),
  })).min(1, 'At least one item required'),
  currency: z.enum(['THB', 'USD', 'EUR']),
  notes: z.string().max(1000).optional(),
})
```

### Error Response Format

```typescript
interface ValidationError {
  success: false
  error: {
    code: 'VALIDATION_ERROR'
    message: string
    details: ValidationError[]
  }
}

interface ValidationError {
  field: string
  message: string
  constraint: string
}
```

## 🔒 Security Considerations

1. **Injection Prevention**
   - Parameterized queries
   - Input sanitization
   - Output encoding

2. **Length Limits**
   - Prevent DoS via large inputs
   - Reasonable max lengths
   - File size limits

## ✅ Acceptance Criteria

- [ ] AC-1: All API endpoints validate inputs
- [ ] AC-2: Invalid data returns clear errors
- [ ] AC-3: XSS attacks are prevented
- [ ] AC-4: SQL injection is prevented

## 📖 Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [API Routes](../architecture/api-routes.md)
