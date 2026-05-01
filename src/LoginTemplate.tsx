'use client';
// packages/templates/src/LoginTemplate.tsx

/**
 * @fileoverview Login Template Component
 * @description Professional login template with authentication
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Card, Stack } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { useAuthVisibility } from '@donotdev/ui';

import type { FC } from 'react';

/** Props for the LoginTemplate component. */
export interface LoginTemplateProps {
  title?: string;
  subtitle?: string;
  redirectTo?: string;
}

/**
 * Login Template - Professional authentication page
 *
 * Gracefully handles disabled auth by showing an appropriate message.
 * Uses `useAuthVisibility` hook to determine if auth is available.
 *
 * This component is intended as a full-page, pre-styled solution for user authentication.
 * It will internally compose `LoginModal` or `MultipleAuthProviders` from `@donotdev/auth`
 * to provide email/password forms, social login buttons, and account management links.
 * Use this template for a complete, production-ready login page with minimal effort.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export const LoginTemplate: FC<LoginTemplateProps> = ({
  title,
  subtitle,
  redirectTo,
}) => {
  const { shouldHide, isLoading, isReady } = useAuthVisibility();
  const { t } = useTranslation('login');

  // Show message if auth is disabled/not available
  if (shouldHide) {
    return (
      <Card
        subtitle={subtitle || t('login.description', 'Sign in to your account')}
      >
        <div
          className="dndev-surface"
          data-variant="destructive"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--destructive)',
            backgroundColor:
              'color-mix(in oklab, var(--destructive) 10%, transparent)',
            padding: 'var(--gap-md)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--destructive-foreground)',
            }}
          >
            {t(
              'login.authNotAvailable',
              'Authentication is not available. Please contact support if you believe this is an error.'
            )}
          </p>
        </div>
      </Card>
    );
  }

  // Show loading state while auth initializes
  if (isLoading || !isReady) {
    return (
      <Card
        title={title || t('login.title', 'Login')}
        subtitle={subtitle || t('login.description', 'Sign in to your account')}
      >
        <Stack
          align="center"
          justify="center"
          style={{
            paddingTop: 'var(--gap-lg)',
            paddingBottom: 'var(--gap-lg)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--muted-foreground)',
            }}
          >
            {t('login.loading', 'Loading authentication...')}
          </div>
        </Stack>
      </Card>
    );
  }

  // TODO: Implement full login form when auth is ready
  return (
    <Card
      title={title || t('login.title', 'Login')}
      subtitle={subtitle || t('login.description', 'Sign in to your account')}
    >
      <Stack>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--muted-foreground)',
          }}
        >
          {t(
            'login.comingSoon',
            'Login template coming soon. Redirect: {redirectTo}',
            { redirectTo: redirectTo || '/' }
          )}
        </p>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--muted-foreground)',
          }}
        >
          {t(
            'login.placeholder',
            'This is a placeholder for the full login implementation with Firebase Auth integration.'
          )}
        </p>
      </Stack>
    </Card>
  );
};
