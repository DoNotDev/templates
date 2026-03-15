'use client';
// packages/templates/src/HomeTemplate.tsx

/**
 * @fileoverview Home Template Component
 * @description Beautiful home page template with hero, features, roadmap, showcase, and CTA sections.
 * Uses tone alternation (muted → ghost → muted → ghost → accent) for visual rhythm.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Zap, Shield, Rocket, UserPlus, Settings, Play } from 'lucide-react';

import { Roadmap } from '@donotdev/components';
import {
  Bento,
  Button,
  BUTTON_VARIANT,
  CallToAction,
  Card,
  CARD_VARIANT,
  HeroSection,
  Section,
} from '@donotdev/components';
import type { RoadmapStep } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { PageContainer } from '@donotdev/ui';

import type { ReactNode } from 'react';

/**
 * Feature card data
 */
interface CardItem {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Optional icon */
  icon?: typeof Zap;
}

/**
 * HomeTemplate props
 */
export interface HomeTemplateProps {
  /** i18n namespace for consumer overrides */
  namespace?: string;
  /** Override feature cards */
  features?: CardItem[];
  /** Override roadmap steps */
  steps?: RoadmapStep[];
  /** Extra sections injected before the final CTA */
  children?: ReactNode;
}

/**
 * Home Template — Production-quality landing page
 *
 * Sections with tone alternation:
 * 1. HeroSection (muted) — badge, gradient title, subtitle, 2 CTAs
 * 2. Features (ghost) — 3-column card grid, first card accent
 * 3. Roadmap (muted) — animated timeline with horizontal/vertical layout
 * 4. Showcase (ghost) — Bento asymmetric grid
 * 5. CallToAction (accent) — conversion section
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function HomeTemplate({
  namespace,
  features,
  steps,
  children,
}: HomeTemplateProps) {
  const { t } = useTranslation(namespace ? [namespace, 'dndev'] : 'dndev');

  const defaultFeatures: CardItem[] = [
    {
      title: t('templates.home.features.feature1.title'),
      description: t('templates.home.features.feature1.description'),
      icon: Zap,
    },
    {
      title: t('templates.home.features.feature2.title'),
      description: t('templates.home.features.feature2.description'),
      icon: Shield,
    },
    {
      title: t('templates.home.features.feature3.title'),
      description: t('templates.home.features.feature3.description'),
      icon: Rocket,
    },
  ];

  const defaultSteps: RoadmapStep[] = [
    {
      phase: t('templates.home.howItWorks.step1.title'),
      icon: UserPlus,
      title: t('templates.home.howItWorks.step1.title'),
      subtitle: t('templates.home.howItWorks.step1.description'),
    },
    {
      phase: t('templates.home.howItWorks.step2.title'),
      icon: Settings,
      title: t('templates.home.howItWorks.step2.title'),
      subtitle: t('templates.home.howItWorks.step2.description'),
    },
    {
      phase: t('templates.home.howItWorks.step3.title'),
      icon: Play,
      title: t('templates.home.howItWorks.step3.title'),
      subtitle: t('templates.home.howItWorks.step3.description'),
    },
  ];

  const resolvedFeatures = features ?? defaultFeatures;
  const resolvedSteps = steps ?? defaultSteps;

  const bentoItems = [
    {
      id: 'showcase-1',
      span: { cols: 2 },
      content: (
        <Card
          variant={CARD_VARIANT.ACCENT}
          icon={Zap}
          title={t('templates.home.showcase.item1.title')}
          content={t('templates.home.showcase.item1.description')}
          style={{ height: '100%' }}
        />
      ),
    },
    {
      id: 'showcase-2',
      content: (
        <Card
          title={t('templates.home.showcase.item2.title')}
          content={t('templates.home.showcase.item2.description')}
          style={{ height: '100%' }}
        />
      ),
    },
    {
      id: 'showcase-3',
      content: (
        <Card
          title={t('templates.home.showcase.item3.title')}
          content={t('templates.home.showcase.item3.description')}
          style={{ height: '100%' }}
        />
      ),
    },
    {
      id: 'showcase-4',
      content: (
        <Card
          title={t('templates.home.showcase.item4.title')}
          content={t('templates.home.showcase.item4.description')}
          style={{ height: '100%' }}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 1. Hero — muted tone, full height for impact */}
      <HeroSection
        tone="muted"
        fullHeight
        badge={t('templates.home.hero.badge')}
        title={t('templates.home.hero.title')}
        subtitle={t('templates.home.hero.subtitle')}
      />

      {/* 2. Features — ghost tone, 3-column responsive grid */}
      <Section
        title={t('templates.home.features.title')}
        tone="ghost"
        gridCols={[1, 1, 2, 3] as [number, number, number, number]}
      >
        {resolvedFeatures.map((feature, i) => (
          <Card
            key={feature.title}
            variant={i === 0 ? CARD_VARIANT.ACCENT : undefined}
            icon={feature.icon}
            title={feature.title}
            content={feature.description}
          />
        ))}
      </Section>

      {/* 3. Roadmap — muted tone, animated timeline */}
      <Section title={t('templates.home.howItWorks.title')} tone="muted">
        <Roadmap steps={resolvedSteps} />
      </Section>

      {/* 4. Showcase — ghost tone, Bento asymmetric grid */}
      <Section title={t('templates.home.showcase.title')} tone="ghost">
        <Bento
          items={bentoItems}
          columns={{ mobile: 1, tablet: 2, desktop: 3, wide: 3 }}
          gap="medium"
        />
      </Section>

      {/* Consumer-injected sections */}
      {children}

      {/* 5. CTA — accent tone for conversion */}
      <CallToAction
        tone="accent"
        title={t('templates.home.cta.title')}
        subtitle={t('templates.home.cta.subtitle')}
        primaryAction={
          <Button variant={BUTTON_VARIANT.PRIMARY}>
            {t('templates.home.cta.primaryAction')}
          </Button>
        }
        secondaryAction={
          <Button variant={BUTTON_VARIANT.OUTLINE}>
            {t('templates.home.cta.secondaryAction')}
          </Button>
        }
      />
    </PageContainer>
  );
}
