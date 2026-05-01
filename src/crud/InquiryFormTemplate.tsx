'use client';
// packages/templates/src/crud/InquiryFormTemplate.tsx

/**
 * @fileoverview Showcase inquiry form CRUD template.
 * @description Reusable contact/inquiry form template that creates Customer + Inquiry records.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates a public-facing CRUD form workflow.
 *
 * **Typing:** Use `const` type parameters (`CE`, `IE`) so `customerEntity` /
 * `inquiryEntity` keep their `defineEntity()` literal types — no widened
 * `AnyEntity` at the call site. Default field names (`carId`, `message`,
 * `gdprConsent`, default `customerFields`) assume the showcase entity shapes;
 * pass explicit `contextField` / `messageField` / `consentField` / `customerFields`
 * when your entities use different keys.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';

import { Stack, Button, Card, Alert, Text } from '@donotdev/components';
import { useTranslation, generateUUID, createSchemas, useBreakpoint } from '@donotdev/core';
import type { AnyEntity, BulkAcrossBatch } from '@donotdev/core';
import type { InferEntityData } from '@donotdev/crud';
import {
  isCrudModuleAvailable,
  useCrud,
  useEntityForm,
  FormFieldRenderer,
} from './crudImports';
import { asPartialEntityData } from './asPartialEntityData';

import type { ReactElement, FormEvent } from 'react';
import type { FieldPath } from 'react-hook-form';

/** Props for the InquiryFormTemplate component. */
export interface InquiryFormTemplateProps<
  CE extends AnyEntity = AnyEntity,
  IE extends AnyEntity = AnyEntity,
> {
  /** Customer entity definition */
  customerEntity: CE;
  /** Inquiry entity definition */
  inquiryEntity: IE;
  /** Optional context ID (e.g., carId, productId) */
  contextId?: string;
  /** Optional context name for placeholder (e.g., "BMW X5 2024") */
  contextName?: string;
  /** Optional context details for placeholder (e.g., "BMW X5 2024 • 50,000 km • €45,000") */
  contextDetails?: string;
  /** Message placeholder text (overrides entity placeholder if provided) */
  messagePlaceholder?: string;
  /** Field on the inquiry entity that holds the context reference (showcase default: `carId`) */
  contextField?: keyof InferEntityData<IE>;
  /** Customer fields to render (showcase default: name + contact) */
  customerFields?: Array<keyof InferEntityData<CE>>;
  /** Inquiry message field (showcase default: `message`) */
  messageField?: keyof InferEntityData<IE>;
  /** Customer GDPR consent field (showcase default: `gdprConsent`) */
  consentField?: keyof InferEntityData<CE>;
  /** Callback after successful submission */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

/**
 * InquiryFormTemplate - Reusable inquiry/contact form
 *
 * Creates both a Customer record and an Inquiry record with GDPR consent tracking.
 * Uses entity definitions to render appropriate form fields.
 *
 * @example
 * ```tsx
 * <InquiryFormTemplate
 *   customerEntity={customerEntity}
 *   inquiryEntity={inquiryEntity}
 *   contextId={carId}
 *   contextName="BMW X5 2024"
 * />
 * ```
 */
export function InquiryFormTemplate<
  const CE extends AnyEntity,
  const IE extends AnyEntity,
>({
  customerEntity,
  inquiryEntity,
  contextId,
  contextName,
  contextDetails,
  messagePlaceholder,
  contextField = 'carId' as keyof InferEntityData<IE>,
  customerFields = ['firstName', 'lastName', 'email', 'phone'] as Array<
    keyof InferEntityData<CE>
  >,
  messageField = 'message' as keyof InferEntityData<IE>,
  consentField = 'gdprConsent' as keyof InferEntityData<CE>,
  onSuccess,
  onError,
}: InquiryFormTemplateProps<CE, IE>): ReactElement | null {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  const { bulkAcross } = useCrud(customerEntity);
  const isMobile = useBreakpoint('isMobile');

  const { t: customerT } = useTranslation(
    `entity-${customerEntity.name.toLowerCase()}`
  );
  const { t: inquiryT } = useTranslation(
    `entity-${inquiryEntity.name.toLowerCase()}`
  );

  // Build default message with car details
  const defaultMessage = contextDetails
    ? inquiryT(
        'message.placeholder.withDetails',
        `Inquiry about: ${contextDetails}`,
        { details: contextDetails }
      )
    : contextName
      ? inquiryT(
          'message.placeholder.context',
          `Inquiry about: ${contextName}`,
          { name: contextName }
        )
      : '';

  const inquiryDefaultValues = asPartialEntityData<IE>({
    [contextField]: contextId || undefined,
    date: new Date().toISOString(),
    status: 'draft' as InferEntityData<IE>['status'],
    [messageField]: defaultMessage,
  });

  const inquiryForm = useEntityForm(inquiryEntity, {
    operation: 'create',
    defaultValues: inquiryDefaultValues,
  });

  // Use messagePlaceholder prop if provided, otherwise use entity's placeholder
  const messageFieldConfig = inquiryEntity.fields[messageField as string];
  const effectivePlaceholder =
    messagePlaceholder || messageFieldConfig?.options?.placeholder;

  const customerDefaultValues = asPartialEntityData<CE>({
    type: 'Prospect' as InferEntityData<CE>['type'],
    status: 'draft' as InferEntityData<CE>['status'],
    [consentField]: false as InferEntityData<CE>[typeof consentField],
  });

  const customerForm = useEntityForm(customerEntity, {
    operation: 'create',
    defaultValues: customerDefaultValues,
  });

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const customerSchemas = createSchemas(customerEntity);
  const inquirySchemas = createSchemas(inquiryEntity);

  const handleSubmit = async (customerData: InferEntityData<CE>) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const { id: _omitCustomerId, ...customerCreate } = customerData;
      void _omitCustomerId;

      // Pre-mint customer ID so the inquiry can reference it in the same batch.
      const customerId = generateUUID();

      const messageValue = inquiryForm.getValues(
        messageField as FieldPath<InferEntityData<IE>>
      );
      const inquiryMessage =
        typeof messageValue === 'string' ? messageValue.trim() : '';

      const finalMessage =
        inquiryMessage ||
        defaultMessage ||
        inquiryT('message.default', 'General inquiry');

      const batches: BulkAcrossBatch[] = [
        {
          collection: customerEntity.collection,
          inserts: [{ id: customerId, ...(customerCreate as Record<string, unknown>) }],
          schemas: {
            create: customerSchemas.create as BulkAcrossBatch['schemas']['create'],
            draft: customerSchemas.draft as BulkAcrossBatch['schemas']['draft'],
          },
        },
        {
          collection: inquiryEntity.collection,
          inserts: [
            {
              customerId,
              [contextField as string]: contextId || undefined,
              [messageField as string]: finalMessage,
              date: new Date().toISOString(),
              status: 'draft',
            },
          ],
          schemas: {
            create: inquirySchemas.create as BulkAcrossBatch['schemas']['create'],
            draft: inquirySchemas.draft as BulkAcrossBatch['schemas']['draft'],
          },
          dependsOn: [customerEntity.collection],
        },
      ];

      await bulkAcross(batches);

      setStatus('success');
      customerForm.reset();
      inquiryForm.reset();
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(
        inquiryT(
          'submit.error',
          'We could not send your inquiry right now. Please try again.'
        )
      );
      onError?.(error);
    }
  };

  if (status === 'success') {
    return (
      <Card variant="glass">
        <Stack
          direction="column"
          style={{ textAlign: 'center', padding: 'var(--gap-lg)' }}
        >
          <div style={{ fontSize: '2rem', color: 'var(--success)' }}>✓</div>
          <Text level="h3">
            {inquiryT('success.title', 'Thank you for your inquiry!')}
          </Text>
          <Text variant="muted">
            {inquiryT(
              'success.message',
              "We'll get back to you as soon as possible."
            )}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        customerForm.handleSubmit(handleSubmit)(e);
      }}
    >
      <Stack direction="column">
        {status === 'error' && errorMessage && (
          <Alert variant="error" description={errorMessage} />
        )}

        {/* Customer fields - render in pairs for name fields */}
        {(() => {
          const firstNameConfig = customerEntity.fields.firstName;
          const lastNameConfig = customerEntity.fields.lastName;
          if (
            (customerFields as string[]).includes('firstName') &&
            (customerFields as string[]).includes('lastName') &&
            firstNameConfig &&
            lastNameConfig
          ) {
            return (
              <>
                <Stack direction={isMobile ? 'column' : 'row'}>
                  <div style={{ flex: 1 }}>
                    <FormFieldRenderer
                      name="firstName"
                      config={firstNameConfig}
                      control={customerForm.control}
                      errors={customerForm.formState.errors}
                      t={customerT}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <FormFieldRenderer
                      name="lastName"
                      config={lastNameConfig}
                      control={customerForm.control}
                      errors={customerForm.formState.errors}
                      t={customerT}
                    />
                  </div>
                </Stack>
                {customerFields
                  .filter((f) => f !== 'firstName' && f !== 'lastName')
                  .map((fieldName) => {
                    const config = customerEntity.fields[fieldName as string];
                    if (!config) return null;
                    return (
                      <FormFieldRenderer
                        key={String(fieldName)}
                        name={fieldName as string}
                        config={config}
                        control={customerForm.control}
                        errors={customerForm.formState.errors}
                        t={customerT}
                      />
                    );
                  })}
              </>
            );
          }
          // Fallback: render all fields individually if firstName/lastName not both present
          return customerFields.map((fieldName) => {
            const config = customerEntity.fields[fieldName as string];
            if (!config) return null;
            return (
              <FormFieldRenderer
                key={String(fieldName)}
                name={fieldName as string}
                config={config}
                control={customerForm.control}
                errors={customerForm.formState.errors}
                t={customerT}
              />
            );
          });
        })()}

        {/* Message field */}
        {messageFieldConfig && (
          <FormFieldRenderer
            name={messageField as string}
            config={{
              ...messageFieldConfig,
              options: {
                ...messageFieldConfig.options,
                ...(effectivePlaceholder && {
                  placeholder: effectivePlaceholder,
                }),
              },
            }}
            control={inquiryForm.control}
            errors={inquiryForm.formState.errors}
            t={inquiryT}
          />
        )}

        {/* GDPR Consent field - from customerEntity */}
        {customerEntity.fields[consentField as string] && (
          <FormFieldRenderer
            name={consentField as string}
            config={customerEntity.fields[consentField as string]!}
            control={customerForm.control}
            errors={customerForm.formState.errors}
            t={customerT}
          />
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={status === 'loading' || customerForm.formState.isSubmitting}
          style={{ width: '100%' }}
        >
          {status === 'loading'
            ? inquiryT('submit.sending', 'Sending...')
            : inquiryT('submit', 'Send Inquiry')}
        </Button>
      </Stack>
    </form>
  );
}
