'use client';
// packages/templates/src/legal/LegalNoticeTemplate.tsx

/**
 * @fileoverview Legal Notice Template Component
 * @description Reusable legal notice (Mentions Légales) template with configurable company details and i18n support
 *
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ComponentType, ReactNode } from 'react';

import { Text, Section, Stack } from '@donotdev/components';
import { useTranslation, formatDate } from '@donotdev/core';
import { Link } from '@donotdev/ui';

/**
 * Legal Notice Template Configuration
 */
export interface LegalNoticeConfig {
  /** Publisher name (company or individual) */
  publisherName: string;
  /** Type of publisher */
  publisherType: 'individual' | 'company';
  /** Legal status (e.g., "SARL", "SAS", "LLC", "Inc.") */
  legalStatus?: string;
  /** Company registration number (e.g., SIRET for France, Company Number for UK) */
  registrationNumber?: string;
  /** VAT number */
  vatNumber?: string;
  /** Share capital (for companies) */
  shareCapital?: string;
  /** Registered office address */
  registeredOffice: string;
  /** Contact email */
  email: string;
  /** Contact phone number */
  phone?: string;
  /** Publication director name */
  directorName: string;
  /** Publication director role */
  directorRole?: string;
  /** Hosting provider name */
  hostingProvider: string;
  /** Hosting provider address */
  hostingAddress?: string;
  /** Hosting provider contact */
  hostingContact?: string;
  /** Last updated date as ISO string (defaults to current date) */
  lastUpdated?: string;
  /** Custom sections to include/exclude */
  sections?: {
    intellectualProperty?: boolean;
    personalData?: boolean;
    cookies?: boolean;
  };
  /** Section tone for background @default 'base' */
  tone?: 'ghost' | 'base' | 'muted' | 'contrast' | 'accent';
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

/** Paragraph with a bold label prefix. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Text as="p">
      <Text as="strong">{label}:</Text> {children}
    </Text>
  );
}

/**
 * Legal Notice Template Component
 *
 * Reusable legal notice template with:
 * - Configurable company/publisher details
 * - i18n support for multiple languages
 * - Modular sections that can be enabled/disabled
 * - Support for different jurisdictions (France, EU, etc.)
 * - Professional structure for legal compliance
 *
 * @param props - LegalNoticeTemplate component props
 * @returns React component
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const LegalNoticeTemplate: ComponentType<LegalNoticeConfig> = ({
  publisherName,
  publisherType,
  legalStatus,
  registrationNumber,
  vatNumber,
  shareCapital,
  registeredOffice,
  email,
  phone,
  directorName,
  directorRole = 'Publication Director',
  hostingProvider,
  hostingAddress,
  hostingContact,
  lastUpdated,
  sections = {
    intellectualProperty: true,
    personalData: true,
    cookies: true,
  },
  tone = 'base',
}) => {
  const { t, i18n } = useTranslation('legalNotice');
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

        {/* Publisher Information */}
        <Block title={t('publisher.title')}>
          <Field label={t('publisher.name')}>{publisherName}</Field>
          <Field label={t('publisher.type')}>
            {t(`publisher.types.${publisherType}`)}
          </Field>
          {legalStatus && (
            <Field label={t('publisher.legalStatus')}>{legalStatus}</Field>
          )}
          {shareCapital && publisherType === 'company' && (
            <Field label={t('publisher.shareCapital')}>{shareCapital}</Field>
          )}
        </Block>

        {/* Registration Details */}
        {(registrationNumber || vatNumber) && (
          <Block title={t('registration.title')}>
            {registrationNumber && (
              <Field label={t('registration.number')}>
                {registrationNumber}
              </Field>
            )}
            {vatNumber && (
              <Field label={t('registration.vat')}>{vatNumber}</Field>
            )}
          </Block>
        )}

        {/* Registered Office */}
        <Block title={t('office.title')}>
          <Field label={t('office.address')}>{registeredOffice}</Field>
        </Block>

        {/* Contact Information */}
        <Block title={t('contact.title')}>
          <Field label={t('contact.email')}>
            <Link path={`mailto:${email}`}>{email}</Link>
          </Field>
          {phone && (
            <Field label={t('contact.phone')}>
              <Link path={`tel:${phone}`}>{phone}</Link>
            </Field>
          )}
        </Block>

        {/* Publication Director */}
        <Block title={t('director.title')}>
          <Field label={t('director.name')}>{directorName}</Field>
          {directorRole && (
            <Field label={t('director.role')}>{directorRole}</Field>
          )}
        </Block>

        {/* Hosting Provider */}
        <Block title={t('hosting.title')}>
          <Field label={t('hosting.provider')}>{hostingProvider}</Field>
          {hostingAddress && (
            <Field label={t('hosting.address')}>{hostingAddress}</Field>
          )}
          {hostingContact && (
            <Field label={t('hosting.contact')}>{hostingContact}</Field>
          )}
        </Block>

        {/* Intellectual Property (Optional) */}
        {sections.intellectualProperty && (
          <Block title={t('intellectualProperty.title')}>
            <Text as="p">
              {t('intellectualProperty.content', { publisherName })}
            </Text>
            <Text as="p">{t('intellectualProperty.unauthorized')}</Text>
          </Block>
        )}

        {/* Personal Data (Optional) */}
        {sections.personalData && (
          <Block title={t('personalData.title')}>
            <Text as="p">
              {t('personalData.content')}
              <Link path="/privacy">{t('personalData.privacyPolicy')}</Link>.
            </Text>
          </Block>
        )}

        {/* Cookies (Optional) */}
        {sections.cookies && (
          <Block title={t('cookies.title')}>
            <Text as="p">
              {t('cookies.content')}
              <Link path="/privacy">{t('cookies.privacyPolicy')}</Link>.
            </Text>
          </Block>
        )}

        <Text as="p" variant="muted" level="small">
          {t('footer.accurate')} {formattedDate} {t('footer.updated')}
        </Text>
      </Stack>
    </Section>
  );
};
