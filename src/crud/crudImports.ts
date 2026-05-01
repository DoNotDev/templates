// packages/templates/src/crud/crudImports.ts

/**
 * @fileoverview Safe import hub for @donotdev/crud in templates
 * @description Single module-level import using the proven `import * as` pattern.
 * When crud is not installed, Vite aliases it to an empty module — all extractions
 * resolve to `undefined`. This is immutable: the decision is made once at module load.
 *
 * Components import from here instead of directly from '@donotdev/crud'.
 * Type-only imports (`import type`) can still go directly to '@donotdev/crud'.
 *
 * @see packages/ui/src/crud/crudImports.ts — same pattern
 * @version 0.1.0
 * @since 0.0.18
 * @author AMBROISE PARK Consulting
 */

import * as crudModule from '@donotdev/crud';

/** true when @donotdev/crud resolved with real exports */
export const isCrudModuleAvailable = typeof crudModule?.useCrud === 'function';

// --- Hooks ---
export const useCrud = crudModule?.useCrud;
export const useCrudList = crudModule?.useCrudList;
export const useCrudCardList = crudModule?.useCrudCardList;
export const useCrudFilters = crudModule?.useCrudFilters;
export const useEntityForm = crudModule?.useEntityForm;
export const useEntityFavorites = crudModule?.useEntityFavorites;
export const useRelatedItems = crudModule?.useRelatedItems;

// --- Components ---
export const EntityFilters = crudModule?.EntityFilters;
export const FormFieldRenderer = crudModule?.FormFieldRenderer;

// --- Utils ---
export const translateFieldLabel = crudModule?.translateFieldLabel;
export const translateLabel = crudModule?.translateLabel;
export const formatValue = crudModule?.formatValue;
export const matchesFilter = crudModule?.matchesFilter;
