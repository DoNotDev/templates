'use client';
// packages/templates/src/legal/PrivacyPolicyTemplate.tsx

/**
 * @fileoverview Privacy Policy Template Component
 * @description Reusable privacy policy template with configurable company details and i18n support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { List, Section, Stack } from '@donotdev/components';
import { useTranslation, formatDate } from '@donotdev/core';

import type { ComponentType } from 'react';

/**
 * Privacy Policy Template Configuration
 */
export interface PrivacyPolicyConfig {
  /** Company name */
  companyName: string;
  /** Company website URL */
  websiteUrl: string;
  /** Contact email for privacy inquiries */
  privacyEmail: string;
  /** Company address */
  companyAddress: string;
  /** Data Protection Officer email */
  dpoEmail?: string;
  /** Last updated date as ISO string (defaults to current date) */
  lastUpdated?: string;
  /** Custom sections to include/exclude */
  sections?: {
    children?: boolean;
    international?: boolean;
    california?: boolean;
    eu?: boolean;
  };
  /** Custom contact information */
  contactInfo?: {
    phone?: string;
    supportEmail?: string;
  };
  /** Section tone for background @default 'base' */
  tone?: 'ghost' | 'base' | 'muted' | 'contrast' | 'accent';
}

/**
 * Privacy Policy Template Component
 *
 * Reusable privacy policy template with:
 * - Configurable company details
 * - i18n support for multiple languages
 * - Modular sections that can be enabled/disabled
 * - Legal compliance (GDPR, CCPA, etc.)
 * - Professional formatting and structure
 *
 * @param props - PrivacyPolicyTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const PrivacyPolicyTemplate: ComponentType<PrivacyPolicyConfig> = ({
  companyName,
  websiteUrl,
  privacyEmail,
  companyAddress,
  dpoEmail,
  lastUpdated,
  sections = {
    children: true,
    international: true,
    california: true,
    eu: true,
  },
  contactInfo = {},
  tone = 'base',
}) => {
  const { t, i18n } = useTranslation('privacy');
  const formattedDate = formatDate(lastUpdated, i18n?.language || 'en');

  return (
    <Section tone={tone} textAlign="start">
      <div className="dndev-text-center" style={{ marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          🔒 {t('title', 'Privacy Policy')}
        </h1>
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--muted-foreground)',
          }}
        >
          {t('lastUpdated', 'Last updated')}: {formattedDate}
        </p>
      </div>

      <Stack gap="large">
        {/* Introduction */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.introduction.title', '1. Introduction')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t('sections.introduction.welcome', 'Welcome to')} {companyName} ("
            {t('common.we', 'we')}," "{t('common.our', 'our')},"{' '}
            {t('common.or', 'or')} "{t('common.us', 'us')}").{' '}
            {t(
              'sections.introduction.commitment',
              'We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our development framework, tools, and services.'
            )}
          </p>
          <p>
            {t('sections.introduction.agreement', 'By using')} {companyName},{' '}
            {t(
              'sections.introduction.agree',
              'you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.'
            )}
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.collection.title', '2. Information We Collect')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.collection.provided.title',
              '2.1 Information You Provide'
            )}
          </h3>
          <List
            items={[
              <strong key="account">
                {t(
                  'sections.collection.provided.accountDesc',
                  'Name, email address, password, and profile information when you create an account'
                )}
              </strong>,
              <>
                <strong>
                  {t('sections.collection.provided.usage', 'Usage Data')}:
                </strong>{' '}
                {t(
                  'sections.collection.provided.usageDesc',
                  'Information about how you use our services, including features accessed and time spent'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.collection.provided.communication',
                    'Communication'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.provided.communicationDesc',
                  'Messages, feedback, and support requests you send to us'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.collection.provided.payment',
                    'Payment Information'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.provided.paymentDesc',
                  'Billing details and payment method information for premium features'
                )}
              </>,
              <>
                <strong>
                  {t('sections.collection.provided.project', 'Project Data')}:
                </strong>{' '}
                {t(
                  'sections.collection.provided.projectDesc',
                  'Code, configurations, and project files you create using our framework'
                )}
              </>,
            ]}
            style={{
              paddingInlineStart: '1.5rem',
              marginBottom: '1rem',
            }}
          />

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.collection.automatic.title',
              '2.2 Automatically Collected Information'
            )}
          </h3>
          <List
            items={[
              <>
                <strong>
                  {t(
                    'sections.collection.automatic.device',
                    'Device Information'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.automatic.deviceDesc',
                  'IP address, browser type, operating system, and device identifiers'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.collection.automatic.analytics',
                    'Usage Analytics'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.automatic.analyticsDesc',
                  'Pages visited, features used, and interaction patterns'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.collection.automatic.performance',
                    'Performance Data'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.automatic.performanceDesc',
                  'Error logs, performance metrics, and system diagnostics'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.collection.automatic.cookies',
                    'Cookies and Tracking'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.collection.automatic.cookiesDesc',
                  'Small data files stored on your device to improve your experience'
                )}
              </>,
            ]}
            style={{
              paddingInlineStart: '1.5rem',
              marginBottom: '1rem',
            }}
          />
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.usage.title', '3. How We Use Your Information')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t('sections.usage.intro', 'We use the information we collect to:')}
          </p>
          <List
            items={[
              t(
                'sections.usage.provide',
                'Provide, maintain, and improve our services'
              ),
              t(
                'sections.usage.process',
                'Process transactions and manage your account'
              ),
              t(
                'sections.usage.send',
                'Send you important updates, security alerts, and support messages'
              ),
              t(
                'sections.usage.respond',
                'Respond to your comments, questions, and support requests'
              ),
              t(
                'sections.usage.analyze',
                'Analyze usage patterns to enhance user experience'
              ),
              t(
                'sections.usage.detect',
                'Detect and prevent fraud, abuse, and security threats'
              ),
              t(
                'sections.usage.comply',
                'Comply with legal obligations and enforce our terms'
              ),
              t(
                'sections.usage.develop',
                'Develop new features and services based on user feedback'
              ),
            ]}
            style={{
              paddingInlineStart: '1.5rem',
            }}
          />
        </section>

        {/* Information Sharing */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t(
              'sections.sharing.title',
              '4. Information Sharing and Disclosure'
            )}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.sharing.intro',
              'We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.sharing.providers.title', '4.1 Service Providers')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.sharing.providers.intro',
              'We may share information with trusted third-party service providers who assist us in operating our platform, such as:'
            )}
          </p>
          <List
            items={[
              t(
                'sections.sharing.providers.hosting',
                'Cloud hosting and infrastructure providers'
              ),
              t(
                'sections.sharing.providers.payment',
                'Payment processors for billing and transactions'
              ),
              t(
                'sections.sharing.providers.analytics',
                'Analytics and monitoring services'
              ),
              t(
                'sections.sharing.providers.support',
                'Customer support and communication tools'
              ),
            ]}
            style={{
              paddingInlineStart: '1.5rem',
              marginBottom: '1rem',
            }}
          />

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.sharing.legal.title', '4.2 Legal Requirements')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.sharing.legal.desc',
              'We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.sharing.business.title', '4.3 Business Transfers')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.sharing.business.desc',
              'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.'
            )}
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.security.title', '5. Data Security')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.security.intro',
              'We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:'
            )}
          </p>
          <List
            items={[
              t(
                'sections.security.encryption',
                'Encryption of data in transit and at rest'
              ),
              t(
                'sections.security.assessments',
                'Regular security assessments and updates'
              ),
              t(
                'sections.security.access',
                'Access controls and authentication mechanisms'
              ),
              t(
                'sections.security.training',
                'Employee training on data protection practices'
              ),
              t(
                'sections.security.incident',
                'Incident response and breach notification procedures'
              ),
            ]}
            style={{
              paddingInlineStart: '1.5rem',
            }}
          />
        </section>

        {/* Data Retention */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.retention.title', '6. Data Retention')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.retention.intro',
              'We retain your information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. The retention period varies based on the type of information:'
            )}
          </p>
          <List
            items={[
              <>
                <strong>
                  {t('sections.retention.account', 'Account Information')}:
                </strong>{' '}
                {t(
                  'sections.retention.accountDesc',
                  'Retained while your account is active and for a reasonable period after deletion'
                )}
              </>,
              <>
                <strong>{t('sections.retention.usage', 'Usage Data')}:</strong>{' '}
                {t(
                  'sections.retention.usageDesc',
                  'Retained for analytics and service improvement purposes'
                )}
              </>,
              <>
                <strong>
                  {t('sections.retention.payment', 'Payment Information')}:
                </strong>{' '}
                {t(
                  'sections.retention.paymentDesc',
                  'Retained as required by financial regulations'
                )}
              </>,
              <>
                <strong>
                  {t(
                    'sections.retention.communication',
                    'Communication Records'
                  )}
                  :
                </strong>{' '}
                {t(
                  'sections.retention.communicationDesc',
                  'Retained for customer support and legal compliance'
                )}
              </>,
            ]}
            style={{
              paddingInlineStart: '1.5rem',
            }}
          />
        </section>

        {/* Your Rights */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.rights.title', '7. Your Rights and Choices')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.intro',
              'Depending on your location, you may have the following rights regarding your personal information:'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.rights.access.title', '7.1 Access and Portability')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.access.desc',
              'You can request access to your personal information and receive a copy in a portable format.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.rights.correction.title', '7.2 Correction and Update')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.correction.desc',
              'You can request correction of inaccurate or incomplete information.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.rights.deletion.title', '7.3 Deletion')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.deletion.desc',
              'You can request deletion of your personal information, subject to legal requirements.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.rights.restriction.title',
              '7.4 Restriction and Objection'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.restriction.desc',
              'You can request restriction of processing or object to certain uses of your information.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.rights.marketing.title',
              '7.5 Marketing Communications'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.rights.marketing.desc',
              'You can opt out of marketing communications at any time using the unsubscribe link or contacting us directly.'
            )}
          </p>
        </section>

        {/* Cookies and Tracking */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t(
              'sections.cookies.title',
              '8. Cookies and Tracking Technologies'
            )}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.cookies.intro',
              'We use cookies and similar tracking technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.cookies.types.title', '8.1 Types of Cookies We Use')}
          </h3>
          <List
            items={[
              <>
                <strong>
                  {t('sections.cookies.types.essential', 'Essential Cookies')}:
                </strong>{' '}
                {t(
                  'sections.cookies.types.essentialDesc',
                  'Required for basic functionality and security'
                )}
              </>,
              <>
                <strong>
                  {t('sections.cookies.types.analytics', 'Analytics Cookies')}:
                </strong>{' '}
                {t(
                  'sections.cookies.types.analyticsDesc',
                  'Help us understand how visitors use our platform'
                )}
              </>,
              <>
                <strong>
                  {t('sections.cookies.types.functional', 'Functional Cookies')}
                  :
                </strong>{' '}
                {t(
                  'sections.cookies.types.functionalDesc',
                  'Remember your preferences and settings'
                )}
              </>,
              <>
                <strong>
                  {t('sections.cookies.types.marketing', 'Marketing Cookies')}:
                </strong>{' '}
                {t(
                  'sections.cookies.types.marketingDesc',
                  'Used for targeted advertising and content'
                )}
              </>,
            ]}
            style={{
              paddingInlineStart: '1.5rem',
            }}
          />
        </section>

        {/* International Transfers */}
        {sections.international && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t(
                'sections.international.title',
                '9. International Data Transfers'
              )}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t(
                'sections.international.desc',
                'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.'
              )}
            </p>
          </section>
        )}

        {/* Children's Privacy */}
        {sections.children && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t('sections.children.title', "10. Children's Privacy")}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t(
                'sections.children.desc',
                'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.'
              )}
            </p>
          </section>
        )}

        {/* Changes to Privacy Policy */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.changes.title', '11. Changes to This Privacy Policy')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.changes.desc',
              'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.'
            )}
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.contact.title', '12. Contact Us')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.contact.intro',
              'If you have any questions about this Privacy Policy or our data practices, please contact us:'
            )}
          </p>
          <div
            className="dndev-grid dndev-gap-sm"
            style={{
              backgroundColor:
                'color-mix(in oklab, var(--muted) 50%, transparent)',
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p>
              <strong>{t('sections.contact.email', 'Email')}:</strong>{' '}
              {privacyEmail}
            </p>
            <p>
              <strong>{t('sections.contact.address', 'Address')}:</strong>{' '}
              {companyAddress}
            </p>
            {dpoEmail && (
              <p>
                <strong>
                  {t('sections.contact.dpo', 'Data Protection Officer')}:
                </strong>{' '}
                {dpoEmail}
              </p>
            )}
            {contactInfo.phone && (
              <p>
                <strong>{t('sections.contact.phone', 'Phone')}:</strong>{' '}
                {contactInfo.phone}
              </p>
            )}
            {contactInfo.supportEmail && (
              <p>
                <strong>
                  {t('sections.contact.support', 'Support Email')}:
                </strong>{' '}
                {contactInfo.supportEmail}
              </p>
            )}
          </div>
        </section>

        {/* Legal Basis for EU Users */}
        {sections.eu && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t(
                'sections.eu.title',
                '13. Legal Basis for Processing (EU Users)'
              )}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t(
                'sections.eu.intro',
                'For users in the European Union, our legal basis for processing your personal information includes:'
              )}
            </p>
            <List
              items={[
                <>
                  <strong>{t('sections.eu.consent', 'Consent')}:</strong>{' '}
                  {t(
                    'sections.eu.consentDesc',
                    'When you explicitly agree to our processing'
                  )}
                </>,
                <>
                  <strong>
                    {t('sections.eu.contract', 'Contract Performance')}:
                  </strong>{' '}
                  {t(
                    'sections.eu.contractDesc',
                    'To provide our services under our terms'
                  )}
                </>,
                <>
                  <strong>
                    {t('sections.eu.legitimate', 'Legitimate Interest')}:
                  </strong>{' '}
                  {t(
                    'sections.eu.legitimateDesc',
                    'To improve our services and prevent fraud'
                  )}
                </>,
                <>
                  <strong>{t('sections.eu.legal', 'Legal Obligation')}:</strong>{' '}
                  {t(
                    'sections.eu.legalDesc',
                    'To comply with applicable laws and regulations'
                  )}
                </>,
              ]}
              style={{
                paddingInlineStart: '1.5rem',
              }}
            />
          </section>
        )}

        {/* California Privacy Rights */}
        {sections.california && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t(
                'sections.california.title',
                '14. California Privacy Rights (CCPA)'
              )}
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              {t(
                'sections.california.desc',
                'California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and how we use it, the right to delete personal information, and the right to opt out of the sale of personal information.'
              )}
            </p>
          </section>
        )}
      </Stack>

      <div
        className="dndev-text-center"
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--muted-foreground)',
        }}
      >
        <p>
          {t('footer.effective', 'This Privacy Policy is effective as of')}{' '}
          {formattedDate}{' '}
          {t(
            'footer.remain',
            'and will remain in effect except with respect to any changes in its provisions in the future.'
          )}
        </p>
      </div>
    </Section>
  );
};
