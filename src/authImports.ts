// packages/templates/src/authImports.ts

/**
 * @fileoverview Safe import hub for @donotdev/auth in templates
 * @description Single module-level import using the proven `import * as` pattern.
 * When auth is not installed, Vite aliases it to an empty module — all extractions
 * resolve to `undefined`. This is immutable: the decision is made once at module load.
 *
 * Components import from here instead of directly from '@donotdev/auth'.
 *
 * @see packages/ui/src/utils/useAuthSafe.ts — same pattern
 * @version 0.1.0
 * @since 0.0.18
 * @author AMBROISE PARK Consulting
 */

import * as authModule from '@donotdev/auth';

/** true when @donotdev/auth resolved with real exports */
export const isAuthModuleAvailable = typeof authModule?.useAuth === 'function';

// --- Hooks ---
export const useAuth = authModule?.useAuth;
export const useDeleteAccount = authModule?.useDeleteAccount;

// --- Components ---
export const MultipleAuthProviders = authModule?.MultipleAuthProviders;
export const ConfirmDeleteDialog = authModule?.ConfirmDeleteDialog;
export const ReauthDialog = authModule?.ReauthDialog;
