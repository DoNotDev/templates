'use client';
// packages/templates/src/billing/SubscriptionTemplate.tsx

/**
 * @fileoverview Subscription page template.
 * @description Reusable subscription page template with flexible tier support.
 * Uses framework components exclusively — no raw HTML.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';

import { ProductCard } from './billingImports';
import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_VARIANT,
  CallToAction,
  Grid,
  HeroSection,
  Section,
  Stack,
  Switch,
  Text,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import type { StripeFrontConfig } from '@donotdev/core';
import {
  PageContainer,
  useBillingVisibility,
  FeatureDisabled,
} from '@donotdev/ui';

/**
 * Subscription plan type
 * Extends StripeFrontConfig product structure with subscription-specific fields
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export type SubscriptionPlan = StripeFrontConfig[string] & {
  id: string;
  interval: 'month' | 'year';
  popular?: boolean;
  metadata?: Record<string, string>;
};

/**
 * Props for SubscriptionTemplate component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export interface SubscriptionTemplateProps {
  namespace: string;
  plans: SubscriptionPlan[];
  successUrl?: string;
  cancelUrl?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Subscription Template - Flexible subscription page for any number of tiers
 *
 * **Supports any tier structure:**
 * - 1 tier: Single plan (e.g., Pro only)
 * - 2 tiers: Free + Pro
 * - 3 tiers: Free + Pro + Premium (optimized layout)
 * - 4+ tiers: Enterprise plans, family plans, etc.
 *
 * Grid automatically adjusts for optimal display at all screen sizes.
 *
 * @example
 * ```typescript
 * // 3-tier SaaS (classic)
 * <SubscriptionTemplate plans={[free, pro, premium]} />
 *
 * // 2-tier simple
 * <SubscriptionTemplate plans={[free, pro]} />
 *
 * // 4+ tiers
 * <SubscriptionTemplate plans={[free, starter, pro, premium, enterprise]} />
 * ```
 *
 * @param props - SubscriptionTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function SubscriptionTemplate({
  namespace,
  plans,
  successUrl = '/billing/success',
  cancelUrl = '/subscription',
  title,
  subtitle,
}: SubscriptionTemplateProps) {
  const { shouldHide, isLoading } = useBillingVisibility();
  const { t } = useTranslation([namespace, 'billing']);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>(
    'year'
  );

  if (shouldHide) {
    return (
      <PageContainer variant="standard">
        <FeatureDisabled
          featureName="Subscriptions"
          title={title || t('billing:templates.subscription.title')}
          description={t(
            'billing:templates.subscription.notAvailable',
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
        <Stack align="center" gap="medium">
          <Text variant="muted" textAlign="center">
            {t(
              'billing:templates.subscription.loading',
              'Loading subscriptions...'
            )}
          </Text>
        </Stack>
      </PageContainer>
    );
  }

  // Filter plans by billing interval
  const filteredPlans = plans.filter(
    (plan) => plan.interval === billingInterval
  );

  // Auto-responsive grid based on plan count
  const getGridProps = () => {
    const count = filteredPlans.length;
    if (count === 1)
      return { cols: 1 as const, className: 'dndev-max-w-md dndev-mx-auto' };
    if (count === 2)
      return {
        cols: 2 as const,
        className: 'dndev-max-w-4xl dndev-mx-auto dndev-grid-responsive-1-2',
      };
    if (count === 3)
      return { cols: 3 as const, className: 'dndev-grid-responsive-1-3' };
    if (count === 4)
      return { cols: 4 as const, className: 'dndev-grid-responsive-1-2-4' };
    // 5+ plans: responsive grid
    return { cols: 4 as const, className: 'dndev-grid-responsive-1-2-3-4' };
  };

  return (
    <PageContainer variant="standard">
      {/* Header */}
      <HeroSection
        title={title || t('billing:templates.subscription.title')}
        subtitle={subtitle || t('billing:templates.subscription.subtitle')}
      >
        {/* Billing Toggle */}
        <Stack direction="row" align="center" justify="center">
          <Text
            as="span"
            level="small"
            weight="medium"
            variant={billingInterval === 'month' ? 'primary' : 'muted'}
          >
            {t('billing:templates.subscription.billingToggle.monthly')}
          </Text>
          <Switch
            checked={billingInterval === 'year'}
            onCheckedChange={(checked) =>
              setBillingInterval(checked ? 'year' : 'month')
            }
            aria-label={t(
              'billing:templates.subscription.billingToggle.ariaLabel',
              'Toggle billing interval'
            )}
          />
          <Text
            as="span"
            level="small"
            weight="medium"
            variant={billingInterval === 'year' ? 'primary' : 'muted'}
          >
            {t('billing:templates.subscription.billingToggle.yearly')}
            <Badge
              variant={BADGE_VARIANT.SECONDARY}
              as="span"
              style={{ marginInlineStart: '0.5rem' }}
            >
              {t('billing:templates.subscription.billingToggle.save20')}
            </Badge>
          </Text>
        </Stack>
      </HeroSection>

      {/* Plans Grid - Auto-responsive based on plan count */}
      <Section tone="muted">
        {filteredPlans.length === 0 ? (
          <Stack align="center" gap="medium">
            <Text variant="muted" textAlign="center">
              {t(
                'billing:templates.subscription.noPlans',
                'No plans available for this billing period.'
              )}
            </Text>
          </Stack>
        ) : (
          (() => {
            const gridProps = getGridProps();
            return (
              <Grid cols={gridProps.cols} className={gridProps.className}>
                {filteredPlans.map((plan) => (
                  <ProductCard
                    key={plan.id}
                    namespace={namespace}
                    configKey={plan.id}
                    id={plan.id}
                    name={plan.name}
                    price={plan.price}
                    currency={plan.currency}
                    description={plan.description ?? ''}
                    features={plan.features ?? []}
                    popular={plan.popular}
                    mode="subscription"
                    priceId={plan.priceId}
                    metadata={{
                      billingConfigKey: plan.id,
                      planId: plan.id,
                      planName: plan.name,
                      billingInterval: plan.interval,
                      productType: 'subscription',
                      source: 'subscription_template',
                      ...plan.metadata,
                    }}
                    successUrl={successUrl}
                    cancelUrl={cancelUrl}
                    allowPromotionCodes={true}
                  />
                ))}
              </Grid>
            );
          })()
        )}
      </Section>

      {/* Footer CTA */}
      <CallToAction
        tone="ghost"
        title={t('billing:templates.subscription.cta.title', 'Have questions?')}
        subtitle={t(
          'billing:templates.subscription.cta.subtitle',
          'Our team is here to help you choose the right plan.'
        )}
        primaryAction={
          <Button variant={BUTTON_VARIANT.OUTLINE}>
            {t('billing:templates.subscription.cta.action', 'Contact Us')}
          </Button>
        }
      />
    </PageContainer>
  );
}
