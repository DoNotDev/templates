// packages/templates/src/crud/asPartialEntityData.ts

/**
 * Template-side helpers where TypeScript cannot prove overlap for computed keys
 * (`keyof InferEntityData`) against the row type. Runtime shape remains the
 * caller's responsibility.
 */
import type { AnyEntity, CreateInput } from '@donotdev/core';
import type { InferEntityData } from '@donotdev/crud';

export function asPartialEntityData<E extends AnyEntity>(
  values: Record<string, unknown>
): Partial<InferEntityData<E>> {
  // why: computed keys cannot be proven against InferEntityData<E>; single audited boundary
  return values as unknown as Partial<InferEntityData<E>>;
}

/**
 * Create-form defaults (`useEntityForm` `defaultValues` on create:
 * `Partial<CreateInput<E>>`) built with computed keys.
 *
 * @param values - Defaults keyed by field name
 * @returns The defaults, typed as the entity's create input
 */
export function asPartialCreateInput<E extends AnyEntity>(
  values: Record<string, unknown>
): Partial<CreateInput<E>> {
  // why: computed keys cannot be proven against CreateInput<E>; single audited boundary
  return values as unknown as Partial<CreateInput<E>>;
}
