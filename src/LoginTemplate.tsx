'use client';
// packages/templates/src/LoginTemplate.tsx

/**
 * @fileoverview Login Template Component
 * @description Sign-in page: the app's enabled auth providers in a card, with
 * redirect once signed in and graceful states for disabled / loading auth.
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useEffect } from 'react';
import type { FC, ReactNode } from 'react';

import { Alert, Card, Spinner, Stack } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { useAuthVisibility, useNavigate } from '@donotdev/ui';

import {
  isAuthModuleAvailable,
  MultipleAuthProviders,
  useAuth,
} from './authImports';

/** Props for the LoginTemplate component. */
export interface LoginTemplateProps {
  /** Card title. @default t('login.title') ("Login") */
  title?: string;
  /** Card subtitle. @default t('login.description') ("Sign in to your account") */
  subtitle?: string;
  /** Path to navigate to once the user is signed in. @default '/' */
  redirectTo?: string;
  /** Rendered under the providers, e.g. a link to the sign-up page. */
  footer?: ReactNode;
}

/**
 * Login Template - full sign-in page body.
 *
 * Renders every auth provider enabled for the app (`MultipleAuthProviders` from
 * `@donotdev/auth`: email / password form, social buttons) in a card, then
 * navigates to `redirectTo` as soon as a user is signed in (also when an
 * already signed-in user opens the page). Shows a message instead when auth is
 * disabled or `@donotdev/auth` is not installed, and a spinner while auth starts.
 *
 * @example
 * ```tsx
 * export const meta: PageMeta = { route: '/login', auth: false };
 *
 * export default function LoginPage() {
 *   return (
 *     <PageContainer>
 *       <Section contentWidth="narrow">
 *         <LoginTemplate
 *           redirectTo="/dashboard"
 *           footer={<Link path="/signup">Create an account</Link>}
 *         />
 *       </Section>
 *     </PageContainer>
 *   );
 * }
 * ```
 *
 * @version 0.2.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const LoginTemplate: FC<LoginTemplateProps> = ({
  title,
  subtitle,
  redirectTo = '/',
  footer,
}) => {
  const { t } = useTranslation('login');
  const heading = title ?? t('login.title', 'Login');
  const description =
    subtitle ?? t('login.description', 'Sign in to your account');

  if (!isAuthModuleAvailable) {
    return <AuthUnavailable title={heading} subtitle={description} />;
  }
  return (
    <LoginWithAuth
      title={heading}
      subtitle={description}
      redirectTo={redirectTo}
      footer={footer}
    />
  );
};

interface ResolvedLoginProps {
  title: string;
  subtitle: string;
}

/** Auth disabled for the app or @donotdev/auth not installed. */
function AuthUnavailable({ title, subtitle }: ResolvedLoginProps) {
  const { t } = useTranslation('login');
  return (
    <Card title={title} subtitle={subtitle}>
      <Alert
        variant="error"
        description={t(
          'login.authNotAvailable',
          'Authentication is not available. Please contact support if you believe this is an error.'
        )}
      />
    </Card>
  );
}

/** Rendered only when @donotdev/auth is installed: its hooks are safe to call. */
function LoginWithAuth({
  title,
  subtitle,
  redirectTo,
  footer,
}: ResolvedLoginProps & { redirectTo: string; footer?: ReactNode }) {
  const { t } = useTranslation('login');
  // shouldHide is also true while initializing: test loading first.
  const { isLoading, isReady } = useAuthVisibility();
  const user = useAuth('user');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(redirectTo);
  }, [user, navigate, redirectTo]);

  if (!isLoading && !isReady) {
    return <AuthUnavailable title={title} subtitle={subtitle} />;
  }

  return (
    <Card title={title} subtitle={subtitle}>
      <Stack gap="large">
        {isLoading ? (
          <Spinner message={t('login.loading', 'Loading authentication...')} />
        ) : (
          <MultipleAuthProviders />
        )}
        {footer}
      </Stack>
    </Card>
  );
}
