/**
 * @fileoverview InquiryFormTemplate submission
 * @description Regression: the guest form does not write `status` (editable by
 * admins only), so the prospect customer was inserted with the default status
 * (`available`, published). Both inserts must be drafts.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  bulkAcross: vi.fn(async (_batches: unknown) => ({ results: {} })),
  /** Values each form's handleSubmit hands to its callback (keyed by entity name). */
  values: {
    Customer: { firstName: 'Ana', email: 'ana@example.com', gdprConsent: true },
    Inquiry: { message: 'Hello' },
  } as Record<string, Record<string, unknown>>,
}));

vi.mock('../crud/crudImports', () => ({
  isCrudModuleAvailable: true,
  useCrud: () => ({ bulkAcross: state.bulkAcross }),
  useEntityForm: (entity: { name: string }) => ({
    trigger: async () => true,
    handleSubmit: (onValid: (data: Record<string, unknown>) => unknown) => async () => {
      await onValid(state.values[entity.name]!);
    },
    reset: () => {},
    formState: { isSubmitting: false },
  }),
  FormFieldRenderer: () => null,
}));

vi.mock('@donotdev/core', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  generateUUID: () => 'customer-1',
  createSchemas: (entity: { name: string }) => ({
    create: `${entity.name}.create`,
    draft: `${entity.name}.draft`,
  }),
  useBreakpoint: () => false,
}));

vi.mock('@donotdev/components', () => {
  const pass = (p: { children?: unknown }) => createElement('div', null, p.children as never);
  return {
    Stack: pass,
    Card: pass,
    Alert: () => null,
    Text: pass,
    Button: (p: { children?: unknown }) => createElement('button', { type: 'submit' }, p.children as never),
  };
});

const { InquiryFormTemplate } = await import('../crud/InquiryFormTemplate');
const { customerEntity, inquiryEntity } = await import('@dndev/test-entities');

describe('InquiryFormTemplate', () => {
  let container: HTMLElement;
  beforeEach(() => {
    state.bulkAcross.mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(() => container.remove());

  it('inserts the prospect customer and the inquiry as drafts', async () => {
    const root = createRoot(container);
    await act(async () =>
      root.render(createElement(InquiryFormTemplate, { customerEntity, inquiryEntity, contextId: 'car-1' }))
    );
    const form = container.querySelector('form')!;
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    expect(state.bulkAcross).toHaveBeenCalledTimes(1);
    const batches = state.bulkAcross.mock.calls[0]![0] as Array<{
      collection: string;
      inserts: Record<string, unknown>[];
    }>;
    const customer = batches.find((b) => b.collection === 'customers')!;
    const inquiry = batches.find((b) => b.collection === 'inquiries')!;
    expect(customer.inserts[0]).toMatchObject({ id: 'customer-1', firstName: 'Ana', status: 'draft' });
    expect(inquiry.inserts[0]).toMatchObject({ customerId: 'customer-1', status: 'draft' });
    await act(async () => root.unmount());
  });
});
