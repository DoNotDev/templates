'use client';
// packages/templates/src/legal/TermsOfServiceTemplate.tsx

/**
 * @fileoverview Terms of Service Template Component
 * @description Reusable terms of service template with configurable company details and i18n support
 *
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ComponentType, ReactNode } from 'react';

import { Card, List, Section, Stack, Text } from '@donotdev/components';
import { useTranslation, formatDate } from '@donotdev/core';

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
  /** Additional sections rendered after the standard 15 sections */
  extraSections?: ReactNode;
}

/** Section block: h2 heading plus its content, tight vertical rhythm. */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap="tight">
      <Text as="h2" level="h3">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

/** Sub-block: h3 heading plus its content. */
function Sub({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <Stack gap="tight">
      <Text as="h3" level="h4">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

/** Bold label prefix followed by its description (contact line). */
function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text as="strong">{label}:</Text> {children}
    </>
  );
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
 * @version 0.2.0
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
  extraSections,
}) => {
  const { t, i18n } = useTranslation('terms');
  const formattedDate = formatDate(lastUpdated, i18n?.language || 'en');

  return (
    <Section tone={tone} textAlign="start">
      <Stack gap="large">
        <Stack gap="tight">
          <Text as="h1">{t('title')}</Text>
          <Text variant="muted">
            {t('lastUpdated')}: {formattedDate}
          </Text>
        </Stack>

        <Block title={t('sections.introduction.title')}>
          <Text as="p">
            {t('sections.introduction.welcome')} {companyName} ("
            {t('common.we')}," "{t('common.our')}," {t('common.or')} "
            {t('common.us')}"). {t('sections.introduction.govern')}
          </Text>
          <Text as="p">{t('sections.introduction.organization')}</Text>
        </Block>

        <Block title={t('sections.service.title')}>
          <Text as="p">
            {companyName} {t('sections.service.description')}
          </Text>
          <List
            items={[
              t('sections.service.framework'),
              t('sections.service.ui'),
              t('sections.service.auth'),
              t('sections.service.i18n'),
              t('sections.service.billing'),
              t('sections.service.docs'),
            ]}
          />
        </Block>

        <Block title={t('sections.account.title')}>
          <Sub title={t('sections.account.creation.title')}>
            <Text as="p">{t('sections.account.creation.desc')}</Text>
          </Sub>
          <Sub title={t('sections.account.security.title')}>
            <Text as="p">{t('sections.account.security.desc')}</Text>
          </Sub>
          <Sub title={t('sections.account.eligibility.title')}>
            <Text as="p">{t('sections.account.eligibility.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.acceptable.title')}>
          <Text as="p">{t('sections.acceptable.intro')}</Text>
          <List
            items={[
              t('sections.acceptable.laws'),
              t('sections.acceptable.infringe'),
              t('sections.acceptable.harmful'),
              t('sections.acceptable.unauthorized'),
              t('sections.acceptable.spam'),
              t('sections.acceptable.disrupt'),
              t('sections.acceptable.reverse'),
              t('sections.acceptable.automated'),
              t('sections.acceptable.share'),
              t('sections.acceptable.competing'),
            ]}
          />
        </Block>

        <Block title={t('sections.payment.title')}>
          <Sub title={t('sections.payment.plans.title')}>
            <Text as="p">{t('sections.payment.plans.desc')}</Text>
          </Sub>
          <Sub title={t('sections.payment.processing.title')}>
            <Text as="p">{t('sections.payment.processing.desc')}</Text>
          </Sub>
          <Sub title={t('sections.payment.billing.title')}>
            <Text as="p">{t('sections.payment.billing.desc')}</Text>
          </Sub>
          <Sub title={t('sections.payment.refunds.title')}>
            <Text as="p">{t('sections.payment.refunds.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.ip.title')}>
          <Sub title={t('sections.ip.ours.title')}>
            <Text as="p">{t('sections.ip.ours.desc')}</Text>
          </Sub>
          <Sub title={t('sections.ip.yours.title')}>
            <Text as="p">{t('sections.ip.yours.desc')}</Text>
          </Sub>
          <Sub title={t('sections.ip.opensource.title')}>
            <Text as="p">{t('sections.ip.opensource.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.privacy.title')}>
          <Text as="p">{t('sections.privacy.desc')}</Text>
        </Block>

        <Block title={t('sections.availability.title')}>
          <Sub title={t('sections.availability.service.title')}>
            <Text as="p">{t('sections.availability.service.desc')}</Text>
          </Sub>
          <Sub title={t('sections.availability.support.title')}>
            <Text as="p">{t('sections.availability.support.desc')}</Text>
          </Sub>
          <Sub title={t('sections.availability.updates.title')}>
            <Text as="p">{t('sections.availability.updates.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.termination.title')}>
          <Sub title={t('sections.termination.you.title')}>
            <Text as="p">{t('sections.termination.you.desc')}</Text>
          </Sub>
          <Sub title={t('sections.termination.us.title')}>
            <Text as="p">{t('sections.termination.us.desc')}</Text>
          </Sub>
          <Sub title={t('sections.termination.effect.title')}>
            <Text as="p">{t('sections.termination.effect.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.disclaimers.title')}>
          <Sub title={t('sections.disclaimers.service.title')}>
            <Text as="p">{t('sections.disclaimers.service.desc')}</Text>
          </Sub>
          <Sub title={t('sections.disclaimers.liability.title')}>
            <Text as="p">{t('sections.disclaimers.liability.desc')}</Text>
          </Sub>
          <Sub title={t('sections.disclaimers.maximum.title')}>
            <Text as="p">{t('sections.disclaimers.maximum.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.indemnification.title')}>
          <Text as="p">{t('sections.indemnification.desc')}</Text>
        </Block>

        <Block title={t('sections.governing.title')}>
          <Sub title={t('sections.governing.law.title')}>
            <Text as="p">{t('sections.governing.law.desc')} {jurisdiction},{' '}
            {t('sections.governing.law.without')}</Text>
          </Sub>
          <Sub title={t('sections.governing.dispute.title')}>
            <Text as="p">{t('sections.governing.dispute.desc')} {arbitrationOrg}.{' '}
            {t('sections.governing.dispute.location')} {arbitrationLocation}.</Text>
          </Sub>
          <Sub title={t('sections.governing.class.title')}>
            <Text as="p">{t('sections.governing.class.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.miscellaneous.title')}>
          <Sub title={t('sections.miscellaneous.entire.title')}>
            <Text as="p">{t('sections.miscellaneous.entire.desc')}</Text>
          </Sub>
          <Sub title={t('sections.miscellaneous.severability.title')}>
            <Text as="p">{t('sections.miscellaneous.severability.desc')}</Text>
          </Sub>
          <Sub title={t('sections.miscellaneous.waiver.title')}>
            <Text as="p">{t('sections.miscellaneous.waiver.desc')}</Text>
          </Sub>
          <Sub title={t('sections.miscellaneous.assignment.title')}>
            <Text as="p">{t('sections.miscellaneous.assignment.desc')}</Text>
          </Sub>
          <Sub title={t('sections.miscellaneous.force.title')}>
            <Text as="p">{t('sections.miscellaneous.force.desc')}</Text>
          </Sub>
        </Block>

        <Block title={t('sections.changes.title')}>
          <Text as="p">{t('sections.changes.desc')}</Text>
        </Block>

        <Block title={t('sections.contact.title')}>
          <Text as="p">{t('sections.contact.intro')}</Text>
          <Card>
            <Stack gap="tight">
              <Text as="p">
                <Labeled label={t('sections.contact.email')}>{legalEmail}</Labeled>
              </Text>
              <Text as="p">
                <Labeled label={t('sections.contact.address')}>
                  {companyAddress}
                </Labeled>
              </Text>
              {contactInfo.phone && (
                <Text as="p">
                  <Labeled label={t('sections.contact.phone')}>
                    {contactInfo.phone}
                  </Labeled>
                </Text>
              )}
              {contactInfo.supportEmail && (
                <Text as="p">
                  <Labeled label={t('sections.contact.support')}>
                    {contactInfo.supportEmail}
                  </Labeled>
                </Text>
              )}
            </Stack>
          </Card>
        </Block>

        {extraSections}

        <Text as="p" variant="muted" level="small">
          {t('footer.effective')} {formattedDate} {t('footer.remain')}
        </Text>
      </Stack>
    </Section>
  );
};
