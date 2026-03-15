'use client';
// packages/templates/src/billing/UserSubscriptionTemplate.tsx

/**
 * @fileoverview User Subscription Template
 * @description Complete subscription management page template
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { SubscriptionManager } from './billingImports';
import { useTranslation } from '@donotdev/core';
import type { PageMeta } from '@donotdev/core';
import { PageContainer } from '@donotdev/ui';

export interface UserSubscriptionTemplateProps {
  namespace: string;
  meta?: PageMeta;
  availablePlans?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    priceId: string;
    billingConfigKey: string;
  }>;
  allowPlanChange?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * User Subscription Template Component
 *
 * Complete subscription management page template
 *
 * @param props - UserSubscriptionTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function UserSubscriptionTemplate({
  namespace,
  meta,
  availablePlans,
  allowPlanChange = false,
  title,
  subtitle,
}: UserSubscriptionTemplateProps) {
  const { t } = useTranslation([namespace, 'billing']);

  return (
    <PageContainer variant="docs">
      <div>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            {title || t('billing:subscription.title')}
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {subtitle || t('billing:subscription.subtitle')}
          </p>
        </div>

        {/* Subscription Manager */}
        <SubscriptionManager
          availablePlans={availablePlans}
          allowPlanChange={allowPlanChange}
        />
      </div>
    </PageContainer>
  );
}
