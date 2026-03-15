'use client';
// packages/templates/src/ProfileTemplate.tsx

/**
 * @fileoverview Profile Template Component
 * @description Professional user profile management template with identity, security,
 * subscription, and account deletion sections. Uses only public @donotdev/auth API.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { CreditCard, Lock, LogOut, Trash2, User } from 'lucide-react';

import {
  isAuthModuleAvailable,
  useAuth,
  useDeleteAccount,
  ConfirmDeleteDialog,
  ReauthDialog,
} from './authImports';
import {
  Avatar,
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_VARIANT,
  Card,
  CARD_VARIANT,
  Separator,
  Stack,
  Text,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { PageContainer } from '@donotdev/ui';

import type { ReactNode } from 'react';

/**
 * ProfileTemplate props
 */
export interface ProfileTemplateProps {
  /** i18n namespace for consumer overrides */
  namespace?: string;
  /** Path to billing/subscription management page */
  billingPath?: string;
  /** Extra card sections injected between subscription and danger zone */
  children?: ReactNode;
}

/**
 * Profile Template — Professional profile management interface
 *
 * Sections:
 * 1. Header — Avatar + display name + email + role badge
 * 2. Identity — Display name, email, verification status
 * 3. Security — Linked providers
 * 4. Subscription — Current plan, status, manage billing link
 * 5. Danger Zone — Delete account (public ConfirmDeleteDialog + ReauthDialog)
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function ProfileTemplate({
  namespace,
  billingPath = '/billing',
  children,
}: ProfileTemplateProps) {
  // Safe guard: isAuthModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isAuthModuleAvailable) return null;

  const { t } = useTranslation(namespace ? [namespace, 'dndev'] : 'dndev');

  const user = useAuth('user');
  const userSubscription = useAuth('userSubscription');
  const signOut = useAuth('signOut');
  const deletion = useDeleteAccount();

  const displayName = user?.displayName ?? user?.email ?? '?';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageContainer variant="docs">
      <Stack gap="large">
        {/* Header — Avatar + Name + Email + Badge */}
        <Stack direction="row" align="center" gap="medium">
          <Avatar
            src={user?.photoURL ?? undefined}
            fallback={initials}
            alt={displayName}
          />
          <Stack gap="none">
            <Text as="h1" level="h3">
              {displayName}
            </Text>
            {user?.email && (
              <Text variant="muted" level="body">
                {user.email}
              </Text>
            )}
          </Stack>
          {user?.role && (
            <Badge variant={BADGE_VARIANT.ACCENT}>{user.role}</Badge>
          )}
        </Stack>

        <Separator />

        {/* Identity Card */}
        <Card icon={User} title={t('templates.profile.identity.title')}>
          <Stack gap="medium">
            {user?.displayName && (
              <Stack gap="none">
                <Text variant="muted" level="small">
                  {t('templates.profile.identity.displayName')}
                </Text>
                <Text>{user.displayName}</Text>
              </Stack>
            )}
            {user?.email && (
              <Stack gap="none">
                <Text variant="muted" level="small">
                  {t('templates.profile.identity.email')}
                </Text>
                <Stack direction="row" align="center" gap="tight">
                  <Text>{user.email}</Text>
                  <Badge
                    variant={
                      user.emailVerified
                        ? BADGE_VARIANT.SUCCESS
                        : BADGE_VARIANT.WARNING
                    }
                    as="span"
                  >
                    {user.emailVerified
                      ? t('templates.profile.identity.emailVerified')
                      : t('templates.profile.identity.emailUnverified')}
                  </Badge>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Security Card */}
        <Card icon={Lock} title={t('templates.profile.security.title')}>
          <Stack gap="medium">
            {user?.providerData && user.providerData.length > 0 && (
              <Stack gap="none">
                <Text variant="muted" level="small">
                  {t('templates.profile.security.linkedProviders')}
                </Text>
                <Stack direction="row" gap="tight">
                  {user.providerData.map((provider) => (
                    <Badge
                      key={provider.providerId}
                      variant={BADGE_VARIANT.OUTLINE}
                    >
                      {provider.providerId}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card>

        {/* Subscription Card */}
        <Card
          icon={CreditCard}
          title={t('templates.profile.subscription.title')}
        >
          <Stack gap="medium">
            {userSubscription ? (
              <>
                <Stack direction="row" align="center" gap="medium">
                  <Stack gap="none">
                    <Text variant="muted" level="small">
                      {t('templates.profile.subscription.currentPlan')}
                    </Text>
                    <Text weight="semibold">{userSubscription.tier}</Text>
                  </Stack>
                  <Stack gap="none">
                    <Text variant="muted" level="small">
                      {t('templates.profile.subscription.status')}
                    </Text>
                    <Badge
                      variant={
                        userSubscription.isActive
                          ? BADGE_VARIANT.SUCCESS
                          : BADGE_VARIANT.MUTED
                      }
                      as="span"
                    >
                      {userSubscription.status}
                    </Badge>
                  </Stack>
                </Stack>
                <Button
                  variant={BUTTON_VARIANT.OUTLINE}
                  onClick={() => {
                    window.location.href = billingPath;
                  }}
                >
                  {t('templates.profile.subscription.manageBilling')}
                </Button>
              </>
            ) : (
              <Text variant="muted">
                {t('templates.profile.subscription.noPlan')}
              </Text>
            )}
          </Stack>
        </Card>

        {/* Consumer-injected sections */}
        {children}

        {/* Sign Out */}
        <Button
          variant={BUTTON_VARIANT.OUTLINE}
          onClick={() => {
            signOut();
          }}
        >
          <LogOut size={16} />
          {t('templates.profile.signOut')}
        </Button>

        {/* Danger Zone */}
        <Card
          icon={Trash2}
          title={t('templates.profile.dangerZone.title')}
          variant={CARD_VARIANT.DESTRUCTIVE}
        >
          <Stack gap="medium">
            <Text variant="muted">
              {t('templates.profile.dangerZone.deleteWarning')}
            </Text>
            <Button
              variant={BUTTON_VARIANT.DESTRUCTIVE}
              onClick={deletion.startDeleteFlow}
            >
              {t('templates.profile.dangerZone.deleteAccount')}
            </Button>
          </Stack>
        </Card>

        {/* Deletion Dialogs */}
        <ConfirmDeleteDialog
          open={deletion.showConfirmDialog}
          isLoading={deletion.isDeleting}
          error={deletion.error}
          onConfirm={() => deletion.confirmDelete()}
          onCancel={deletion.cancel}
        />
        <ReauthDialog
          open={deletion.showPasswordDialog}
          isLoading={deletion.isDeleting}
          error={deletion.error}
          onReauth={(password) => deletion.confirmDelete(password)}
          onCancel={deletion.cancel}
        />
      </Stack>
    </PageContainer>
  );
}
