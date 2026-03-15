'use client';
// packages/templates/src/AdminLandingTemplate.tsx

/**

 * @fileoverview Admin Landing Template Component

 * @description Reusable admin login/landing page template with auth providers, loading state, and support links

 *

 * @version 0.1.0

 * @since 0.0.1

 * @author AMBROISE PARK Consulting

 */

import { useEffect } from 'react';

import { isAuthModuleAvailable, MultipleAuthProviders } from './authImports';
import { HeroSection, Section, Text, Stack } from '@donotdev/components';
import {
  useTranslation,
  useAppConfig,
  getPlatformEnvVar,
} from '@donotdev/core';
import { Spinner } from '@donotdev/components';
import {
  PageContainer,
  useNavigate,
  useRedirectGuard,
  Link,
} from '@donotdev/ui';

import type { ReactNode } from 'react';

export interface AdminLandingTemplateProps {
  /** Page title (e.g., "Admin Login") */

  title: string;

  /** Page subtitle (e.g., "Car Inventory & CRM Management System") */

  subtitle?: string;

  /** Message section with title and content */

  message?: {
    title: string;

    content: string;
  };

  /** Support/contact link configuration */

  supportLink?: {
    label?: string;

    path?: string;
  };

  /** Public website link configuration */

  publicWebsiteLink?: {
    label?: string;

    path?: string;
  };

  /** Redirect configuration */

  redirectConfig?: {
    condition: (user: any) => boolean;

    redirectTo: string;
  };

  /** Additional content to render below auth providers */

  children?: ReactNode;
}

/**

 * AdminLandingTemplate - Reusable admin login/landing page

 *

 * Handles loading state, redirect logic, and displays auth providers with support links.

 * Uses AppConfig for default link values (support link and public website URL).

 *

 * @version 0.1.0

 * @since 0.0.1

 * @author AMBROISE PARK Consulting

 */

export function AdminLandingTemplate({
  title,

  subtitle,

  message,

  supportLink,

  publicWebsiteLink,

  redirectConfig,

  children,
}: AdminLandingTemplateProps) {
  const { t } = useTranslation('dndev');

  const navigate = useNavigate();

  const appConfig = useAppConfig('app');

  const { shouldRedirect, redirectTo, isChecking } = useRedirectGuard({
    condition: redirectConfig?.condition,

    redirectTo: redirectConfig?.redirectTo,
  });

  useEffect(() => {
    if (shouldRedirect && redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [shouldRedirect, redirectTo, navigate]);

  if (isChecking) {
    return <Spinner overlay />;
  }

  if (shouldRedirect && redirectTo) {
    return null;
  }

  const supportPath = supportLink?.path || appConfig?.links?.support;

  const publicWebsitePath =
    publicWebsiteLink?.path || getPlatformEnvVar('APP_URL');

  const supportLabel =
    supportLink?.label || t('adminLanding.contactSupport', 'Contact Support');

  const publicWebsiteLabel =
    publicWebsiteLink?.label || t('adminLanding.visitWebsite', 'Visit Website');

  return (
    <PageContainer>
      <HeroSection title={title} subtitle={subtitle} variant="primary" />

      {message && (
        <Section title={message.title} textAlign="center">
          <Text as="p" level="body">
            {message.content}
          </Text>
        </Section>
      )}

      {isAuthModuleAvailable && MultipleAuthProviders && (
        <MultipleAuthProviders />
      )}

      {children}

      {(supportPath || publicWebsitePath) && (
        <Stack direction="row" gap="tight" justify="center" align="center">
          {supportPath && (
            <>
              <Link
                path={supportPath}
                style={{
                  fontSize: 'var(--font-size-sm)',

                  color: 'var(--muted-foreground)',
                }}
              >
                {supportLabel}
              </Link>

              {publicWebsitePath && (
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',

                    color: 'var(--muted-foreground)',
                  }}
                >
                  {' | '}
                </span>
              )}
            </>
          )}

          {publicWebsitePath && (
            <Link
              path={publicWebsitePath}
              style={{
                fontSize: 'var(--font-size-sm)',

                color: 'var(--muted-foreground)',
              }}
            >
              {publicWebsiteLabel}
            </Link>
          )}
        </Stack>
      )}
    </PageContainer>
  );
}
