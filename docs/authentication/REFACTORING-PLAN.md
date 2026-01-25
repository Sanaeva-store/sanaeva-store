# Auth Module Refactoring Plan

## Goal
Refactor the auth module to follow [Elysia Best Practices](https://elysiajs.com/essential/best-practice.html)

## Current Structure
```
server/
├── middleware.ts                    # Auth middleware (legacy pattern)
├── server.ts                        # Main server file
├── config/
│   ├── auth.ts                     # Better Auth configuration
│   └── index.ts
├── db/
│   └── client.ts
├── modules/
│   └── auth/
│       ├── controller.ts           # ❌ Should be index.ts
│       ├── model.ts                # ✅ Keep
│       ├── repository.ts           # ❌ Redundant (Better Auth handles DB)
│       ├── service.ts              # ✅ Keep (with modifications)
│       └── types.ts                # ❌ Merge into model.ts
├── plugins/
│   └── auth.ts                     # ✅ Keep (shared plugin)
└── utils/
    └── httpError.ts                # ✅ Keep
```

## Target Structure (Elysia Best Practice)
```
server/
├── server.ts                        # Main server file
├── config/
│   ├── auth.ts                     # Better Auth configuration
│   └── index.ts
├── db/
│   └── client.ts
├── modules/
│   └── auth/
│       ├── index.ts                # ✅ Elysia controller (renamed from controller.ts)
│       ├── service.ts              # ✅ Business logic (cleaned up)
│       └── model.ts                # ✅ Validation schemas & types (merged with types.ts)
├── plugins/
│   └── auth.ts                     # ✅ Better Auth plugin (stays)
└── utils/
    ├── httpError.ts
    └── middleware.ts               # ✅ Moved from server root (optional reusable middleware)
```

## Detailed Changes

### 1. **Rename: controller.ts → index.ts** ✅
**Why:** Elysia convention - controllers should be `index.ts`

**File:** `server/modules/auth/controller.ts` → `server/modules/auth/index.ts`

**Changes Required:**
- Rename file
- Update import in `server/server.ts`:
  ```typescript
  // Before
  import { authController } from './modules/auth/controller'
  
  // After  
  import { authController } from './modules/auth'
  ```

### 2. **Merge: types.ts → model.ts** ✅
**Why:** Single source of truth for types and validation

**Files:**
- Delete `server/modules/auth/types.ts`
- Merge all types into `server/modules/auth/model.ts`

**Current model.ts exports:**
- Zod schemas (signUpSchema, signInSchema, etc.)
- Type definitions from schemas

**Current types.ts exports:**
- Better Auth types (BetterAuthUser, BetterAuthSession, etc.)
- Response types (UserResponse, SessionResponse, etc.)

**Result:** All types in one file following Elysia pattern

### 3. **Delete: repository.ts** ✅
**Why:** Better Auth manages all database operations

**File:** `server/modules/auth/repository.ts`

**Reasoning:**
- All functions are commented out with "Use Better Auth API instead"
- Prisma queries are redundant
- Repository pattern not needed when using Better Auth
- Service layer directly uses `auth.api.*` methods

### 4. **Clean up: service.ts** ✅
**Why:** Remove repository dependencies and unused imports

**File:** `server/modules/auth/service.ts`

**Changes:**
- Remove `repository` imports (already done)
- Remove unused type imports
- Keep only Better Auth API calls
- Simplify helper functions

### 5. **Move: middleware.ts (Optional)** 🔄
**Why:** Better organization for reusable utilities

**Options:**
1. **Keep at server root** - Easy access for multiple modules
2. **Move to utils/** - Better organization for utility functions

**Recommendation:** Move to `server/utils/middleware.ts` for consistency

**Update imports where used**

### 6. **Update: server.ts imports** ✅
**File:** `server/server.ts`

**Changes:**
```typescript
// Before
import { authController } from './modules/auth/controller'

// After
import { authController } from './modules/auth'
```

## Implementation Steps

### Step 1: Merge types.ts into model.ts
1. Copy all types from `types.ts` to `model.ts`
2. Organize: Schemas first, then types
3. Update exports

### Step 2: Update service.ts imports
1. Change type imports from `'./types'` to `'./model'`
2. Remove any repository imports (already done)

### Step 3: Rename controller.ts to index.ts
1. Rename the file
2. Update import in `server.ts`

### Step 4: Delete repository.ts
1. Confirm no active usage
2. Delete the file

### Step 5: Move middleware.ts (optional)
1. Move to `server/utils/middleware.ts`
2. Update imports in files that use it

### Step 6: Verify and test
1. Check TypeScript compilation
2. Run dev server
3. Test auth endpoints

## File Changes Summary

| Action | File | New Location/Name |
|--------|------|-------------------|
| Rename | `modules/auth/controller.ts` | `modules/auth/index.ts` |
| Merge | `modules/auth/types.ts` | → `modules/auth/model.ts` |
| Delete | `modules/auth/repository.ts` | ❌ Removed |
| Move (optional) | `middleware.ts` | `utils/middleware.ts` |
| Update | `server.ts` | Update imports |
| Update | `modules/auth/service.ts` | Update imports |

## Benefits

### 1. **Follows Elysia Convention**
- ✅ Controller as `index.ts`
- ✅ Feature-based folder structure
- ✅ Clear separation of concerns

### 2. **Single Source of Truth**
- ✅ All types in `model.ts`
- ✅ No duplication between types.ts and model.ts

### 3. **Cleaner Codebase**
- ✅ Remove unused repository layer
- ✅ Simpler service implementation
- ✅ Less files to maintain

### 4. **Better Type Inference**
- ✅ Elysia can better infer types from schemas
- ✅ No manual type definitions needed

### 5. **Maintainability**
- ✅ Easier to find code (convention-based)
- ✅ Less cognitive overhead
- ✅ Consistent with other Elysia projects

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking imports | Update all import statements |
| Type errors | Run TypeScript check after each step |
| Missing types | Verify all exports before deletion |
| Runtime errors | Test server startup after changes |

## Testing Checklist

After refactoring:
- [ ] TypeScript compiles with no errors
- [ ] Server starts successfully
- [ ] Auth endpoints respond correctly
- [ ] Custom routes work with authentication
- [ ] No import errors in any files

## Next Steps

**Please review this plan and confirm:**
1. Is the target structure correct?
2. Should I move `middleware.ts` to `utils/` or keep at root?
3. Any additional changes you'd like?

Once confirmed, I'll execute the refactoring step by step.
