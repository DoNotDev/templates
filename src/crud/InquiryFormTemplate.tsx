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
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';

import { Stack, Button, Card, Alert, Text } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import {
  isCrudModuleAvailable,
  useCrud,
  useEntityForm,
  FormFieldRenderer,
} from './crudImports';

import type { ReactElement, FormEvent } from 'react';

/** Props for the InquiryFormTemplate component. */
export interface InquiryFormTemplateProps {
  /** Customer entity definition */
  customerEntity: Entity;
  /** Inquiry entity definition */
  inquiryEntity: Entity;
  /** Optional context ID (e.g., carId, productId) */
  contextId?: string;
  /** Optional context name for placeholder (e.g., "BMW X5 2024") */
  contextName?: string;
  /** Optional context details for placeholder (e.g., "BMW X5 2024 • 50,000 km • €45,000") */
  contextDetails?: string;
  /** Message placeholder text (overrides entity placeholder if provided) */
  messagePlaceholder?: string;
  /** Field name for context reference in inquiry (default: 'carId') */
  contextField?: string;
  /** Customer fields to display (default: ['firstName', 'lastName', 'email', 'phone']) */
  customerFields?: string[];
  /** Message field name in inquiry entity (default: 'message') */
  messageField?: string;
  /** GDPR consent field name in inquiry entity (default: 'gdprConsent') */
  consentField?: string;
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
export function InquiryFormTemplate({
  customerEntity,
  inquiryEntity,
  contextId,
  contextName,
  contextDetails,
  messagePlaceholder,
  contextField = 'carId',
  customerFields = ['firstName', 'lastName', 'email', 'phone'],
  messageField = 'message',
  consentField = 'gdprConsent',
  onSuccess,
  onError,
}: InquiryFormTemplateProps): ReactElement | null {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  const { add: addCustomer } = useCrud(customerEntity);
  const { add: addInquiry } = useCrud(inquiryEntity);

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

  const inquiryForm = useEntityForm(inquiryEntity, {
    operation: 'create',
    defaultValues: {
      [contextField]: contextId || undefined,
      date: new Date().toISOString(),
      status: 'draft',
      [messageField]: defaultMessage,
    },
  });

  // Use messagePlaceholder prop if provided, otherwise use entity's placeholder
  const messageFieldConfig = inquiryEntity.fields[messageField];
  const effectivePlaceholder =
    messagePlaceholder || messageFieldConfig?.options?.placeholder;

  const customerForm = useEntityForm(customerEntity, {
    operation: 'create',
    defaultValues: {
      type: 'Prospect',
      status: 'draft',
      [consentField]: false,
    },
  });

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (customerData: Record<string, unknown>) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      // Use form data as-is. Entity schema + ControlledGdprConsentField already enforce
      // gdprConsent: { gdprConsent: true, gdprConsentDate, gdprConsentVersion } when checked.
      const customerId = await addCustomer(customerData);

      // Get inquiry message - use as-is (already has car details as default value)
      const messageValue = inquiryForm.getValues(messageField);
      const inquiryMessage =
        typeof messageValue === 'string' ? messageValue.trim() : '';

      // If user didn't edit the default message, use it as-is
      const finalMessage =
        inquiryMessage ||
        defaultMessage ||
        inquiryT('message.default', 'General inquiry');

      // Create inquiry with customer reference (GDPR consent is on Customer, not Inquiry)
      const inquiryData = {
        customerId: customerId as string,
        [contextField]: contextId || undefined,
        [messageField]: finalMessage,
        date: new Date().toISOString(),
        status: 'draft',
      };

      await addInquiry(inquiryData);

      setStatus('success');
      customerForm.reset();
      inquiryForm.reset();
      onSuccess?.();
    } catch (err) {
      setStatus('error');
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(error.message);
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
            customerFields.includes('firstName') &&
            customerFields.includes('lastName') &&
            firstNameConfig &&
            lastNameConfig
          ) {
            return (
              <>
                <Stack direction="row">
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
                    const config = customerEntity.fields[fieldName];
                    if (!config) return null;
                    return (
                      <FormFieldRenderer
                        key={fieldName}
                        name={fieldName}
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
            const config = customerEntity.fields[fieldName];
            if (!config) return null;
            return (
              <FormFieldRenderer
                key={fieldName}
                name={fieldName}
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
            name={messageField}
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
        {customerEntity.fields[consentField] && (
          <FormFieldRenderer
            name={consentField}
            config={customerEntity.fields[consentField]}
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
