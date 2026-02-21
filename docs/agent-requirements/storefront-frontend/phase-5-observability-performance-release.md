# Phase 5 - Observability, Performance & Release [TH]

## Scope

เตรียม storefront ให้พร้อม release ด้วย performance tuning และ monitoring ครอบ flow สำคัญ

## Spec Links

- `docs/specs/store-front/requirements/README.md`
- `docs/specs/store-front/architecture/overview.md`

## Feature Tasks

- [ ] Core Web Vitals monitoring และ error tracking integration
- [ ] Image optimization และ caching strategy review
- [ ] Query cache policy tuning (staleTime/retry/refetch behavior)
- [ ] Lighthouse and bundle size budget checks
- [ ] Release playbook (rollout + rollback)

## Dependency

- [ ] Logging/monitoring service พร้อมใช้งาน
- [ ] Baseline KPI ของ performance ก่อน optimize

## Acceptance Criteria

- หน้า critical ผ่านเกณฑ์ performance ที่กำหนด
- มี dashboard/alert สำหรับ frontend errors หลัก
- ทีมสามารถ rollout และ rollback ตาม playbook ได้จริง

