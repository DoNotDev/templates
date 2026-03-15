'use client';
// packages/templates/src/legal/TermsOfServiceTemplate.tsx

/**
 * @fileoverview Terms of Service Template Component
 * @description Reusable terms of service template with configurable company details and i18n support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Section, Stack } from '@donotdev/components';
import { useTranslation, formatDate } from '@donotdev/core';

import type { ComponentType } from 'react';

/**
 * Terms of Service Template Configuration
 */
export interface TermsOfServiceConfig {
  /** Company name */
  companyName: string;
  /** Company website URL */
  websiteUrl: string;
  /** Contact email for legal inquiries */
  legalEmail: string;
  /** Company address */
  companyAddress: string;
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
  /** Legal jurisdiction */
  jurisdiction?: string;
  /** Arbitration organization */
  arbitrationOrg?: string;
  /** Arbitration location */
  arbitrationLocation?: string;
  /** Section tone for background @default 'base' */
  tone?: 'ghost' | 'base' | 'muted' | 'contrast' | 'accent';
}

/**
 * Terms of Service Template Component
 *
 * Reusable terms of service template with:
 * - Configurable company details
 * - i18n support for multiple languages
 * - Modular sections that can be enabled/disabled
 * - Legal compliance and professional structure
 * - Customizable jurisdiction and arbitration details
 *
 * @param props - TermsOfServiceTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const TermsOfServiceTemplate: ComponentType<TermsOfServiceConfig> = ({
  companyName,
  websiteUrl,
  legalEmail,
  companyAddress,
  lastUpdated,
  sections = {
    children: true,
    international: true,
    california: true,
    eu: true,
  },
  contactInfo = {},
  jurisdiction = 'the United States',
  arbitrationOrg = 'American Arbitration Association',
  arbitrationLocation = 'New York, NY',
  tone = 'base',
}) => {
  const { t, i18n } = useTranslation('terms');
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
          📋 {t('title', 'Terms of Service')}
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
              'sections.introduction.govern',
              'These Terms of Service ("Terms") govern your use of our development framework, tools, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.'
            )}
          </p>
          <p>
            {t(
              'sections.introduction.organization',
              'If you are using our Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. If you do not agree to these Terms, please do not use our Service.'
            )}
          </p>
        </section>

        {/* Service Description */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.service.title', '2. Service Description')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {companyName}{' '}
            {t(
              'sections.service.description',
              'is a comprehensive development framework that provides tools, components, and infrastructure for building modern web applications. Our Service includes:'
            )}
          </p>
          <ul
            className="dndev-grid dndev-gap-sm"
            style={{
              listStyleType: 'disc',
              paddingInlineStart: '1.5rem',
            }}
          >
            <li>
              {t(
                'sections.service.framework',
                'Development framework and libraries'
              )}
            </li>
            <li>
              {t('sections.service.ui', 'UI components and design system')}
            </li>
            <li>
              {t(
                'sections.service.auth',
                'Authentication and authorization services'
              )}
            </li>
            <li>
              {t(
                'sections.service.i18n',
                'Internationalization and localization tools'
              )}
            </li>
            <li>
              {t(
                'sections.service.billing',
                'Billing and subscription management'
              )}
            </li>
            <li>
              {t(
                'sections.service.docs',
                'Documentation and support resources'
              )}
            </li>
          </ul>
        </section>

        {/* Account Registration */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t(
              'sections.account.title',
              '3. Account Registration and Security'
            )}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.account.creation.title', '3.1 Account Creation')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.account.creation.desc',
              'To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.account.security.title', '3.2 Account Security')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.account.security.desc',
              'You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.account.eligibility.title', '3.3 Account Eligibility')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.account.eligibility.desc',
              'You must be at least 13 years old to use our Service. If you are under 18, you must have parental or guardian consent to use our Service.'
            )}
          </p>
        </section>

        {/* Acceptable Use */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.acceptable.title', '4. Acceptable Use Policy')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.acceptable.intro',
              'You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:'
            )}
          </p>

          <ul
            className="dndev-grid dndev-gap-sm"
            style={{
              listStyleType: 'disc',
              paddingInlineStart: '1.5rem',
            }}
          >
            <li>
              {t(
                'sections.acceptable.laws',
                'Use the Service to violate any applicable laws or regulations'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.infringe',
                'Infringe upon the intellectual property rights of others'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.harmful',
                'Transmit harmful, offensive, or inappropriate content'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.unauthorized',
                "Attempt to gain unauthorized access to our systems or other users' accounts"
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.spam',
                'Use the Service for spam, phishing, or other malicious activities'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.disrupt',
                'Interfere with or disrupt the Service or servers'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.reverse',
                'Reverse engineer, decompile, or disassemble our software'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.automated',
                'Use automated systems to access the Service without permission'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.share',
                'Share your account credentials with others'
              )}
            </li>
            <li>
              {t(
                'sections.acceptable.competing',
                'Use the Service to build competing products or services'
              )}
            </li>
          </ul>
        </section>

        {/* Subscription and Payment */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.payment.title', '5. Subscription and Payment Terms')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.payment.plans.title', '5.1 Subscription Plans')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.payment.plans.desc',
              'We offer various subscription plans with different features and pricing. Subscription details, including pricing and features, are available on our website and may be updated from time to time.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.payment.processing.title', '5.2 Payment Processing')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.payment.processing.desc',
              'Payments are processed through secure third-party payment processors. You authorize us to charge your payment method for all fees associated with your subscription.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.payment.billing.title', '5.3 Billing and Renewal')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.payment.billing.desc',
              'Subscriptions automatically renew unless cancelled before the renewal date. You will be charged the applicable subscription fee on each renewal date.'
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
              'sections.payment.refunds.title',
              '5.4 Refunds and Cancellation'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.payment.refunds.desc',
              'You may cancel your subscription at any time through your account settings. Refunds are provided in accordance with our refund policy, which may vary by plan and usage.'
            )}
          </p>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.ip.title', '6. Intellectual Property Rights')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.ip.ours.title', '6.1 Our Intellectual Property')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.ip.ours.desc',
              'The Service, including all software, content, and materials, is owned by us or our licensors and is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.ip.yours.title', '6.2 Your Content')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.ip.yours.desc',
              'You retain ownership of any content you create using our Service. You grant us a license to use, store, and process your content solely to provide and improve our Service.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.ip.opensource.title', '6.3 Open Source Components')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.ip.opensource.desc',
              'Our Service may include open source software components. The use of such components is subject to their respective open source licenses.'
            )}
          </p>
        </section>

        {/* Privacy and Data */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.privacy.title', '7. Privacy and Data Protection')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.privacy.desc',
              'Your privacy is important to us. Our collection and use of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.'
            )}
          </p>
        </section>

        {/* Service Availability */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t(
              'sections.availability.title',
              '8. Service Availability and Support'
            )}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.availability.service.title',
              '8.1 Service Availability'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.availability.service.desc',
              'We strive to maintain high service availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or other factors beyond our control.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.availability.support.title', '8.2 Support Services')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.availability.support.desc',
              'Support availability varies by subscription plan. We provide support through documentation, community forums, and direct support channels as specified in your plan.'
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
              'sections.availability.updates.title',
              '8.3 Updates and Changes'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.availability.updates.desc',
              'We may update the Service from time to time to improve functionality, security, or user experience. We will provide reasonable notice of significant changes that may affect your use of the Service.'
            )}
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.termination.title', '9. Termination and Suspension')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.termination.you.title', '9.1 Termination by You')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.termination.you.desc',
              'You may terminate your account at any time by cancelling your subscription and deleting your account through your account settings.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.termination.us.title', '9.2 Termination by Us')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.termination.us.desc',
              'We may terminate or suspend your account immediately if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion.'
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
              'sections.termination.effect.title',
              '9.3 Effect of Termination'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.termination.effect.desc',
              'Upon termination, your right to use the Service ceases immediately. We may delete your account data in accordance with our data retention policies.'
            )}
          </p>
        </section>

        {/* Disclaimers */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.disclaimers.title', '10. Disclaimers and Limitations')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t(
              'sections.disclaimers.service.title',
              '10.1 Service Disclaimers'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.disclaimers.service.desc',
              'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.'
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
              'sections.disclaimers.liability.title',
              '10.2 Limitation of Liability'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.disclaimers.liability.desc',
              'TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, INCURRED BY YOU OR ANY THIRD PARTY.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.disclaimers.maximum.title', '10.3 Maximum Liability')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.disclaimers.maximum.desc',
              'OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM.'
            )}
          </p>
        </section>

        {/* Indemnification */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.indemnification.title', '11. Indemnification')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.indemnification.desc',
              'You agree to indemnify, defend, and hold harmless us and our officers, directors, employees, and agents from and against any claims, damages, losses, and expenses arising out of or relating to your use of the Service or violation of these Terms.'
            )}
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t(
              'sections.governing.title',
              '12. Governing Law and Dispute Resolution'
            )}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.governing.law.title', '12.1 Governing Law')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.governing.law.desc',
              'These Terms are governed by and construed in accordance with the laws of'
            )}{' '}
            {jurisdiction},{' '}
            {t(
              'sections.governing.law.without',
              'without regard to its conflict of law principles.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.governing.dispute.title', '12.2 Dispute Resolution')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.governing.dispute.desc',
              'Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of'
            )}{' '}
            {arbitrationOrg}.{' '}
            {t(
              'sections.governing.dispute.location',
              'The arbitration shall be conducted in'
            )}{' '}
            {arbitrationLocation}.
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.governing.class.title', '12.3 Class Action Waiver')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.governing.class.desc',
              'You agree that any arbitration or legal proceeding will be conducted on an individual basis and not as a class action or representative action.'
            )}
          </p>
        </section>

        {/* Miscellaneous */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.miscellaneous.title', '13. Miscellaneous')}
          </h2>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.miscellaneous.entire.title', '13.1 Entire Agreement')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.miscellaneous.entire.desc',
              'These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior agreements and understandings.'
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
              'sections.miscellaneous.severability.title',
              '13.2 Severability'
            )}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.miscellaneous.severability.desc',
              'If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.miscellaneous.waiver.title', '13.3 Waiver')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.miscellaneous.waiver.desc',
              'Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.miscellaneous.assignment.title', '13.4 Assignment')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.miscellaneous.assignment.desc',
              'You may not assign or transfer your rights or obligations under these Terms without our written consent. We may assign these Terms without restriction.'
            )}
          </p>

          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 500,
              marginBottom: '0.75rem',
            }}
          >
            {t('sections.miscellaneous.force.title', '13.5 Force Majeure')}
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.miscellaneous.force.desc',
              'We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to natural disasters, war, terrorism, or government actions.'
            )}
          </p>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('sections.changes.title', '14. Changes to These Terms')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.changes.desc',
              'We may update these Terms from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated Terms on our website and updating the "Last updated" date.'
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
            {t('sections.contact.title', '15. Contact Us')}
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            {t(
              'sections.contact.intro',
              'If you have any questions about these Terms of Service, please contact us:'
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
              {legalEmail}
            </p>
            <p>
              <strong>{t('sections.contact.address', 'Address')}:</strong>{' '}
              {companyAddress}
            </p>
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
          {t('footer.effective', 'These Terms of Service are effective as of')}{' '}
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
