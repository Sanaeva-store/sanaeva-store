# Phase 5 - Observability, Performance & Release [TH]

## Scope

เตรียม storefront ให้พร้อม release ด้วย performance tuning และ monitoring ครอบ flow สำคัญ

## Spec Links

- `docs/specs/store-front/requirements/README.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [x] Core Web Vitals monitoring และ error tracking integration
- [x] Image optimization และ caching strategy review
- [x] Query cache policy tuning (staleTime/retry/refetch behavior)
- [x] Lighthouse and bundle size budget checks
- [x] Release playbook (rollout + rollback)

## Dependency

- [x] Logging/monitoring service พร้อมใช้งาน
- [x] Baseline KPI ของ performance ก่อน optimize

## Acceptance Criteria

- หน้า critical ผ่านเกณฑ์ performance ที่กำหนด
- มี dashboard/alert สำหรับ frontend errors หลัก
- ทีมสามารถ rollout และ rollback ตาม playbook ได้จริง

