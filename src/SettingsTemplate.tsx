'use client';
// packages/templates/src/SettingsTemplate.tsx

/**
 * @fileoverview Settings Template Component
 * @description Professional settings page with tabbed sections for general, notifications,
 * and appearance. Uses only framework components — zero custom CSS.
 *
 * @version 0.1.0
 * @since 0.1.0
 * @author AMBROISE PARK Consulting
 */

import { Globe, Bell, Palette } from 'lucide-react';

import { Card, Section, Stack, Switch, Tabs, Text } from '@donotdev/components';
import type { TabItem } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { useLayout, useTheme } from '@donotdev/core';
import { PageContainer } from '@donotdev/ui';

import type { ReactNode } from 'react';

/**
 * SettingsTemplate props
 */
export interface SettingsTemplateProps {
  /** i18n namespace for consumer overrides */
  namespace?: string;
  /** Override tab items (replaces default tabs entirely) */
  tabs?: TabItem[];
  /** Extra content rendered below tabs */
  children?: ReactNode;
}

/**
 * Settings Template — Tabbed settings interface
 *
 * Default tabs:
 * 1. General — App info, language
 * 2. Notifications — Toggle switches
 * 3. Appearance — Theme switcher
 *
 * @version 0.1.0
 * @since 0.1.0
 * @author AMBROISE PARK Consulting
 */
export function SettingsTemplate({
  namespace,
  tabs: customTabs,
  children,
}: SettingsTemplateProps) {
  const { t } = useTranslation(namespace ? [namespace, 'dndev'] : 'dndev');

  const defaultTabs: TabItem[] = [
    {
      value: 'general',
      label: (
        <Stack direction="row" align="center" gap="tight">
          <Globe size={16} />
          {t('templates.settings.tabs.general')}
        </Stack>
      ),
      content: <GeneralTab t={t} />,
    },
    {
      value: 'notifications',
      label: (
        <Stack direction="row" align="center" gap="tight">
          <Bell size={16} />
          {t('templates.settings.tabs.notifications')}
        </Stack>
      ),
      content: <NotificationsTab t={t} />,
    },
    {
      value: 'appearance',
      label: (
        <Stack direction="row" align="center" gap="tight">
          <Palette size={16} />
          {t('templates.settings.tabs.appearance')}
        </Stack>
      ),
      content: <AppearanceTab t={t} />,
    },
  ];

  return (
    <PageContainer variant="docs">
      <Stack gap="large">
        <Text as="h1" level="h2">
          {t('templates.settings.title')}
        </Text>

        <Tabs items={customTabs ?? defaultTabs} />

        {children}
      </Stack>
    </PageContainer>
  );
}

// ============================================================================
// TAB CONTENT COMPONENTS (internal)
// ============================================================================

interface TabProps {
  t: (key: string) => string;
}

function GeneralTab({ t }: TabProps) {
  const layoutApp = useLayout('layoutApp');

  return (
    <Stack gap="medium">
      <Card title={t('templates.settings.general.appInfo')}>
        <Stack gap="medium">
          <Stack gap="none">
            <Text variant="muted" level="small">
              {t('templates.settings.general.appName')}
            </Text>
            <Text>{layoutApp?.name ?? '—'}</Text>
          </Stack>
          {layoutApp?.description && (
            <Stack gap="none">
              <Text variant="muted" level="small">
                {t('templates.settings.general.description')}
              </Text>
              <Text>{layoutApp.description}</Text>
            </Stack>
          )}
        </Stack>
      </Card>

      <Card title={t('templates.settings.general.language')}>
        <Text variant="muted">
          {t('templates.settings.general.languageHint')}
        </Text>
      </Card>
    </Stack>
  );
}

function NotificationsTab({ t }: TabProps) {
  return (
    <Stack gap="medium">
      <Card title={t('templates.settings.notifications.preferences')}>
        <Stack gap="medium">
          <Stack direction="row" justify="between" align="center">
            <Stack gap="none">
              <Text>{t('templates.settings.notifications.email')}</Text>
              <Text variant="muted" level="small">
                {t('templates.settings.notifications.emailDesc')}
              </Text>
            </Stack>
            <Switch defaultChecked />
          </Stack>
          <Stack direction="row" justify="between" align="center">
            <Stack gap="none">
              <Text>{t('templates.settings.notifications.push')}</Text>
              <Text variant="muted" level="small">
                {t('templates.settings.notifications.pushDesc')}
              </Text>
            </Stack>
            <Switch />
          </Stack>
          <Stack direction="row" justify="between" align="center">
            <Stack gap="none">
              <Text>{t('templates.settings.notifications.marketing')}</Text>
              <Text variant="muted" level="small">
                {t('templates.settings.notifications.marketingDesc')}
              </Text>
            </Stack>
            <Switch />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

function AppearanceTab({ t }: TabProps) {
  const currentTheme = useTheme('currentTheme');
  const isDarkMode = useTheme('isDarkMode');
  const toggleDarkMode = useTheme('toggleDarkMode');

  return (
    <Stack gap="medium">
      <Card title={t('templates.settings.appearance.theme')}>
        <Stack gap="medium">
          <Stack direction="row" justify="between" align="center">
            <Stack gap="none">
              <Text>{t('templates.settings.appearance.darkMode')}</Text>
              <Text variant="muted" level="small">
                {`${t('templates.settings.appearance.currentTheme')}: ${currentTheme}`}
              </Text>
            </Stack>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
