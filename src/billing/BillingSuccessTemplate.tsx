'use client';
// packages/templates/src/billing/BillingSuccessTemplate.tsx

/**
 * @fileoverview Showcase billing success page template.
 * @description Post-purchase success page with subscription confirmation.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates the billing success flow.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

import {
  Card,
  Button,
  BUTTON_VARIANT,
  Stack,
  Grid,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import {
  PageContainer,
  useNavigate,
  useAuthSafe,
  useBillingVisibility,
  FeatureDisabled,
} from '@donotdev/ui';

/** Props for the BillingSuccessTemplate component. */
export interface BillingSuccessTemplateProps {
  namespace: string;
  title?: string;
  subtitle?: string;
  nextSteps?: Array<{
    title: string;
    description: string;
    link?: string;
    linkText?: string;
  }>;
  supportEmail?: string;
}

/**
 * Billing Success Template - Post-purchase confirmation page
 * Shows subscription status and next steps
 *
 * @param props - BillingSuccessTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function BillingSuccessTemplate({
  namespace,
  title,
  subtitle,
  nextSteps = [],
  supportEmail = 'support@example.com',
}: BillingSuccessTemplateProps) {
  const { shouldHide } = useBillingVisibility();
  const { t } = useTranslation([namespace, 'billing']);
  const userSubscription = useAuthSafe('userSubscription');
  const navigate = useNavigate();

  if (shouldHide) {
    return (
      <PageContainer variant="docs">
        <FeatureDisabled
          featureName="Billing Success"
          title={
            title || t('billing:templates.success.title', 'Payment Successful!')
          }
          description={t(
            'billing:templates.success.notAvailable',
            'Billing is not configured or available. Please contact support if you believe this is an error.'
          )}
          showContactSupport={true}
          supportEmail={supportEmail}
        />
      </PageContainer>
    );
  }

  const subscription = userSubscription;
  const hasActiveSubscription = subscription?.status === 'active';

  return (
    <PageContainer variant="docs">
      <div>
        {/* Success Header */}
        <div
          className="dndev-text-center"
          style={{ marginBottom: 'var(--gap-lg)' }}
        >
          <Stack
            align="center"
            justify="center"
            style={{ marginBottom: 'var(--gap-md)' }}
          >
            {hasActiveSubscription ? (
              <CheckCircle
                style={{
                  width: '4rem',
                  height: '4rem',
                  color: 'var(--success)',
                }}
              />
            ) : (
              <AlertCircle
                style={{
                  width: '4rem',
                  height: '4rem',
                  color: 'var(--warning)',
                }}
              />
            )}
          </Stack>
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 700,
              marginBottom: 'var(--gap-md)',
            }}
          >
            {title ||
              t('billing:templates.success.title', 'Payment Successful!')}
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--muted-foreground)',
            }}
          >
            {subtitle ||
              t(
                'billing:templates.success.subtitle',
                'Thank you for your purchase'
              )}
          </p>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <Card style={{ marginBottom: 'var(--gap-lg)' }}>
            <div>
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--gap-md)',
                }}
              >
                {t(
                  'billing:templates.success.subscriptionDetails',
                  'Subscription Details'
                )}
              </h2>
              <Stack>
                <Grid cols={2} className="dndev-grid-responsive-1-2">
                  <div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {t('billing:templates.success.plan', 'Plan')}
                    </p>
                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {subscription.tier}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {t('billing:templates.success.status', 'Status')}
                    </p>
                    <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {subscription.status}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {subscription.status === 'active'
                        ? t(
                            'billing:templates.success.validUntil',
                            'Valid Until'
                          )
                        : t('billing:templates.success.endedOn', 'Ended On')}
                    </p>
                    <p style={{ fontWeight: 600 }}>
                      {(() => {
                        if (subscription.subscriptionEnd == null) {
                          return t(
                            'billing:templates.success.lifetime',
                            'Lifetime'
                          );
                        }
                        const date = new Date(subscription.subscriptionEnd);
                        if (isNaN(date.getTime())) {
                          return t(
                            'billing:templates.success.dateUnavailable',
                            'Date unavailable'
                          );
                        }
                        return date.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </Grid>
              </Stack>
            </div>
          </Card>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <Card style={{ marginBottom: 'var(--gap-lg)' }}>
            <div>
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 600,
                  marginBottom: 'var(--gap-md)',
                }}
              >
                {t('billing:templates.success.whatsNext', "What's Next?")}
              </h2>
              <Stack as="ul">
                {nextSteps.map((step) => (
                  <Stack as="li" key={step.title} direction="row" align="start">
                    <CheckCircle
                      className="dndev-size-md"
                      style={{
                        color: 'var(--success)',
                        marginInlineEnd: 'var(--gap-md)',
                        marginTop: '0.125rem',
                        flexShrink: 0,
                      }}
                    />
                    <div className="dndev-flex-1">
                      <p style={{ fontWeight: 600 }}>{step.title}</p>
                      <p
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        {step.description}
                      </p>
                      {step.link && (
                        <Button
                          variant={BUTTON_VARIANT.LINK}
                          style={{
                            padding: 0,
                            height: 'auto',
                            marginTop: 'var(--gap-sm)',
                          }}
                          onClick={() => {
                            try {
                              const url = new URL(
                                step.link!,
                                window.location.origin
                              );
                              if (
                                url.protocol === 'http:' ||
                                url.protocol === 'https:'
                              ) {
                                window.open(
                                  url.href,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }
                            } catch {
                              // Invalid URL — do not open
                            }
                          }}
                          icon={ExternalLink}
                        >
                          {step.linkText ||
                            t(
                              'billing:templates.success.learnMore',
                              'Learn more'
                            )}
                        </Button>
                      )}
                    </div>
                  </Stack>
                ))}
              </Stack>
            </div>
          </Card>
        )}

        {/* Support Notice */}
        <Card>
          <div
            className="dndev-text-center"
            style={{ paddingTop: 'var(--gap-lg)' }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--muted-foreground)',
              }}
            >
              {t(
                'billing:templates.success.needHelp',
                'Need help? Contact us at'
              )}{' '}
              <a
                href={`mailto:${supportEmail}`}
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'underline',
                }}
              >
                {supportEmail}
              </a>
            </p>
          </div>
        </Card>

        {/* CTA Button */}
        <div
          className="dndev-text-center"
          style={{ marginTop: 'var(--gap-lg)' }}
        >
          <Button onClick={() => navigate('/')}>
            {t('billing:templates.success.goToDashboard', 'Go to Dashboard')}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
