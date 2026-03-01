export const BACKOFFICE_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  STAFF: "STAFF",
  INVENTORY_STAFF: "INVENTORY_STAFF",
} as const;

export type BackofficeRole = (typeof BACKOFFICE_ROLE)[keyof typeof BACKOFFICE_ROLE];

/**
 * Minimum role set allowed to access backoffice routes.
 * `ADMIN` is included for compatibility with some backends.
 */
export const BACKOFFICE_ALLOWED_ROLES: readonly BackofficeRole[] = [
  BACKOFFICE_ROLE.SUPER_ADMIN,
  BACKOFFICE_ROLE.ADMIN,
  BACKOFFICE_ROLE.STORE_MANAGER,
  BACKOFFICE_ROLE.STAFF,
  BACKOFFICE_ROLE.INVENTORY_STAFF,
] as const;

type PathRoleRule = {
  prefix: string;
  roles: readonly BackofficeRole[];
};

/**
 * Path-specific hardening rules (least privilege).
 */
const PATH_ROLE_RULES: readonly PathRoleRule[] = [
  {
    prefix: "/admin-dasboard/admin",
    roles: [BACKOFFICE_ROLE.SUPER_ADMIN, BACKOFFICE_ROLE.ADMIN],
  },
  {
    prefix: "/admin-dasboard/settings",
    roles: [
      BACKOFFICE_ROLE.SUPER_ADMIN,
      BACKOFFICE_ROLE.ADMIN,
      BACKOFFICE_ROLE.STORE_MANAGER,
    ],
  },
] as const;

export function getRequiredBackofficeRoles(pathWithoutLocale: string) {
  const matchedRule = PATH_ROLE_RULES.find((rule) =>
    pathWithoutLocale.startsWith(rule.prefix),
  );
  return matchedRule?.roles;
}

export function hasAnyRole(
  userRoles: readonly string[],
  requiredRoles: readonly string[],
) {
  const normalized = new Set(userRoles.map((role) => role.toUpperCase()));
  return requiredRoles.some((role) => normalized.has(role.toUpperCase()));
}
