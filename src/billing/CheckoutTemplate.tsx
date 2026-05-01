'use client';
// packages/templates/src/billing/CheckoutTemplate.tsx

/**
 * @fileoverview Showcase checkout page template.
 * @description Pre-built checkout page template using framework components.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates the checkout flow.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { StripeCheckoutButton } from './billingImports';
import { Card, BUTTON_VARIANT, Stack } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import type { CheckoutMode } from '@donotdev/core';
import { useBillingVisibility, FeatureDisabled } from '@donotdev/ui';

import type { ReactNode } from 'react';

/** Props for the CheckoutPageTemplate component. */
export interface CheckoutPageTemplateProps {
  children?: ReactNode;
  priceId?: string;
  mode?: CheckoutMode;
  title?: string;
  description?: string;
  successRedirect?: string;
  cancelRedirect?: string;
  billingOptions?: {
    metadata?: Record<string, string>;
    allowPromotionCodes?: boolean;
    successUrl?: string;
    cancelUrl?: string;
  };
}

/**
 * Checkout Page Template Component
 *
 * Pre-built checkout page template using framework components
 *
 * @param props - CheckoutPageTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function CheckoutPageTemplate({
  children,
  priceId,
  mode = 'payment',
  title,
  description,
  successRedirect,
  cancelRedirect,
  billingOptions,
}: CheckoutPageTemplateProps) {
  const { shouldHide, isLoading } = useBillingVisibility();
  const { t } = useTranslation('billing');

  if (shouldHide) {
    return (
      <FeatureDisabled
        featureName="Checkout"
        title={title || t('templates.checkout.title')}
        description={t(
          'templates.checkout.notAvailable',
          'Stripe billing is not configured or available. Please contact support if you believe this is an error.'
        )}
        showContactSupport={true}
        showRetry={true}
        onRetry={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <Card className="dndev-mx-auto" style={{ maxWidth: '42rem' }}>
        <div
          className="dndev-text-center"
          style={{ paddingTop: 'var(--gap-lg)' }}
        >
          <p style={{ color: 'var(--muted-foreground)' }}>
            {t('templates.checkout.loading', 'Loading checkout...')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card className="dndev-mx-auto" style={{ maxWidth: '42rem' }}>
        <div className="dndev-text-center">
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 700,
              marginBottom: 'var(--gap-md)',
            }}
          >
            {title || t('templates.checkout.title')}
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {description || t('templates.checkout.description')}
          </p>
        </div>

        <Stack gap="large" style={{ marginTop: 'var(--gap-lg)' }}>
          {children && <div>{children}</div>}

          {priceId ? (
            <div>
              <StripeCheckoutButton
                priceId={priceId}
                mode={mode}
                successUrl={
                  billingOptions?.successUrl ||
                  successRedirect ||
                  '/billing/success'
                }
                cancelUrl={
                  billingOptions?.cancelUrl || cancelRedirect || '/checkout'
                }
                metadata={billingOptions?.metadata}
                allowPromotionCodes={billingOptions?.allowPromotionCodes}
                variant={BUTTON_VARIANT.DEFAULT}
                className="dndev-w-full"
              >
                {mode === 'payment'
                  ? t('templates.checkout.completePurchase')
                  : t('templates.checkout.startSubscription')}
              </StripeCheckoutButton>
            </div>
          ) : (
            <div className="dndev-text-center">
              <p style={{ color: 'var(--muted-foreground)' }}>
                {t(
                  'templates.checkout.noPriceId',
                  'No product selected. Please choose a product before proceeding to checkout.'
                )}
              </p>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}
