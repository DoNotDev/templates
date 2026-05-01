// packages/templates/src/billing/billingImports.ts

/**
 * @fileoverview Safe import hub for @donotdev/billing in templates
 * @description Single module-level import using the proven `import * as` pattern.
 * When billing is not installed, Vite aliases it to an empty module — all extractions
 * resolve to `undefined`. This is immutable: the decision is made once at module load.
 *
 * Components import from here instead of directly from '@donotdev/billing'.
 * Type-only imports (`import type`) can still go directly to '@donotdev/billing'.
 *
 * @see packages/templates/src/authImports.ts — same pattern
 * @see packages/templates/src/crud/crudImports.ts — same pattern
 * @version 0.1.0
 * @since 0.0.18
 * @author AMBROISE PARK Consulting
 */

import * as billingModule from '@donotdev/billing';

/** true when @donotdev/billing resolved with real exports */
export const isBillingModuleAvailable =
  typeof billingModule?.StripeCheckoutButton === 'function';

// --- Components ---
export const StripeCheckoutButton = billingModule?.StripeCheckoutButton;
export const ProductCard = billingModule?.ProductCard;
export const SubscriptionManager = billingModule?.SubscriptionManager;
export const SecurityNotice = billingModule?.SecurityNotice;
