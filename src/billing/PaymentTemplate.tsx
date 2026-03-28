'use client';
// packages/templates/src/billing/PaymentTemplate.tsx

/**
 * @fileoverview Showcase payment page template.
 * @description Reusable payment page template for one-time purchases.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates the payment flow.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Stack, Grid, Text, Section } from '@donotdev/components';
import { useTranslation, maybeTranslate } from '@donotdev/core';
import type { StripeFrontConfig } from '@donotdev/core';
import {
  PageContainer,
  useBillingVisibility,
  FeatureDisabled,
} from '@donotdev/ui';

import { ProductCard, SecurityNotice } from './billingImports';

/** Props for the PaymentTemplate component. */
export interface PaymentTemplateProps {
  namespace: string;
  billing: StripeFrontConfig;
  successUrl?: string;
  cancelUrl?: string;
  title?: string;
  subtitle?: string;
  layout?: 'grid' | 'list';
}

/**
 * Payment Template - Schema-driven payment page for one-time purchases
 * Auto-renders from stripeFrontConfig with proper metadata support
 *
 * **Note:** Requires stripeFrontConfig (frontend-only, display-safe)
 * Backend hooks are defined separately in stripeBackConfig
 *
 * @param props - PaymentTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function PaymentTemplate({
  namespace,
  billing,
  successUrl,
  cancelUrl,
  title,
  subtitle,
  layout = 'grid',
}: PaymentTemplateProps) {
  const { shouldHide, isLoading } = useBillingVisibility();
  const { t } = useTranslation([namespace, 'billing']);

  // Smart translation for title/subtitle (supports both keys and plain strings)
  const displayTitle = title
    ? maybeTranslate(t, title)
    : t('billing:templates.purchase.title');
  const displaySubtitle = subtitle
    ? maybeTranslate(t, subtitle)
    : t('billing:templates.purchase.subtitle');

  if (shouldHide) {
    return (
      <PageContainer variant="standard">
        <FeatureDisabled
          featureName="Billing"
          title={displayTitle}
          description={t(
            'billing:templates.purchase.notAvailable',
            'Stripe billing is not configured or available. Please contact support if you believe this is an error.'
          )}
          showContactSupport={true}
          showRetry={true}
          onRetry={() => {
            window.location.reload();
          }}
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer variant="standard">
        <Stack align="center">
          <Text variant="muted">
            {t('billing:templates.purchase.loading', 'Loading billing...')}
          </Text>
        </Stack>
      </PageContainer>
    );
  }

  const productCount = Object.keys(billing).length;
  const gridCols = layout === 'grid' ? (productCount === 2 ? 2 : 3) : undefined;

  return (
    <PageContainer variant="standard">
      <Stack gap="large" align="center">
        {/* Header */}
        <Stack align="center">
          <Text as="h1" level="h1">
            {displayTitle}
          </Text>
          <Text as="h2" level="h2" variant="muted">
            {displaySubtitle}
          </Text>
        </Stack>

        {/* Products */}
        <Section>
          <Grid cols={gridCols} gap="large">
            {Object.entries(billing).map(([key, config]) => (
              <ProductCard
                key={key}
                namespace={namespace}
                configKey={key}
                id={key}
                name={config.name}
                price={config.price}
                currency={config.currency}
                description={config.description || ''}
                features={config.features || []}
                mode="payment"
                priceId={config.priceId}
                allowPromotionCodes={config.allowPromotionCodes ?? true}
                metadata={{
                  billingConfigKey: key,
                  productType: 'payment',
                  source: 'payment_template',
                }}
                successUrl={successUrl}
                cancelUrl={cancelUrl}
              />
            ))}
          </Grid>
        </Section>

        {/* Security Notice */}
        <SecurityNotice />
      </Stack>
    </PageContainer>
  );
}
