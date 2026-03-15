'use client';
// packages/templates/src/DashboardTemplate.tsx

/**
 * @fileoverview Dashboard Template Component
 * @description Professional dashboard template with stats, recent activity, and quick actions.
 * Uses only framework components — zero custom CSS.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
} from 'lucide-react';

import {
  Badge,
  BADGE_VARIANT,
  Button,
  BUTTON_VARIANT,
  Card,
  Grid,
  List,
  Section,
  Stack,
  Text,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { PageContainer } from '@donotdev/ui';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Single stat card data
 */
export interface DashboardStat {
  /** Stat label */
  label: string;
  /** Stat value (formatted) */
  value: string;
  /** Trend direction */
  trend?: 'up' | 'down';
  /** Trend label (e.g. "+12%") */
  trendLabel?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
}

/**
 * Recent activity item
 */
export interface DashboardActivityItem {
  /** Activity description */
  content: string;
  /** Timestamp label (e.g. "2 min ago") */
  time?: string;
}

/**
 * Quick action button
 */
export interface DashboardAction {
  /** Button label */
  label: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * DashboardTemplate props
 */
export interface DashboardTemplateProps {
  /** i18n namespace for consumer overrides */
  namespace?: string;
  /** Override stat cards (default: 4 demo stats) */
  stats?: DashboardStat[];
  /** Override recent activity items */
  recentItems?: DashboardActivityItem[];
  /** Override quick action buttons */
  quickActions?: DashboardAction[];
  /** Extra sections injected after quick actions */
  children?: ReactNode;
}

/** Default demo stats */
const DEFAULT_STATS: DashboardStat[] = [
  {
    label: 'revenue',
    value: '$12,345',
    trend: 'up',
    trendLabel: '+12%',
    icon: DollarSign,
  },
  {
    label: 'orders',
    value: '356',
    trend: 'up',
    trendLabel: '+8%',
    icon: ShoppingCart,
  },
  {
    label: 'customers',
    value: '2,103',
    trend: 'up',
    trendLabel: '+23%',
    icon: Users,
  },
  {
    label: 'conversion',
    value: '3.2%',
    trend: 'down',
    trendLabel: '-0.4%',
    icon: BarChart3,
  },
];

/**
 * Dashboard Template — Professional analytics overview
 *
 * Sections:
 * 1. Stats row — 4× Card in responsive Grid
 * 2. Recent activity — Card with List
 * 3. Quick actions — Button row
 * 4. Children slot — consumer content
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function DashboardTemplate({
  namespace,
  stats,
  recentItems,
  quickActions,
  children,
}: DashboardTemplateProps) {
  const { t } = useTranslation(namespace ? [namespace, 'dndev'] : 'dndev');

  const resolvedStats =
    stats ??
    DEFAULT_STATS.map((s) => ({
      ...s,
      label: t(`templates.dashboard.stats.${s.label}`),
    }));

  const resolvedActivity = recentItems ?? [
    {
      content: t('templates.dashboard.activity.item1'),
      time: t('templates.dashboard.activity.time1'),
    },
    {
      content: t('templates.dashboard.activity.item2'),
      time: t('templates.dashboard.activity.time2'),
    },
    {
      content: t('templates.dashboard.activity.item3'),
      time: t('templates.dashboard.activity.time3'),
    },
    {
      content: t('templates.dashboard.activity.item4'),
      time: t('templates.dashboard.activity.time4'),
    },
  ];

  const resolvedActions = quickActions ?? [
    { label: t('templates.dashboard.actions.newProduct') },
    { label: t('templates.dashboard.actions.viewReports') },
    { label: t('templates.dashboard.actions.manageTeam') },
  ];

  return (
    <PageContainer>
      <Stack gap="large">
        {/* Header */}
        <Text as="h1" level="h2">
          {t('templates.dashboard.title')}
        </Text>

        {/* Stats Row */}
        <Grid cols={[1, 2, 2, 4]} gap="medium">
          {resolvedStats.map((stat) => (
            <Card key={stat.label} icon={stat.icon}>
              <Stack gap="tight">
                <Text variant="muted" level="small">
                  {stat.label}
                </Text>
                <Stack direction="row" align="center" gap="tight">
                  <Text as="span" level="h3" weight="bold">
                    {stat.value}
                  </Text>
                  {stat.trend && stat.trendLabel && (
                    <Badge
                      variant={
                        stat.trend === 'up'
                          ? BADGE_VARIANT.SUCCESS
                          : BADGE_VARIANT.DESTRUCTIVE
                      }
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {stat.trendLabel}
                    </Badge>
                  )}
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Section title={t('templates.dashboard.activity.title')}>
          <Card>
            <List
              items={resolvedActivity.map((item) => (
                <Stack
                  key={item.content}
                  direction="row"
                  justify="between"
                  align="center"
                >
                  <Text>{item.content}</Text>
                  {item.time && (
                    <Text variant="muted" level="small">
                      {item.time}
                    </Text>
                  )}
                </Stack>
              ))}
              gap="medium"
            />
          </Card>
        </Section>

        {/* Quick Actions */}
        <Section title={t('templates.dashboard.actions.title')}>
          <Stack direction="row" gap="medium" wrap="wrap">
            {resolvedActions.map((action) => (
              <Button
                key={action.label}
                variant={BUTTON_VARIANT.OUTLINE}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Section>

        {/* Consumer content */}
        {children}
      </Stack>
    </PageContainer>
  );
}
