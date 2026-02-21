# Role-Based Access Control

**Status**: 📋 PLANNED
**Priority**: High
**Last Updated**: 2026-01-26

## 📋 Overview

This document defines the role-based access control (RBAC) system for admin dashboard, specifying roles, permissions, and access levels for different user types.

## 🎯 Goals

- Define clear role hierarchy
- Implement granular permissions
- Enable flexible access control
- Support role-based UI customization

## 📐 Requirements

### Roles Definition

1. **R-1**: Predefined Roles
   - **Super Admin**: Full system access, can manage other admins
   - **Admin**: Full access to all modules except user management
   - **Manager**: Full access to specific modules (orders, products)
   - **Staff**: Read-only or limited update access
   - Acceptance criteria: Roles are clearly defined and hierarchical
   - Priority: High

2. **R-2**: Custom Roles (Future)
   - Ability to create custom roles
   - Assign granular permissions
   - Role templates for quick setup
   - Acceptance criteria: Admins can create custom roles
   - Priority: Medium

### Permissions Definition

1. **P-1**: Module-Level Permissions
   - **Dashboard**: read
   - **Orders**: read, create, update, delete, export
   - **Products**: read, create, update, delete, manage-inventory
   - **Customers**: read, create, update, delete
   - **Analytics**: read, export
   - **Settings**: read, update
   - Acceptance criteria: Permissions are module-specific
   - Priority: High

2. **P-2**: Data-Level Permissions (Future)
   - Limit access to specific warehouses
   - Limit access to specific product categories
   - Territory-based access for customers
   - Acceptance criteria: Fine-grained data filtering
   - Priority: Medium

3. **P-3**: Action-Based Permissions
   - Read access (view data)
   - Create access (add new records)
   - Update access (edit existing records)
   - Delete access (remove records)
   - Special actions (approve, reject, export, import)
   - Acceptance criteria: Permissions control specific actions
   - Priority: High

### Permission Assignment

1. **PA-1**: User-Role Mapping
   - Users can have multiple roles
   - Roles can be assigned/revoked by Super Admin
   - Role assignments are logged
   - Acceptance criteria: Flexible role management
   - Priority: High

2. **PA-2**: Permission Override (Emergency)
   - Super Admin can bypass permission checks
   - Emergency access logged separately
   - Time-limited override capability
   - Acceptance criteria: Emergency override available
   - Priority: Low

## 🏗️ Technical Design

### Data Models

```typescript
interface Role {
  id: string
  name: string
  description: string
  isSystem: boolean
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

interface Permission {
  id: string
  code: string
  module: string
  action: PermissionAction
  description: string
  isSystem: boolean
}

enum PermissionAction {
  READ = 'read'
  CREATE = 'create'
  UPDATE = 'update'
  DELETE = 'delete'
  APPROVE = 'approve'
  REJECT = 'reject'
  EXPORT = 'export'
  IMPORT = 'import'
  MANAGE_INVENTORY = 'manage-inventory'
}

interface UserRole {
  id: string
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
}
```

### Permission System

```typescript
class PermissionService {
  // Check if user has specific permission
  hasPermission(userId: string, permission: string): boolean

  // Check if user has any of multiple permissions
  hasAnyPermission(userId: string, permissions: string[]): boolean

  // Check if user has all specified permissions
  hasAllPermissions(userId: string, permissions: string[]): boolean

  // Get all permissions for user (merged from all roles)
  getUserPermissions(userId: string): Permission[]

  // Assign role to user
  assignRole(userId: string, roleId: string, assignedBy: string): void

  // Remove role from user
  removeRole(userId: string, roleId: string): void

  // Check access to specific data (future)
  canAccessData(userId: string, resource: string, resourceId: string): boolean
}
```

### UI Integration

```typescript
// Permission-aware components
<PermissionCheck module="orders" action="delete">
  <DeleteButton />
</PermissionCheck>

// Role-based rendering
<RoleCheck roles={['admin', 'super-admin']}>
  <AdvancedSettings />
</RoleCheck>

// Permission-aware navigation
<PermissionGuard permission="analytics.read">
  <AnalyticsPage />
</PermissionGuard>
```

## 📊 Permission Matrix

| Module/Action | Super Admin | Admin | Manager | Staff |
|---------------|-------------|---------|----------|--------|
| **Dashboard** | | | | |
| Read | ✅ | ✅ | ✅ | ✅ |
| **Orders** | | | | |
| Read | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Update | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ |
| Export | ✅ | ✅ | ✅ | ❌ |
| **Products** | | | | |
| Read | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Update | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ |
| Manage Inventory | ✅ | ✅ | ✅ | ❌ |
| **Customers** | | | | |
| Read | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ |
| Update | ✅ | ✅ | ✅ | ❌ |
| Delete | ✅ | ✅ | ❌ | ❌ |
| **Analytics** | | | | |
| Read | ✅ | ✅ | ✅ | ✅ |
| Export | ✅ | ✅ | ✅ | ❌ |
| **Settings** | | | | |
| Read | ✅ | ✅ | ❌ | ❌ |
| Update | ✅ | ❌ | ❌ | ❌ |
| **User Management** | | | | |
| Read | ✅ | ❌ | ❌ | ❌ |
| Create | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |

## 🔒 Security Considerations

1. **Permission Enforcement**
   - Server-side validation on all actions
   - Client-side UI feedback for denied access
   - API endpoints check permissions before execution

2. **Audit Trail**
   - Log all permission denials
   - Track role assignments and changes
   - Monitor emergency access overrides

3. **Least Privilege Principle**
   - Default to minimum required permissions
   - Role inheritance carefully managed
   - Regular permission audits

## 🧪 Testing

### Unit Tests
- [ ] Permission checking logic
- [ ] Role assignment/removal
- [ ] Permission inheritance
- [ ] Permission override logic

### Integration Tests
- [ ] API permission enforcement
- [ ] UI component permission checks
- [ ] Role-based navigation guards
- [ ] Permission denial logging

### E2E Tests
- [ ] Users can only access permitted features
- [ ] Changing roles updates access immediately
- [ ] Permission denials show appropriate messages
- [ ] Super Admin can manage users and roles

## ✅ Acceptance Criteria

- [ ] AC-1: Four predefined roles exist
- [ ] AC-2: Permissions are module and action-based
- [ ] AC-3: Users can have multiple roles
- [ ] AC-4: Permissions are enforced server-side
- [ ] AC-5: UI respects user permissions
- [ ] AC-6: All permission changes are logged

## 📝 Implementation Notes

### Current Status
- ✅ Permission data models defined
- ⏳ Role management UI not implemented
- ⏳ Permission assignment UI not implemented
- ⏳ Permission checks in API not complete

### Technical Decisions
- Role-based system (simpler than attribute-based)
- Server-side permission enforcement required
- Client-side UI enhancements for better UX
- Permission caching for performance

### Future Enhancements
- Custom role creation
- Data-level permissions (warehouse, territory)
- Permission templates
- Bulk role assignment
- Permission request workflow

## 📖 Related Documentation

- [Authentication](./auth.md)
- [Architecture Overview](../architecture/overview.md)
- [Auth Implementation](../../../authentication/README.md)
