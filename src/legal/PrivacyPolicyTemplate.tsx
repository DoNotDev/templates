'use client';
// packages/templates/src/legal/PrivacyPolicyTemplate.tsx

/**
 * @fileoverview Privacy Policy Template Component
 * @description Reusable privacy policy template with configurable company details and i18n support
 *
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import type { ComponentType, ReactNode } from 'react';

import { Card, List, Section, Stack, Text } from '@donotdev/components';
import {
  useAppConfig,
  useTranslation,
  formatDate,
  isCookieNoticeRequired,
  isFeatureAvailable,
} from '@donotdev/core';

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
  /** Additional sections rendered after the standard sections */
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

/** Bold label prefix followed by its description (list item or contact line). */
function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text as="strong">{label}:</Text> {children}
    </>
  );
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
 * @version 0.2.0
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
  extraSections,
}) => {
  const { t, i18n } = useTranslation('privacy');
  const formattedDate = formatDate(lastUpdated, i18n?.language || 'en');
  // Only strictly necessary cookies: the section says so and lists what is set
  // (no consent banner is shown in that case).
  const necessaryCookiesOnly = !isCookieNoticeRequired(
    useAppConfig().features?.requiredCookies
  );
  const hasSession = isFeatureAvailable('auth') || isFeatureAvailable('oauth');
  const hasPayment = isFeatureAvailable('billing');

  const labeled = (label: string, desc: string) => (
    <Labeled label={label}>{desc}</Labeled>
  );

  return (
    <Section tone={tone} textAlign="start">
      <Stack gap="large">
        <Stack gap="tight">
          <Text as="h1">{t('title')}</Text>
          <Text variant="muted">
            {t('lastUpdated')}: {formattedDate}
          </Text>
        </Stack>

        {/* Introduction */}
        <Block title={t('sections.introduction.title')}>
          <Text as="p">
            {t('sections.introduction.welcome')} {companyName} ("
            {t('common.we')}," "{t('common.our')}," {t('common.or')} "
            {t('common.us')}"). {t('sections.introduction.commitment')}
          </Text>
          <Text as="p">
            {t('sections.introduction.agreement', { companyName })}
          </Text>
        </Block>

        {/* Information We Collect */}
        <Block title={t('sections.collection.title')}>
          <Sub title={t('sections.collection.provided.title')}>
            <List
              items={[
                <Text as="strong" key="account">
                  {t('sections.collection.provided.accountDesc')}
                </Text>,
                labeled(
                  t('sections.collection.provided.usage'),
                  t('sections.collection.provided.usageDesc')
                ),
                labeled(
                  t('sections.collection.provided.communication'),
                  t('sections.collection.provided.communicationDesc')
                ),
                labeled(
                  t('sections.collection.provided.payment'),
                  t('sections.collection.provided.paymentDesc')
                ),
                labeled(
                  t('sections.collection.provided.project'),
                  t('sections.collection.provided.projectDesc')
                ),
              ]}
            />
          </Sub>
          <Sub title={t('sections.collection.automatic.title')}>
            <List
              items={[
                labeled(
                  t('sections.collection.automatic.device'),
                  t('sections.collection.automatic.deviceDesc')
                ),
                labeled(
                  t('sections.collection.automatic.analytics'),
                  t('sections.collection.automatic.analyticsDesc')
                ),
                labeled(
                  t('sections.collection.automatic.performance'),
                  t('sections.collection.automatic.performanceDesc')
                ),
                labeled(
                  t('sections.collection.automatic.cookies'),
                  t('sections.collection.automatic.cookiesDesc')
                ),
              ]}
            />
          </Sub>
        </Block>

        {/* How We Use Your Information */}
        <Block title={t('sections.usage.title')}>
          <Text as="p">{t('sections.usage.intro')}</Text>
          <List
            items={[
              t('sections.usage.provide'),
              t('sections.usage.process'),
              t('sections.usage.send'),
              t('sections.usage.respond'),
              t('sections.usage.analyze'),
              t('sections.usage.detect'),
              t('sections.usage.comply'),
              t('sections.usage.develop'),
            ]}
          />
        </Block>

        {/* Information Sharing */}
        <Block title={t('sections.sharing.title')}>
          <Text as="p">{t('sections.sharing.intro')}</Text>
          <Sub title={t('sections.sharing.providers.title')}>
            <Text as="p">{t('sections.sharing.providers.intro')}</Text>
            <List
              items={[
                t('sections.sharing.providers.hosting'),
                t('sections.sharing.providers.payment'),
                t('sections.sharing.providers.analytics'),
                t('sections.sharing.providers.support'),
              ]}
            />
          </Sub>
          <Sub title={t('sections.sharing.legal.title')}>
            <Text as="p">{t('sections.sharing.legal.desc')}</Text>
          </Sub>
          <Sub title={t('sections.sharing.business.title')}>
            <Text as="p">{t('sections.sharing.business.desc')}</Text>
          </Sub>
        </Block>

        {/* Data Security */}
        <Block title={t('sections.security.title')}>
          <Text as="p">{t('sections.security.intro')}</Text>
          <List
            items={[
              t('sections.security.encryption'),
              t('sections.security.assessments'),
              t('sections.security.access'),
              t('sections.security.training'),
              t('sections.security.incident'),
            ]}
          />
        </Block>

        {/* Data Retention */}
        <Block title={t('sections.retention.title')}>
          <Text as="p">{t('sections.retention.intro')}</Text>
          <List
            items={[
              labeled(
                t('sections.retention.account'),
                t('sections.retention.accountDesc')
              ),
              labeled(
                t('sections.retention.usage'),
                t('sections.retention.usageDesc')
              ),
              labeled(
                t('sections.retention.payment'),
                t('sections.retention.paymentDesc')
              ),
              labeled(
                t('sections.retention.communication'),
                t('sections.retention.communicationDesc')
              ),
            ]}
          />
        </Block>

        {/* Your Rights */}
        <Block title={t('sections.rights.title')}>
          <Text as="p">{t('sections.rights.intro')}</Text>
          <Sub title={t('sections.rights.access.title')}>
            <Text as="p">{t('sections.rights.access.desc')}</Text>
          </Sub>
          <Sub title={t('sections.rights.correction.title')}>
            <Text as="p">{t('sections.rights.correction.desc')}</Text>
          </Sub>
          <Sub title={t('sections.rights.deletion.title')}>
            <Text as="p">{t('sections.rights.deletion.desc')}</Text>
          </Sub>
          <Sub title={t('sections.rights.restriction.title')}>
            <Text as="p">{t('sections.rights.restriction.desc')}</Text>
          </Sub>
          <Sub title={t('sections.rights.marketing.title')}>
            <Text as="p">{t('sections.rights.marketing.desc')}</Text>
          </Sub>
        </Block>

        {/* Cookies and Tracking */}
        <Block title={t('sections.cookies.title')}>
          <Text as="p">
            {necessaryCookiesOnly
              ? t('sections.cookies.necessaryOnlyIntro')
              : t('sections.cookies.intro')}
          </Text>
          <Sub title={t('sections.cookies.types.title')}>
            <List
              items={
                necessaryCookiesOnly
                  ? [
                      t('sections.cookies.necessary.preferences'),
                      ...(hasSession
                        ? [t('sections.cookies.necessary.session')]
                        : []),
                      ...(hasPayment
                        ? [t('sections.cookies.necessary.payment')]
                        : []),
                    ]
                  : [
                      labeled(
                        t('sections.cookies.types.essential'),
                        t('sections.cookies.types.essentialDesc')
                      ),
                      labeled(
                        t('sections.cookies.types.analytics'),
                        t('sections.cookies.types.analyticsDesc')
                      ),
                      labeled(
                        t('sections.cookies.types.functional'),
                        t('sections.cookies.types.functionalDesc')
                      ),
                      labeled(
                        t('sections.cookies.types.marketing'),
                        t('sections.cookies.types.marketingDesc')
                      ),
                    ]
              }
            />
          </Sub>
        </Block>

        {/* International Transfers */}
        {sections.international && (
          <Block title={t('sections.international.title')}>
            <Text as="p">{t('sections.international.desc')}</Text>
          </Block>
        )}

        {/* Children's Privacy */}
        {sections.children && (
          <Block title={t('sections.children.title')}>
            <Text as="p">{t('sections.children.desc')}</Text>
          </Block>
        )}

        {/* Changes to Privacy Policy */}
        <Block title={t('sections.changes.title')}>
          <Text as="p">{t('sections.changes.desc')}</Text>
        </Block>

        {/* Contact Information */}
        <Block title={t('sections.contact.title')}>
          <Text as="p">{t('sections.contact.intro')}</Text>
          <Card>
            <Stack gap="tight">
              <Text as="p">
                <Labeled label={t('sections.contact.email')}>
                  {privacyEmail}
                </Labeled>
              </Text>
              <Text as="p">
                <Labeled label={t('sections.contact.address')}>
                  {companyAddress}
                </Labeled>
              </Text>
              {dpoEmail && (
                <Text as="p">
                  <Labeled label={t('sections.contact.dpo')}>{dpoEmail}</Labeled>
                </Text>
              )}
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

        {/* Legal Basis for EU Users */}
        {sections.eu && (
          <Block title={t('sections.eu.title')}>
            <Text as="p">{t('sections.eu.intro')}</Text>
            <List
              items={[
                labeled(t('sections.eu.consent'), t('sections.eu.consentDesc')),
                labeled(
                  t('sections.eu.contract'),
                  t('sections.eu.contractDesc')
                ),
                labeled(
                  t('sections.eu.legitimate'),
                  t('sections.eu.legitimateDesc')
                ),
                labeled(t('sections.eu.legal'), t('sections.eu.legalDesc')),
              ]}
            />
          </Block>
        )}

        {/* California Privacy Rights */}
        {sections.california && (
          <Block title={t('sections.california.title')}>
            <Text as="p">{t('sections.california.desc')}</Text>
          </Block>
        )}

        {extraSections}

        <Text as="p" variant="muted" level="small">
          {t('footer.effective')} {formattedDate} {t('footer.remain')}
        </Text>
      </Stack>
    </Section>
  );
};
