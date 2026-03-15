'use client';
// packages/templates/src/crud/ProductCardListTemplate.tsx

/**
 * @fileoverview Showcase product card list CRUD template.
 * @description Specialized template for product/catalog showcases with prominent pricing,
 * badges, and spec pills. Perfect for e-commerce, car listings, real estate, etc.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings and
 * RTL physical properties on absolutely-positioned decorative elements are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates a product card listing pattern.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Heart } from 'lucide-react';
import { useMemo, useCallback } from 'react';

import {
  Grid,
  Card,
  Stack,
  Text,
  Section,
  Badge,
  Button,
  Skeleton,
} from '@donotdev/components';
import {
  useTranslation,
  getListCardFieldNames,
  useBreakpoint,
} from '@donotdev/core';
import type { EntityCardListProps } from '@donotdev/core';
import {
  isCrudModuleAvailable,
  translateFieldLabel,
  useCrudCardList,
  EntityFilters,
  matchesFilter,
  useEntityFavorites,
  formatValue,
  useCrudFilters,
} from './crudImports';
import { useNavigate } from '@donotdev/ui';

export interface ProductCardListTemplateProps extends Omit<
  EntityCardListProps,
  'cols'
> {
  /** Page title (optional - defaults to entity name) */
  title?: string;
  /** Page description (optional) */
  description?: string;
  /** Grid columns (responsive) - defaults to [1, 2, 3, 4] */
  cols?: number | [number, number, number, number];
  /** Field names to use for title (combined with space) - defaults to first text field */
  titleFields?: string[];
  /** Field name for subtitle (optional) */
  subtitleField?: string;
  /** Field name for price (type: 'price') - optional, auto-detects first price field */
  priceField?: string;
  /** Field names to show as spec pills (optional - auto-detects number/select fields) */
  specsFields?: string[];
  /** Field name for status badge (optional - auto-detects 'status' field) */
  badgeField?: string;
  /** Locale for formatting - defaults to browser locale */
  locale?: string;
  /** Image aspect ratio - defaults to '4/3' */
  imageAspectRatio?: string;
  /** When true, render only the grid (and empty state) without the results Section title/collapsible */
  hideSection?: boolean;
}

/**
 * Badge variant mapping for common statuses
 */
const BADGE_VARIANTS: Record<
  string,
  'success' | 'warning' | 'destructive' | 'secondary' | 'outline'
> = {
  available: 'success',
  active: 'success',
  in_stock: 'success',
  new: 'success',
  pending: 'warning',
  reserved: 'warning',
  low_stock: 'warning',
  sold: 'destructive',
  unavailable: 'destructive',
  out_of_stock: 'destructive',
  inactive: 'secondary',
  draft: 'outline',
};

/**
 * Get badge variant from status value
 */
function getBadgeVariant(
  status: string
): 'success' | 'warning' | 'destructive' | 'secondary' | 'outline' {
  const normalized = String(status).toLowerCase().replace(/[\s-]/g, '_');
  return BADGE_VARIANTS[normalized] || 'secondary';
}

/**
 * Product Card List Template
 *
 * Specialized template for product/catalog showcases featuring:
 * - Prominent price display with currency formatting
 * - Flexible title from multiple fields
 * - Status badge with auto-variant
 * - Spec pills for key attributes
 * - Hover zoom effect on images
 * - Responsive grid layout
 *
 * @param props - ProductCardListTemplate component props
 * @returns React component
 */
export function ProductCardListTemplate({
  entity,
  title,
  description,
  basePath,
  onClick,
  cols = [1, 2, 3, 4],
  staleTime = 1000 * 60 * 30,
  filter,
  hideFilters = false,
  titleFields,
  subtitleField,
  priceField,
  specsFields,
  badgeField,
  locale,
  imageAspectRatio = '4/3',
  hideSection = false,
}: ProductCardListTemplateProps) {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  const navigate = useNavigate();
  const base = basePath ?? `/${entity.collection}`;
  // Entity + crud so formatValue and crud keys use t('crud:key')
  const { t, i18n } = useTranslation([entity.namespace, 'crud']);

  // Resolve locale
  const resolvedLocale = locale || i18n?.language?.replace('_', '-') || 'en-US';

  // Breakpoint-aware skeleton count: 3 rows at current breakpoint
  const bp = useBreakpoint('current');
  const bpIndex: Record<string, number> = {
    mobile: 0,
    tablet: 1,
    laptop: 2,
    desktop: 3,
  };
  const colIndex = bpIndex[bp] ?? 3;
  const currentCols = Array.isArray(cols)
    ? (cols[colIndex] ?? 3)
    : (cols as number);
  const skeletonCount = currentCols * 3;

  // Auto-detect price field (type: 'price')
  const resolvedPriceField = useMemo(() => {
    if (priceField) return priceField;
    return (
      Object.keys(entity.fields).find(
        (name) => entity.fields[name]?.type === 'price'
      ) ?? undefined
    );
  }, [priceField, entity.fields]);

  const resolvedBadgeField = useMemo(() => {
    if (badgeField) return badgeField;
    // Auto-detect status/badge field
    const statusNames = ['status', 'state', 'condition', 'availability'];
    return Object.keys(entity.fields).find(
      (name) =>
        statusNames.includes(name.toLowerCase()) &&
        (entity.fields[name]?.type === 'select' ||
          entity.fields[name]?.type === 'text')
    );
  }, [badgeField, entity.fields]);

  const resolvedTitleFields = useMemo(() => {
    if (titleFields && titleFields.length > 0) return titleFields;
    // Default to first text field
    const textField = Object.keys(entity.fields).find(
      (name) => entity.fields[name]?.type === 'text'
    );
    return textField ? [textField] : [];
  }, [titleFields, entity.fields]);

  const resolvedSpecsFields = useMemo(() => {
    if (specsFields && specsFields.length > 0) return specsFields;
    // Auto-detect number and select fields (excluding price and badge)
    return Object.keys(entity.fields)
      .filter((name) => {
        if (name === resolvedPriceField || name === resolvedBadgeField)
          return false;
        const fieldType = entity.fields[name]?.type;
        return fieldType === 'number' || fieldType === 'select';
      })
      .slice(0, 3);
  }, [specsFields, entity.fields, resolvedPriceField, resolvedBadgeField]);

  // Data fetching
  const { data: listData, loading } = useCrudCardList(entity, { staleTime });
  const rawData = listData?.items || [];

  // Favorites - always enabled, no props needed
  const { isFavorite, toggleFavorite, favoritesFilter } = useEntityFavorites({
    collection: entity.collection,
  });

  // Favorites toggle + filters from CrudStore (persists across navigation)
  const { showFavoritesOnly, setShowFavoritesOnly, filters } = useCrudFilters({
    collection: entity.collection,
  });

  // Apply filters
  const applyFilters = useCallback(
    (item: Record<string, unknown>): boolean => {
      if (Object.keys(filters).length === 0) return true;
      return Object.entries(filters).every(([fieldName, filterValue]) => {
        const itemValue = item[fieldName];
        const fieldConfig = entity.fields[fieldName];
        const fieldType = fieldConfig?.type || 'text';
        return matchesFilter(itemValue, filterValue, fieldType);
      });
    },
    [filters, entity.fields]
  );

  // Filtered data (including favorites)
  const data = useMemo(() => {
    let result = rawData;
    result = result.filter(applyFilters);
    // Apply favorites filter if enabled
    if (showFavoritesOnly) {
      result = result.filter(favoritesFilter);
    }
    if (filter) {
      result = result.filter(filter);
    }
    return result;
  }, [rawData, applyFilters, showFavoritesOnly, favoritesFilter, filter]);

  // Find image field
  const imageField = useMemo(() => {
    const cardFields: string[] = getListCardFieldNames(entity);
    const imageFieldInList = cardFields.find((fieldName: string) => {
      const fieldConfig = entity.fields[fieldName];
      return fieldConfig?.type === 'image' || fieldConfig?.type === 'images';
    });
    if (imageFieldInList) return imageFieldInList;

    // Fallback: search all entity fields (sorted for deterministic selection)
    return Object.keys(entity.fields)
      .sort()
      .find((fieldName) => {
        const fieldConfig = entity.fields[fieldName];
        return fieldConfig?.type === 'image' || fieldConfig?.type === 'images';
      });
  }, [entity.listCardFields, entity.listFields, entity.fields]);

  // Card click: onClick(id) if provided, else navigate to basePath/:id
  const handleView = useCallback(
    (id: string) => {
      if (onClick) {
        onClick(id);
      } else {
        navigate(`${base}/${id}`);
      }
    },
    [base, navigate, onClick]
  );

  const pageTitle = title || t('name', { defaultValue: entity.name });
  const pageDescription = description || t('description', { defaultValue: '' });
  const entityName = t('name', { defaultValue: entity.name });

  return (
    <>
      {/* Page Header */}
      {(pageTitle || pageDescription) && (
        <header style={{ marginBottom: 'var(--gap-lg)' }}>
          {pageTitle && (
            <h1
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 700,
                margin: 0,
                marginBottom: pageDescription ? 'var(--gap-sm)' : 0,
              }}
            >
              {pageTitle}
            </h1>
          )}
          {pageDescription && (
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--muted-foreground)',
                margin: 0,
              }}
            >
              {pageDescription}
            </p>
          )}
        </header>
      )}

      {/* Filters Section */}
      {!hideFilters && (
        <Section
          title={t('crud:filters.title', {
            entity: entityName,
            defaultValue: `Browse ${entityName} - Filters`,
          })}
          collapsible
          defaultOpen={true}
        >
          <Stack direction="column">
            {/* Favorites Toggle - always shown */}
            <Button
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              icon={<Heart size={18} />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              {showFavoritesOnly
                ? t('crud:favorites.showAll', { defaultValue: 'Show All' })
                : t('crud:favorites.showFavorites', {
                    defaultValue: 'Show Favorites',
                  })}
            </Button>

            <EntityFilters
              entity={entity}
              data={rawData}
              fieldsToFilter={getListCardFieldNames(entity)}
            />
          </Stack>
        </Section>
      )}

      {/* Results: grid only when hideSection, otherwise wrapped in Section */}
      {(() => {
        const resultsContent = loading ? (
          <Grid cols={cols}>
            {Array.from({ length: skeletonCount }, (_, i) => (
              <Card
                key={i}
                title={<Skeleton width="60%" />}
                subtitle={<Skeleton width="40%" />}
                content={
                  <Stack direction="column" gap="tight">
                    <Skeleton width="80%" />
                    <Skeleton width="50%" />
                  </Stack>
                }
                elevated
              />
            ))}
          </Grid>
        ) : data.length === 0 ? (
          <Stack
            align="center"
            justify="center"
            style={{ padding: 'var(--gap-3xl)', textAlign: 'center' }}
          >
            <Text level="h3" style={{ color: 'var(--muted-foreground)' }}>
              {t('crud:emptyState.title', {
                defaultValue: `No ${entity.name.toLowerCase()} found`,
              })}
            </Text>
            <Text style={{ color: 'var(--muted-foreground)' }}>
              {t('crud:emptyState.description', {
                defaultValue: `No ${entity.name.toLowerCase()} available at this time.`,
              })}
            </Text>
          </Stack>
        ) : (
          <Grid cols={cols}>
            {data.map((item: Record<string, unknown>) => {
              // Get image URL
              // Backend optimizes picture fields for listCard: returns thumbUrl string directly
              // If imageField is not in listCardFields, item[imageField] will be undefined
              const imageValue = imageField ? item[imageField] : null;
              const imageUrl: string | null =
                typeof imageValue === 'string' && imageValue.length > 0
                  ? imageValue
                  : null;

              // Build title from configured fields
              const titleParts = resolvedTitleFields
                .map((field) => item[field])
                .filter(Boolean);
              const itemTitle = titleParts.join(' ') || String(item.id ?? '');

              // Get subtitle
              const subtitle = subtitleField
                ? (item[subtitleField] as string | null | undefined)
                : null;

              // Get price (price field type: { amount, currency?, vatIncluded?, discountPercent? })
              const priceValue = resolvedPriceField
                ? item[resolvedPriceField]
                : null;
              const priceFieldConfig = resolvedPriceField
                ? entity.fields[resolvedPriceField]
                : null;
              // Get badge/status
              const badgeValue = resolvedBadgeField
                ? (item[resolvedBadgeField] as string | null | undefined)
                : null;

              const itemIsFavorite = isFavorite(item.id as string);

              return (
                <Card
                  key={item.id as string}
                  clickable
                  onClick={() => handleView(item.id as string)}
                  elevated
                  style={{
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Heart Icon - positioned absolutely on card (Card has position: relative from CSS) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id as string);
                    }}
                    style={{
                      position: 'absolute',
                      top: 'var(--gap-sm)',
                      insetInlineStart: 'var(--gap-sm)',
                      zIndex: 10,
                      cursor: 'pointer',
                      padding: 'var(--gap-xs)',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s',
                      border: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.9)';
                    }}
                    aria-label={
                      itemIsFavorite
                        ? t('crud:favorites.remove', {
                            defaultValue: 'Remove from favorites',
                          })
                        : t('crud:favorites.add', {
                            defaultValue: 'Add to favorites',
                          })
                    }
                  >
                    <Heart
                      size={20}
                      fill={itemIsFavorite ? '#ef4444' : '#ffffff'}
                      stroke={itemIsFavorite ? '#ef4444' : '#ffffff'}
                      style={{
                        transition: 'fill 0.2s, stroke 0.2s',
                      }}
                    />
                  </button>

                  <Stack direction="column">
                    {/* Image with badge overlay */}
                    {imageUrl && (
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: imageAspectRatio,
                          overflow: 'hidden',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--muted)',
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={itemTitle}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        {/* Badge overlay - Top Right */}
                        {badgeValue && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'var(--gap-sm)',
                              insetInlineEnd: 'var(--gap-sm)',
                            }}
                          >
                            <Badge variant={getBadgeVariant(badgeValue)}>
                              {translateFieldLabel(
                                String(badgeValue),
                                entity.fields[resolvedBadgeField!],
                                t
                              )}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content */}
                    <Stack direction="column" gap="tight">
                      {/* Title & Subtitle */}
                      <div>
                        <Text level="h4" style={{ margin: 0 }}>
                          {itemTitle}
                        </Text>
                        {subtitle && (
                          <Text
                            level="small"
                            variant="muted"
                            style={{ marginTop: 'var(--gap-xs)' }}
                          >
                            {subtitle}
                          </Text>
                        )}
                      </div>

                      {/* Price */}
                      {priceValue != null && priceFieldConfig && (
                        <div
                          style={{
                            fontSize: 'var(--font-size-2xl)',
                            fontWeight: 700,
                            color: 'var(--primary)',
                          }}
                        >
                          {(() => {
                            const priceDisplay = formatValue(
                              priceValue,
                              priceFieldConfig,
                              t,
                              { compact: true }
                            );
                            return typeof priceDisplay === 'string'
                              ? priceDisplay
                              : priceDisplay;
                          })()}
                        </div>
                      )}

                      {/* Spec pills */}
                      {resolvedSpecsFields.length > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--gap-xs)',
                          }}
                        >
                          {resolvedSpecsFields.map((fieldName) => {
                            const value = item[fieldName];
                            if (value === undefined || value === null)
                              return null;
                            const fieldConfig = entity.fields[fieldName];
                            const label = translateFieldLabel(
                              fieldName,
                              fieldConfig,
                              t
                            );

                            // Format value using single source of truth
                            const displayValue = fieldConfig
                              ? formatValue(value, fieldConfig, t, {
                                  compact: true,
                                })
                              : String(value);

                            return (
                              <span
                                key={fieldName}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 'var(--gap-xs)',
                                  padding: 'var(--gap-xs) var(--gap-sm)',
                                  background: 'var(--muted)',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: 'var(--font-size-sm)',
                                  color: 'var(--muted-foreground)',
                                }}
                              >
                                {label}: {displayValue}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        );
        return hideSection ? (
          resultsContent
        ) : (
          <Section
            title={
              loading
                ? t('crud:results.title.fetching', {
                    defaultValue: 'Fetching...',
                  })
                : t('crud:results.title.count', {
                    count: data.length,
                    defaultValue:
                      data.length === 1
                        ? 'Found 1 item'
                        : `Found ${data.length} items`,
                  })
            }
            collapsible
            defaultOpen={true}
          >
            {resultsContent}
          </Section>
        );
      })()}
    </>
  );
}
