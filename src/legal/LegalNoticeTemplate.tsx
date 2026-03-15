'use client';
// packages/templates/src/legal/LegalNoticeTemplate.tsx

/**
 * @fileoverview Legal Notice Template Component
 * @description Reusable legal notice (Mentions Légales) template with configurable company details and i18n support
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Text, Section, Stack } from '@donotdev/components';
import { useTranslation, formatDate } from '@donotdev/core';

import type { ComponentType } from 'react';

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
 * @version 0.1.0
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
      <div className="dndev-text-center" style={{ marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          ⚖️ {t('title', 'Legal Notice')}
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
        {/* Publisher Information */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('publisher.title', '1. Publisher Information')}
          </h2>
          <Stack gap="tight">
            <p>
              <strong>{t('publisher.name', 'Publisher name')}:</strong>{' '}
              {publisherName}
            </p>
            <p>
              <strong>{t('publisher.type', 'Type')}:</strong>{' '}
              {t(
                `publisher.types.${publisherType}`,
                publisherType === 'company' ? 'Company' : 'Individual'
              )}
            </p>
            {legalStatus && (
              <p>
                <strong>{t('publisher.legalStatus', 'Legal status')}:</strong>{' '}
                {legalStatus}
              </p>
            )}
            {shareCapital && publisherType === 'company' && (
              <p>
                <strong>{t('publisher.shareCapital', 'Share capital')}:</strong>{' '}
                {shareCapital}
              </p>
            )}
          </Stack>
        </section>

        {/* Registration Details */}
        {(registrationNumber || vatNumber) && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t('registration.title', '2. Registration Details')}
            </h2>
            <Stack gap="tight">
              {registrationNumber && (
                <p>
                  <strong>
                    {t('registration.number', 'Registration number / SIRET')}:
                  </strong>{' '}
                  {registrationNumber}
                </p>
              )}
              {vatNumber && (
                <p>
                  <strong>{t('registration.vat', 'VAT number')}:</strong>{' '}
                  {vatNumber}
                </p>
              )}
            </Stack>
          </section>
        )}

        {/* Registered Office */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('office.title', '3. Registered Office')}
          </h2>
          <p>
            <strong>{t('office.address', 'Address')}:</strong>
            <br />
            {registeredOffice}
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
            {t('contact.title', '4. Contact Information')}
          </h2>
          <Stack gap="tight">
            <p>
              <strong>{t('contact.email', 'Email')}:</strong>{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--primary)' }}>
                {' '}
                {email}
              </a>
            </p>
            {phone && (
              <p>
                <strong>{t('contact.phone', 'Phone')}:</strong>{' '}
                <a href={`tel:${phone}`} style={{ color: 'var(--primary)' }}>
                  {phone}
                </a>
              </p>
            )}
          </Stack>
        </section>

        {/* Publication Director */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('director.title', '5. Publication Director')}
          </h2>
          <Stack gap="tight">
            <p>
              <strong>{t('director.name', 'Name')}:</strong> {directorName}
            </p>
            {directorRole && (
              <p>
                <strong>{t('director.role', 'Role')}:</strong> {directorRole}
              </p>
            )}
          </Stack>
        </section>

        {/* Hosting Provider */}
        <section>
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {t('hosting.title', '6. Hosting Provider')}
          </h2>
          <Stack gap="tight">
            <p>
              <strong>{t('hosting.provider', 'Provider')}:</strong>{' '}
              {hostingProvider}
            </p>{' '}
            {hostingAddress && (
              <p>
                <strong>{t('hosting.address', 'Address')}:</strong>
                <br />
                {hostingAddress}
              </p>
            )}
            {hostingContact && (
              <p>
                <strong>{t('hosting.contact', 'Contact')}:</strong>{' '}
                {hostingContact}
              </p>
            )}
          </Stack>
        </section>

        {/* Intellectual Property (Optional) */}
        {sections.intellectualProperty && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t('intellectualProperty.title', '7. Intellectual Property')}
            </h2>
            <p>
              {t(
                'intellectualProperty.content',
                'All content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of {publisherName} or its content suppliers and is protected by international copyright laws.',
                { publisherName }
              )}
            </p>
            <p style={{ marginTop: '1rem' }}>
              {t(
                'intellectualProperty.unauthorized',
                'The unauthorized use of any content from this website may violate copyright, trademark, and other laws.'
              )}
            </p>
          </section>
        )}

        {/* Personal Data (Optional) */}
        {sections.personalData && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t('personalData.title', '8. Personal Data')}
            </h2>
            <p>
              {t(
                'personalData.content',
                'For information about how we collect, use, and protect your personal data, please refer to our '
              )}
              <a
                href="/privacy"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'underline',
                }}
              >
                {t('personalData.privacyPolicy', 'Privacy Policy')}
              </a>
              .
            </p>
          </section>
        )}

        {/* Cookies (Optional) */}
        {sections.cookies && (
          <section>
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              {t('cookies.title', '9. Cookies')}
            </h2>
            <p>
              {t(
                'cookies.content',
                'This website uses cookies. For detailed information about cookies and how we use them, please refer to our '
              )}
              <a
                href="/privacy"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'underline',
                }}
              >
                {t('cookies.privacyPolicy', 'Privacy Policy')}
              </a>
              .
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
        }}
      >
        <Text variant="muted" level="small">
          {t(
            'footer.accurate',
            'The information in this Legal Notice is accurate as of'
          )}{' '}
          {formattedDate}{' '}
          {t(
            'footer.updated',
            'and may be updated to reflect changes in our company information.'
          )}
        </Text>
      </div>
    </Section>
  );
};
