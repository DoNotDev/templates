'use client';
// packages/templates/src/WhatsNewTemplate.tsx

/**
 * @fileoverview Showcase changelog/what's-new template.
 * @description Template component for displaying changelog and what's new information.
 * Features version history, changelog entries, and release information display.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates the changelog/what's-new pattern.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState, useMemo } from 'react';

import {
  cn,
  Badge,
  BADGE_VARIANT,
  Card,
  Stack,
  Grid,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';

// Using emojis instead of Lucide icons for modern conventions

/**
 * Changelog entry interface
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch' | 'preview' | 'beta';
  title: string;
  description: string;
  changes: {
    type:
      | 'added'
      | 'changed'
      | 'deprecated'
      | 'removed'
      | 'fixed'
      | 'security'
      | 'performance';
    items: string[];
  }[];
  breaking?: string[];
  contributors?: string[];
  pullRequests?: string[];
}

/**
 * Props for WhatsNewTemplate component
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export interface WhatsNewTemplateProps {
  changelog: ChangelogEntry[];
  className?: string;
  showNavigation?: boolean;
  showVersionBadges?: boolean;
  maxEntries?: number;
  onVersionSelect?: (version: string) => void;
}

/**
 * What's New Template Component
 *
 * Template component for displaying changelog and what's new information. Features version history, changelog entries, and release information display.
 *
 * @param props - WhatsNewTemplate component props
 * @returns React component
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */
export function WhatsNewTemplate({
  changelog,
  className,
  showNavigation = true,
  showVersionBadges = true,
  maxEntries,
  onVersionSelect,
}: WhatsNewTemplateProps) {
  const { t } = useTranslation('whatsNew');
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const filteredChangelog = useMemo(
    () => (maxEntries ? changelog.slice(0, maxEntries) : changelog),
    [changelog, maxEntries]
  );

  const getTypeBadgeVariant = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'major':
        return BADGE_VARIANT.DESTRUCTIVE;
      case 'minor':
        return BADGE_VARIANT.PRIMARY;
      case 'patch':
        return BADGE_VARIANT.SUCCESS;
      case 'preview':
        return BADGE_VARIANT.ACCENT;
      case 'beta':
        return BADGE_VARIANT.WARNING;
      default:
        return BADGE_VARIANT.MUTED;
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return '🟢';
      case 'changed':
        return '🟡';
      case 'deprecated':
        return '🟠';
      case 'removed':
        return '🔴';
      case 'fixed':
        return '🔧';
      case 'security':
        return '🔒';
      case 'performance':
        return '⚡';
      default:
        return '•';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'var(--success)';
      case 'changed':
        return 'var(--warning)';
      case 'deprecated':
        return 'var(--warning)';
      case 'removed':
        return 'var(--destructive)';
      case 'fixed':
        return 'var(--primary)';
      case 'security':
        return 'var(--accent)';
      case 'performance':
        return 'var(--primary)';
      default:
        return 'var(--muted-foreground)';
    }
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    onVersionSelect?.(version);
  };

  const selectedEntry = selectedVersion
    ? changelog.find((entry) => entry.version === selectedVersion)
    : filteredChangelog[0];

  return (
    <div
      className={cn('dndev-w-full dndev-mx-auto', className)}
      style={{ maxWidth: '72rem' }}
    >
      {/* Header */}
      <div
        className="dndev-text-center"
        style={{ marginBottom: 'var(--gap-lg)' }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 700,
            color: 'var(--foreground)',
            marginBottom: 'var(--gap-md)',
          }}
        >
          {t('title', "What's New in DnDev")}
        </h1>
        <p
          className="dndev-mx-auto"
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--muted-foreground)',
            maxWidth: '42rem',
          }}
        >
          {t(
            'subtitle',
            'Stay up to date with the latest features, improvements, and fixes in the DoNotDev Framework'
          )}
        </p>
      </div>

      <Grid cols={4} gap="large" className="dndev-grid-responsive-1-4">
        {/* Version Navigation */}
        {showNavigation && (
          <div style={{ gridColumn: 'span 1' }}>
            <Card
              title={
                <Stack direction="row" align="center" gap="tight">
                  🌿 Versions
                </Stack>
              }
            >
              <Stack gap="tight">
                {filteredChangelog.map((entry) => (
                  <button
                    key={entry.version}
                    onClick={() => handleVersionSelect(entry.version)}
                    className="dndev-w-full dndev-text-left dndev-surface"
                    data-variant={
                      selectedEntry?.version === entry.version
                        ? 'accent'
                        : 'default'
                    }
                    style={{
                      padding: 'var(--gap-md)',
                      borderInlineStart:
                        selectedEntry?.version === entry.version
                          ? '2px solid var(--primary)'
                          : undefined,
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Stack
                      direction="row"
                      align="center"
                      justify="between"
                      style={{ marginBottom: 'var(--gap-sm)' }}
                    >
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 500,
                        }}
                      >
                        {entry.version}
                      </span>
                      {showVersionBadges && (
                        <Badge
                          variant={getTypeBadgeVariant(entry.type)}
                          style={{ fontSize: 'var(--font-size-xs)' }}
                        >
                          {entry.type}
                        </Badge>
                      )}
                    </Stack>
                    <Stack
                      direction="row"
                      align="center"
                      gap="tight"
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      📅 {new Date(entry.date).toLocaleDateString()}
                    </Stack>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        marginTop: 'var(--gap-sm)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {entry.title}
                    </div>
                  </button>
                ))}
              </Stack>
            </Card>
          </div>
        )}

        {/* Changelog Content */}
        <div style={{ gridColumn: 'span 3' }}>
          {selectedEntry && (
            <Card
              title={
                <Stack direction="row" align="start" justify="between">
                  <div>
                    <Stack
                      direction="row"
                      align="center"
                      style={{ marginBottom: 'var(--gap-sm)' }}
                    >
                      <h2
                        style={{
                          fontSize: 'var(--font-size-2xl)',
                          fontWeight: 700,
                          color: 'var(--foreground)',
                        }}
                      >
                        {selectedEntry.title}
                      </h2>
                      {showVersionBadges && (
                        <Badge
                          variant={getTypeBadgeVariant(selectedEntry.type)}
                          style={{ fontSize: 'var(--font-size-sm)' }}
                        >
                          {selectedEntry.type}
                        </Badge>
                      )}
                    </Stack>
                    <Stack
                      direction="row"
                      align="center"
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      <Stack direction="row" align="center" gap="tight">
                        🏷️{' '}
                        <span style={{ fontFamily: 'monospace' }}>
                          {selectedEntry.version}
                        </span>
                      </Stack>
                      <Stack direction="row" align="center" gap="tight">
                        📅 {new Date(selectedEntry.date).toLocaleDateString()}
                      </Stack>
                    </Stack>
                  </div>
                </Stack>
              }
              subtitle={selectedEntry.description}
            >
              <Stack>
                {/* Changes */}
                {selectedEntry.changes.map((changeGroup) => (
                  <Stack key={changeGroup.type}>
                    <h3
                      className="dndev-flex dndev-items-center dndev-gap-sm" // Keep semantic class for icon? No, use Stack.
                      style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 600,
                        color: getChangeTypeColor(changeGroup.type),
                      }}
                    >
                      <Stack
                        direction="row"
                        align="center"
                        gap="tight"
                        as="span"
                      >
                        <span>{getChangeTypeIcon(changeGroup.type)}</span>
                        <span>
                          {changeGroup.type.charAt(0).toUpperCase() +
                            changeGroup.type.slice(1)}
                        </span>
                      </Stack>
                    </h3>
                    <Stack
                      as="ul"
                      gap="tight"
                      style={{ marginInlineStart: '1.5rem' }}
                    >
                      {changeGroup.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </Stack>
                  </Stack>
                ))}

                {/* Breaking Changes */}
                {selectedEntry.breaking &&
                  selectedEntry.breaking.length > 0 && (
                    <div
                      style={{
                        borderInlineStart: '4px solid var(--destructive)',
                        paddingInlineStart: 'var(--gap-md)',
                        paddingTop: 'var(--gap-sm)',
                        paddingBottom: 'var(--gap-sm)',
                        backgroundColor:
                          'color-mix(in oklab, var(--destructive) 10%, transparent)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 'var(--font-size-lg)',
                          fontWeight: 600,
                          color: 'var(--destructive)',
                          marginBottom: 'var(--gap-sm)',
                        }}
                      >
                        ⚠️ Breaking Changes
                      </h3>
                      <Stack as="ul" gap="tight">
                        {selectedEntry.breaking.map((change) => (
                          <li
                            key={change}
                            style={{
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--destructive)',
                            }}
                          >
                            {change}
                          </li>
                        ))}
                      </Stack>
                    </div>
                  )}

                {/* Contributors & PRs */}
                {(selectedEntry.contributors || selectedEntry.pullRequests) && (
                  <div
                    style={{
                      paddingTop: 'var(--gap-md)',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <Grid cols={2} className="dndev-grid-responsive-1-2">
                      {selectedEntry.contributors && (
                        <div>
                          <h4
                            style={{
                              fontWeight: 500,
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--muted-foreground)',
                              marginBottom: 'var(--gap-sm)',
                            }}
                          >
                            Contributors
                          </h4>
                          <Stack direction="row" wrap="wrap" gap="tight">
                            {selectedEntry.contributors.map((contributor) => (
                              <Badge
                                key={contributor}
                                variant={BADGE_VARIANT.OUTLINE}
                                style={{ fontSize: 'var(--font-size-xs)' }}
                              >
                                {contributor}
                              </Badge>
                            ))}
                          </Stack>
                        </div>
                      )}
                      {selectedEntry.pullRequests && (
                        <div>
                          <h4
                            style={{
                              fontWeight: 500,
                              fontSize: 'var(--font-size-sm)',
                              color: 'var(--muted-foreground)',
                              marginBottom: 'var(--gap-sm)',
                            }}
                          >
                            Pull Requests
                          </h4>
                          <Stack direction="row" wrap="wrap" gap="tight">
                            {selectedEntry.pullRequests.map((pr) => (
                              <Badge
                                key={pr}
                                variant={BADGE_VARIANT.OUTLINE}
                                style={{ fontSize: 'var(--font-size-xs)' }}
                              >
                                #{pr}
                              </Badge>
                            ))}
                          </Stack>
                        </div>
                      )}
                    </Grid>
                  </div>
                )}
              </Stack>
            </Card>
          )}
        </div>
      </Grid>
    </div>
  );
}
