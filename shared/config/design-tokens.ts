/**
 * Design Tokens - Single source of truth for design system values
 * Used across all 3 domains: back-office, storefront, user
 */

export const designTokens = {
  /**
   * Spacing scale (based on Tailwind defaults, documented here for reference)
   */
  spacing: {
    xs: "0.25rem", // 1
    sm: "0.5rem", // 2
    md: "1rem", // 4
    lg: "1.5rem", // 6
    xl: "2rem", // 8
    "2xl": "3rem", // 12
    "3xl": "4rem", // 16
  },

  /**
   * Border radius
   */
  radius: {
    none: "0",
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },

  /**
   * Typography scale
   */
  typography: {
    xs: { fontSize: "0.75rem", lineHeight: "1rem" },
    sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },
    base: { fontSize: "1rem", lineHeight: "1.5rem" },
    lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },
    xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },
    "2xl": { fontSize: "1.5rem", lineHeight: "2rem" },
    "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem" },
    "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem" },
  },

  /**
   * Motion/Animation durations
   */
  motion: {
    fast: "150ms",
    base: "250ms",
    slow: "350ms",
    slower: "500ms",
  },

  /**
   * Z-index layers
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  },

  /**
   * Breakpoints (for reference, actual implementation uses Tailwind)
   */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

/**
 * Component-specific design patterns
 */
export const componentPatterns = {
  /**
   * Card variants
   */
  card: {
    default: "rounded-lg border bg-card p-6",
    compact: "rounded-md border bg-card p-4",
    elevated: "rounded-lg border bg-card p-6 shadow-sm",
  },

  /**
   * Input heights
   */
  input: {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  },

  /**
   * Container max widths
   */
  container: {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  },
} as const;

/**
 * Animation presets
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25 },
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
} as const;

/**
 * Domain-specific semantic token contracts
 * These define the semantic color tokens used by each domain
 */
export const domainTokens = {
  /**
   * Storefront domain tokens (ecommerce customer-facing)
   * Theme: Modern pastel pink aesthetic
   */
  storefront: {
    primary: "var(--storefront-primary)",
    primaryHover: "var(--storefront-primary-hover)",
    accent: "var(--storefront-accent)",
    background: "var(--storefront-background)",
    text: "var(--storefront-text)",
    border: "var(--storefront-border)",
    cardBg: "var(--storefront-card-bg)",
    cardShadow: "var(--storefront-card-shadow)",
    cardHoverShadow: "var(--storefront-card-hover-shadow)",
    buttonPrimaryBg: "var(--storefront-button-primary-bg)",
    buttonPrimaryText: "var(--storefront-button-primary-text)",
    buttonSecondaryBg: "var(--storefront-button-secondary-bg)",
    buttonSecondaryBorder: "var(--storefront-button-secondary-border)",
  },

  /**
   * Backoffice domain tokens (admin dashboard)
   * Theme: Professional indigo/gray aesthetic
   */
  backoffice: {
    primary: "var(--backoffice-primary)",
    primaryHover: "var(--backoffice-primary-hover)",
    background: "var(--backoffice-background)",
    sidebarBg: "var(--backoffice-sidebar-bg)",
    text: "var(--backoffice-text)",
    border: "var(--backoffice-border)",
    cardBg: "var(--backoffice-card-bg)",
  },
} as const;
