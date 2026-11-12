// packages/templates/src/crud/asPartialEntityData.ts

/**
 * Template-side helpers where TypeScript cannot prove overlap for computed keys
 * (`keyof InferEntityData`) against row / create types. Runtime shape remains the
 * caller's responsibility.
 */
import type { AnyEntity } from '@donotdev/core';
import type { InferEntityCreate, InferEntityData } from '@donotdev/crud';

export function asPartialEntityData<E extends AnyEntity>(
  values: Record<string, unknown>
): Partial<InferEntityData<E>> {
  // why: computed keys cannot be proven against InferEntityData<E>; single audited boundary
  return values as unknown as Partial<InferEntityData<E>>;
}

export function asInferEntityCreate<E extends AnyEntity>(
  values: Record<string, unknown>
): InferEntityCreate<E> {
  // why: same computed-key gap as asPartialEntityData; single audited boundary
  return values as unknown as InferEntityCreate<E>;
}
