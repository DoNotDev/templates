'use client';
// packages/templates/src/crud/CarCardListTemplate.tsx

/**
 * @fileoverview Showcase vehicle card list CRUD template.
 * @description Specialized template for vehicle listings with make, model, image, specs, and price.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings and
 * RTL physical properties on absolutely-positioned decorative elements are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates a card-based entity listing.
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Heart, Calendar, Gauge, Fuel, Sliders } from 'lucide-react';
import { useMemo, useCallback, useState } from 'react';

import {
  Grid,
  Card,
  Stack,
  Text,
  Section,
  Button,
  Skeleton,
  Badge,
} from '@donotdev/components';
import {
  useTranslation,
  getListCardFieldNames,
  useBreakpoint,
} from '@donotdev/core';
import type { EntityCardListProps } from '@donotdev/core';
import {
  isCrudModuleAvailable,
  useCrudCardList,
  useCrudFilters,
  EntityFilters,
  matchesFilter,
  useEntityFavorites,
  formatValue,
} from './crudImports';

/** Normalized "sold" for VO / catalog (FR: vendu, EN: sold). */
function isSoldStatus(value: unknown): boolean {
  if (value == null || value === '') return false;
  const n = String(value).toLowerCase().replace(/[\s-]+/g, '_');
  return n === 'sold' || n === 'vendu';
}
import { Link } from '@donotdev/ui';

import type { ReactElement } from 'react';

/** Props for the CarCardListTemplate component. */
export interface CarCardListTemplateProps extends Omit<
  EntityCardListProps,
  'cols'
> {
  /** Page title (optional - defaults to entity name) */
  title?: string;
  /** Page description (optional) */
  description?: string;
  /** Grid columns (responsive) - defaults to [1, 2, 3, 4] */
  cols?: number | [number, number, number, number];
  /** Field name for make (subtitle) - defaults to 'make' */
  makeField?: string;
  /** Field name for model (title) - defaults to 'model' */
  modelField?: string;
  /** Field name for image - defaults to 'images' */
  imageField?: string;
  /** Field name for mileage - defaults to 'mileage' */
  mileageField?: string;
  /** Field name for year - defaults to 'year' */
  yearField?: string;
  /** Field name for transmission - defaults to 'transmission' */
  transmissionField?: string;
  /** Field name for fuel type - defaults to 'fuelType' */
  fuelTypeField?: string;
  /** Field name for price (type: 'price') - defaults to 'price' */
  priceField?: string;
  /** Field name for subtitle/variant - defaults to 'variant' */
  subtitleField?: string;
  /** Locale for formatting - defaults to browser locale */
  locale?: string;
  /** Image aspect ratio - defaults to '16/9' */
  imageAspectRatio?: string;
  /** When true, render only the grid (and loading/empty state) without the results Section title/collapsible */
  hideSection?: boolean;
  /**
   * Field used for sold overlay (e.g. select `status` with option `sold`).
   * When omitted, uses the first existing field among: status, state, availability.
   */
  statusField?: string;
}

/**
 * Vehicle Card List Template
 *
 * Specialized template for vehicle listings featuring:
 * - Make as subtitle (top)
 * - Model as title (below image)
 * - Large vehicle image
 * - Mileage/Year and Transmission/Fuel as specs
 * - Prominent price display
 * - Heart icon for favorites
 * - “Sold” badge on image when status (or configured field) is sold / vendu
 *
 * @param props - CarCardListTemplate component props
 * @returns React component
 */
export function CarCardListTemplate({
  entity,
  title,
  description,
  basePath,
  onClick,
  cols = [1, 2, 3, 4],
  staleTime = 1000 * 60 * 30,
  filter,
  hideFilters = false,
  makeField = 'make',
  modelField = 'model',
  imageField = 'images',
  mileageField = 'mileage',
  yearField = 'year',
  transmissionField = 'transmission',
  fuelTypeField = 'fuelType',
  priceField = 'price',
  subtitleField = 'variant',
  locale,
  imageAspectRatio = '16/9',
  hideSection = false,
  statusField,
}: CarCardListTemplateProps) {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  const base = basePath ?? `/${entity.collection}`;
  const collection = entity.collection;
  // Entity + crud so formatValue can resolve crud:price.* etc.
  const { t, i18n } = useTranslation([entity.namespace, 'crud']);
  const { t: tCrud } = useTranslation('crud');

  // Resolve locale for non-currency formatting (mileage, etc.)
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

  const resolvedStatusField = useMemo(() => {
    if (statusField) return statusField;
    const candidates = ['status', 'state', 'availability'];
    return (
      candidates.find((name) => entity.fields[name] != null) ?? 'status'
    );
  }, [statusField, entity.fields]);

  // Data fetching
  const {
    data: listData,
    loading,
    error: fetchError,
  } = useCrudCardList(entity, { staleTime });
  const rawData = listData?.items || [];

  // Favorites - always enabled
  const { isFavorite, toggleFavorite, favoritesFilter } = useEntityFavorites({
    collection,
  });

  // Favorites toggle + filters from CrudStore (persists across navigation)
  const { showFavoritesOnly, setShowFavoritesOnly, filters } = useCrudFilters({
    collection,
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
    if (showFavoritesOnly) {
      result = result.filter(favoritesFilter);
    }
    if (filter) {
      result = result.filter(filter);
    }
    return result;
  }, [rawData, applyFilters, showFavoritesOnly, favoritesFilter, filter]);

  const entityName = t('name', { defaultValue: entity.name });

  return (
    <>
      {/* Filters Section */}
      {!hideFilters && (
        <Section
          title={tCrud('filters.title', {
            entity: entityName,
            defaultValue: `Browse ${entityName} - Filters`,
          })}
          collapsible
          defaultOpen={true}
        >
          <Stack direction="column">
            {/* Favorites Toggle */}
            <Button
              variant={showFavoritesOnly ? 'primary' : 'outline'}
              icon={<Heart size={18} />}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              {showFavoritesOnly
                ? tCrud('favorites.showAll', { defaultValue: 'Show All' })
                : tCrud('favorites.showFavorites', {
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
        ) : fetchError ? (
          <Stack
            align="center"
            justify="center"
            style={{ padding: 'var(--gap-3xl)', textAlign: 'center' }}
          >
            <Text level="h3" style={{ color: 'var(--destructive)' }}>
              {tCrud('errors.fetchFailed', {
                defaultValue: `Failed to load ${entity.name.toLowerCase()}`,
              })}
            </Text>
            <Text level="small" style={{ color: 'var(--destructive)' }}>
              {fetchError instanceof Error
                ? fetchError.message
                : String(fetchError)}
            </Text>
          </Stack>
        ) : data.length === 0 ? (
          <Stack
            align="center"
            justify="center"
            style={{ padding: 'var(--gap-3xl)', textAlign: 'center' }}
          >
            <Text level="h3" style={{ color: 'var(--muted-foreground)' }}>
              {tCrud('emptyState.title', {
                defaultValue: `No ${entity.name.toLowerCase()} found`,
              })}
            </Text>
            <Text style={{ color: 'var(--muted-foreground)' }}>
              {tCrud('emptyState.description', {
                defaultValue: `No ${entity.name.toLowerCase()} available at this time.`,
              })}
            </Text>
          </Stack>
        ) : (
          <Grid cols={cols}>
            {data.map((item: Record<string, unknown>) => {
              if (item == null) return null;
              const imageValue = item[imageField];
              const imageUrl: string | null =
                typeof imageValue === 'string' ? imageValue : null;

              const make = item[makeField] as string | null | undefined;
              const model = item[modelField] as string | null | undefined;
              const mileage = item[mileageField] as
                | number
                | string
                | null
                | undefined;
              const year = item[yearField] as
                | string
                | number
                | null
                | undefined;
              const transmission = item[transmissionField];
              const fuelType = item[fuelTypeField];
              const priceValue = item[priceField];
              const priceFieldConfig = entity.fields[priceField] ?? undefined;
              const subtitle = item[subtitleField ?? 'variant'] as
                | string
                | null
                | undefined;

              const statusRaw = item[resolvedStatusField];
              const statusFieldConfig = entity.fields[resolvedStatusField];
              const showSoldOverlay =
                statusFieldConfig != null && isSoldStatus(statusRaw);
              const soldLabelFormatted =
                showSoldOverlay && statusFieldConfig
                  ? formatValue(statusRaw, statusFieldConfig, t, {
                      compact: true,
                      asString: true,
                    })
                  : '';
              const soldLabel =
                typeof soldLabelFormatted === 'string' &&
                soldLabelFormatted.length > 0
                  ? soldLabelFormatted
                  : tCrud('status.sold', { defaultValue: 'Sold' });

              const itemIsFavorite = isFavorite(item.id as string);

              // Format fields using shared formatter (handles select/radio/switch, i18n, etc.)
              const transmissionFieldConfig = entity.fields[transmissionField];
              const fuelTypeFieldConfig = entity.fields[fuelTypeField];

              const transmissionDisplay =
                transmissionFieldConfig && transmission != null
                  ? formatValue(transmission, transmissionFieldConfig, t, {
                      compact: true,
                    })
                  : null;

              const fuelTypeDisplay =
                fuelTypeFieldConfig && fuelType != null
                  ? formatValue(fuelType, fuelTypeFieldConfig, t, {
                      compact: true,
                    })
                  : null;

              // Title: Make + Model
              const title = [make, model].filter(Boolean).join(' ');

              const cardBody = (
                <>
                  {/* Image - flush with card, no padding */}
                  {imageUrl && (
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: imageAspectRatio,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={title || entityName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {showSoldOverlay && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'var(--gap-sm)',
                            insetInlineStart: 'var(--gap-sm)',
                            zIndex: 2,
                          }}
                        >
                          <Badge variant="destructive">{soldLabel}</Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {!imageUrl && showSoldOverlay && (
                    <div
                      style={{
                        padding: 'var(--gap-sm) var(--gap-md) 0',
                      }}
                    >
                      <Badge variant="destructive">{soldLabel}</Badge>
                    </div>
                  )}

                  {/* Content - with padding */}
                  <Stack
                    direction="column"
                    gap="tight"
                    style={{ padding: 'var(--gap-md)' }}
                  >
                    {/* Title: Make/Model */}
                    {title && (
                      <Text level="h4" weight="semibold">
                        {title}
                      </Text>
                    )}

                    {/* Subtitle */}
                    {subtitle && (
                      <Text variant="muted" level="small">
                        {subtitle}
                      </Text>
                    )}

                    {/* Price - aligned end (price field type: amount, currency, discountPercent) */}
                    {priceValue != null &&
                      priceFieldConfig != null &&
                      (() => {
                        const config = priceFieldConfig;
                        if (!config) return null;
                        const priceResult = formatValue(priceValue, config, t, {
                          compact: true,
                        });
                        return (
                          <div
                            style={{
                              marginTop: 'var(--gap-xs)',
                              textAlign: 'end',
                            }}
                          >
                            {typeof priceResult === 'string' ? (
                              <Text
                                variant="accent"
                                textAlign="end"
                                weight="bold"
                              >
                                {priceResult}
                              </Text>
                            ) : (
                              priceResult
                            )}
                          </div>
                        );
                      })()}

                    {/* Specs with icons */}
                    <Stack
                      direction="column"
                      gap="tight"
                      style={{ marginTop: 'var(--gap-sm)' }}
                    >
                      {/* Year / Mileage */}
                      {(year || mileage) && (
                        <Stack direction="row" gap="tight" align="center">
                          {year && (
                            <Stack direction="row" gap="tight" align="center">
                              <Calendar
                                size={16}
                                style={{ color: 'var(--muted-foreground)' }}
                              />
                              <Text level="small">{year}</Text>
                            </Stack>
                          )}
                          {mileage && (
                            <Stack direction="row" gap="tight" align="center">
                              <Gauge
                                size={16}
                                style={{ color: 'var(--muted-foreground)' }}
                              />
                              <Text level="small">
                                {(() => {
                                  const mileageNum =
                                    typeof mileage === 'number'
                                      ? mileage
                                      : Number(mileage);
                                  if (isNaN(mileageNum)) {
                                    return String(mileage) + ' km';
                                  }
                                  try {
                                    return (
                                      new Intl.NumberFormat(
                                        resolvedLocale
                                      ).format(mileageNum) + ' km'
                                    );
                                  } catch {
                                    // Invalid locale fallback
                                    return String(mileageNum) + ' km';
                                  }
                                })()}
                              </Text>
                            </Stack>
                          )}
                        </Stack>
                      )}

                      {/* FuelType - Transmission */}
                      {(fuelTypeDisplay || transmissionDisplay) && (
                        <Stack direction="row" gap="tight" align="center">
                          {fuelTypeDisplay && (
                            <Stack direction="row" gap="tight" align="center">
                              <Fuel
                                size={16}
                                style={{ color: 'var(--muted-foreground)' }}
                              />
                              <Text level="small">{fuelTypeDisplay}</Text>
                            </Stack>
                          )}
                          {transmissionDisplay && (
                            <Stack direction="row" gap="tight" align="center">
                              <Sliders
                                size={16}
                                style={{ color: 'var(--muted-foreground)' }}
                              />
                              <Text level="small">{transmissionDisplay}</Text>
                            </Stack>
                          )}
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </>
              );

              const cardStyle = {
                position: 'relative' as const,
                padding: 0,
                overflow: 'hidden',
              };

              return (
                <div key={item.id as string} style={{ position: 'relative' }}>
                  {onClick ? (
                    <Card
                      clickable
                      onClick={() => onClick(item.id as string)}
                      elevated
                      style={cardStyle}
                    >
                      {cardBody}
                    </Card>
                  ) : (
                    <Card asChild clickable elevated style={cardStyle}>
                      <Link path={`${base}/${item.id}`}>{cardBody}</Link>
                    </Card>
                  )}
                  {/* Heart Icon - sibling to Card to avoid invalid <button> inside <a> */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item.id as string)}
                    style={{
                      position: 'absolute',
                      top: 'var(--gap-sm)',
                      insetInlineEnd: 'var(--gap-sm)',
                      zIndex: 10,
                      cursor: 'pointer',
                      padding: 'var(--gap-xs)',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                    }}
                    aria-label={
                      itemIsFavorite
                        ? tCrud('favorites.remove', {
                            defaultValue: 'Remove from favorites',
                          })
                        : tCrud('favorites.add', {
                            defaultValue: 'Add to favorites',
                          })
                    }
                  >
                    <Heart
                      fill={itemIsFavorite ? '#ef4444' : '#ffffff'}
                      stroke={
                        itemIsFavorite ? '#ef4444' : 'var(--muted-foreground)'
                      }
                      style={{
                        width: 'var(--icon-md)',
                        height: 'var(--icon-md)',
                        transition: 'fill 0.2s, stroke 0.2s',
                      }}
                    />
                  </button>
                </div>
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
                ? tCrud('results.title.fetching', {
                    defaultValue: 'Fetching...',
                  })
                : tCrud('results.title.count', {
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
