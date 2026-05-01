'use client';
// packages/templates/src/crud/CarDetailTemplate.tsx

/**
 * @fileoverview Car Detail Template
 * @description Full-featured vehicle detail page template with gallery, specs, and inquiry form
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Share2, Heart } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';

import {
  Grid,
  Card,
  Stack,
  Text,
  Section,
  Button,
  CopyToClipboard,
  ImageGallery,
  Spinner,
} from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import {
  isCrudModuleAvailable,
  useCrud,
  useCrudCardList,
  formatValue,
  useRelatedItems,
  useEntityFavorites,
} from './crudImports';
import { PageContainer, Link, useRouteParam } from '@donotdev/ui';

import { InquiryFormTemplate } from './InquiryFormTemplate';

import type { ReactElement } from 'react';

/** Props for the CarDetailTemplate component. */
export interface CarDetailTemplateProps {
  /** Vehicle entity definition */
  entity: Entity;
  /** Vehicle ID (if not provided, uses route params) */
  id?: string;
  /** Customer entity for inquiry form */
  customerEntity?: Entity;
  /** Inquiry entity for inquiry form */
  inquiryEntity?: Entity;
  /** Fields to match for related items (default: ['make', 'price']) */
  relatedFields?: string[];
  /** Locale for formatting (default: browser locale) */
  locale?: string;
  /** Page-specific translation namespace (default: derived from entity collection) */
  pageNamespace?: string;
  /** Field mappings */
  makeField?: string;
  modelField?: string;
  variantField?: string;
  yearField?: string;
  mileageField?: string;
  fuelTypeField?: string;
  transmissionField?: string;
  /** Field name for price (type: 'price') - defaults to 'price' */
  priceField?: string;
  imagesField?: string;
  descriptionField?: string;
  /** Context field name for inquiry (default: 'carId') */
  contextField?: string;
}

interface ImageData {
  fullUrl?: string;
  thumbUrl?: string;
}

/**
 * CarDetailTemplate - Full vehicle detail page
 */
export function CarDetailTemplate({
  entity,
  id: propId,
  customerEntity,
  inquiryEntity,
  relatedFields = ['make', 'price'],
  locale,
  makeField = 'make',
  modelField = 'model',
  variantField = 'variant',
  yearField = 'year',
  mileageField = 'mileage',
  fuelTypeField = 'fuelType',
  transmissionField = 'transmission',
  priceField = 'price',
  imagesField = 'images',
  descriptionField,
  contextField = 'carId',
  pageNamespace,
}: CarDetailTemplateProps): ReactElement | null {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  // ALL HOOKS MUST BE AT THE TOP - no early returns before hooks
  const routeId = useRouteParam('id');
  const id = propId || routeId || '';

  // Translations — entity + crud so formatValue can resolve crud:price.* etc.
  const entityNs = entity.namespace || `entity-${entity.name.toLowerCase()}`;
  const { t: tEntity, i18n } = useTranslation([entityNs, 'crud']);
  const pageNs = pageNamespace || entity.collection;
  const { t: tPage } = useTranslation(pageNs);
  const { t: tCrud } = useTranslation('crud');

  // Use user's locale for non-currency formatting (mileage, etc.)
  const effectiveLocale =
    locale || i18n?.language?.replace('_', '-') || 'en-US';

  // State for vehicle data
  const { get } = useCrud(entity);
  const [vehicleData, setVehicleData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  );

  // Fetch all vehicles for related items
  const { data: allVehiclesData } = useCrudCardList(entity, {
    staleTime: 1000 * 60 * 30,
  });

  // Favorites
  const { isFavorite, toggleFavorite } = useEntityFavorites({
    collection: entity.collection,
  });
  const saved = isFavorite(id);

  // Price field config for formatValue
  const priceFieldConfig = useMemo(
    () => entity.fields[priceField],
    [entity.fields, priceField]
  );

  const formatMileage = useCallback(
    (km: number | null | undefined): string => {
      if (km === null || km === undefined) return '—';
      return new Intl.NumberFormat(effectiveLocale).format(km) + ' km';
    },
    [effectiveLocale]
  );

  // Description field detection
  const effectiveDescriptionField = useMemo(() => {
    if (descriptionField) return descriptionField;
    const langField = `description_${effectiveLocale}`;
    if (entity.fields[langField]) return langField;
    if (entity.fields.description) return 'description';
    return null;
  }, [descriptionField, effectiveLocale, entity.fields]);

  // Normalized images
  const normalizedImages = useMemo(() => {
    const images = vehicleData?.[imagesField] as
      | ImageData[]
      | string
      | string[]
      | null
      | undefined;
    if (!images) return [];
    if (Array.isArray(images)) {
      return images.map((img) => {
        if (typeof img === 'object' && img && 'fullUrl' in img) {
          return { fullUrl: img.fullUrl, thumbUrl: img.thumbUrl };
        }
        return { fullUrl: img as string, thumbUrl: img as string };
      });
    }
    return [{ fullUrl: images as string, thumbUrl: images as string }];
  }, [vehicleData, imagesField]);

  // Vehicle name
  const vehicleName = useMemo(() => {
    if (!vehicleData) return '';
    const make = vehicleData[makeField] || '';
    const model = vehicleData[modelField] || '';
    const variant = vehicleData[variantField] || '';
    return [make, model, variant].filter(Boolean).join(' ');
  }, [vehicleData, makeField, modelField, variantField]);

  // Key specs with i18n
  const keySpecs = useMemo(() => {
    if (!vehicleData) return [];
    const specs: Array<{ label: string; value: string }> = [];

    const year = vehicleData[yearField];
    if (year !== null && year !== undefined) {
      specs.push({ label: tEntity(yearField), value: String(year) });
    }

    const mileage = vehicleData[mileageField];
    if (mileage !== null && mileage !== undefined) {
      specs.push({
        label: tEntity(mileageField),
        value: formatMileage(mileage as number),
      });
    }

    const fuelType = vehicleData[fuelTypeField];
    if (fuelType && entity.fields[fuelTypeField]) {
      const formatted = formatValue(
        fuelType,
        entity.fields[fuelTypeField],
        tEntity,
        { compact: true }
      );
      specs.push({
        label: tEntity(fuelTypeField),
        value: typeof formatted === 'string' ? formatted : String(fuelType),
      });
    }

    const transmission = vehicleData[transmissionField];
    if (transmission && entity.fields[transmissionField]) {
      const formatted = formatValue(
        transmission,
        entity.fields[transmissionField],
        tEntity,
        { compact: true }
      );
      specs.push({
        label: tEntity(transmissionField),
        value: typeof formatted === 'string' ? formatted : String(transmission),
      });
    }

    return specs;
  }, [
    vehicleData,
    yearField,
    mileageField,
    fuelTypeField,
    transmissionField,
    entity.fields,
    tEntity,
    formatMileage,
  ]);

  // Related vehicles
  const { items: relatedVehicles } = useRelatedItems(
    entity,
    vehicleData,
    allVehiclesData?.items || [],
    relatedFields,
    { limit: 3, tolerance: 0.3 }
  );

  // Context details for inquiry form placeholder
  const inquiryContextDetails = useMemo(() => {
    if (!vehicleData) return vehicleName;
    const parts: string[] = [];
    if (vehicleData[makeField]) parts.push(String(vehicleData[makeField]));
    if (vehicleData[modelField]) parts.push(String(vehicleData[modelField]));
    if (vehicleData[yearField]) parts.push(String(vehicleData[yearField]));
    if (vehicleData[mileageField]) {
      parts.push(formatMileage(vehicleData[mileageField] as number));
    }
    if (vehicleData[priceField] && priceFieldConfig) {
      const priceValue = vehicleData[priceField];
      const priceDisplay = formatValue(priceValue, priceFieldConfig, tEntity, {
        asString: true,
      });
      parts.push(
        typeof priceDisplay === 'string'
          ? priceDisplay
          : String(vehicleData[priceField])
      );
    }
    return parts.length > 0 ? parts.join(' • ') : vehicleName;
  }, [
    vehicleData,
    makeField,
    modelField,
    yearField,
    mileageField,
    priceField,
    priceFieldConfig,
    formatMileage,
    tEntity,
    vehicleName,
  ]);

  // Fetch vehicle data
  useEffect(() => {
    if (!id) {
      setStatus('error');
      return;
    }
    setStatus('pending');
    get(id)
      .then((data) => {
        if (data) {
          setVehicleData(data as Record<string, unknown>);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        setStatus('error');
      });
  }, [id, get]);

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Share handler — only used when navigator.share is available
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.share({ title: vehicleName, url });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (process.env.NODE_ENV === 'development') {
        console.warn('[CarDetail] Share failed:', err);
      }
    }
  };

  // Get description
  const description =
    effectiveDescriptionField && vehicleData
      ? (vehicleData[effectiveDescriptionField] as string | null | undefined)
      : null;

  // RENDER - conditional content, not early returns
  if (status === 'pending') {
    return (
      <PageContainer>
        <Spinner overlay />
      </PageContainer>
    );
  }

  if (status === 'error' || !vehicleData) {
    return (
      <PageContainer>
        <Stack
          direction="column"
          gap="large"
          style={{ padding: 'var(--gap-xl) 0', textAlign: 'center' }}
        >
          <Text level="h2">{tPage('notFound', 'Vehicle not found')}</Text>
          <Link path="/">
            <Button variant="primary">
              {tPage('backToHome', 'Back to home')}
            </Button>
          </Link>
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section>
        <Grid cols={[1, 1, 2, 2]} gap="large">
          {/* Left: Image Gallery */}
          <div>
            {normalizedImages.length > 0 ? (
              <ImageGallery images={normalizedImages} altPrefix={vehicleName} />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Text variant="muted">{tPage('noImages', 'No images')}</Text>
              </div>
            )}
          </div>

          {/* Right: Key Info */}
          <Stack direction="column" gap="large">
            <Stack direction="column" gap="tight">
              <Stack direction="row" gap="tight" align="center">
                <Text level="h1" style={{ margin: 0 }}>
                  {vehicleName}
                </Text>
              </Stack>
              <div
                style={{
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}
              >
                {(() => {
                  const priceValue = vehicleData[priceField];
                  if (priceValue == null || !priceFieldConfig) return null;
                  const priceDisplay = formatValue(
                    priceValue,
                    priceFieldConfig,
                    tEntity,
                    {}
                  );
                  return typeof priceDisplay === 'string' ? (
                    <Text
                      variant="accent"
                      weight="bold"
                      style={{ fontSize: 'var(--font-size-3xl)' }}
                    >
                      {priceDisplay}
                    </Text>
                  ) : (
                    priceDisplay
                  );
                })()}
              </div>
            </Stack>

            {keySpecs.length > 0 && (
              <Card variant="glass">
                <Grid cols={2}>
                  {keySpecs.map(({ label, value }) => (
                    <Stack key={label} direction="column" gap="tight">
                      <Text
                        variant="muted"
                        style={{ fontSize: 'var(--font-size-sm)' }}
                      >
                        {label}
                      </Text>
                      <Text style={{ fontWeight: 500 }}>{value}</Text>
                    </Stack>
                  ))}
                </Grid>
              </Card>
            )}

            <Stack direction="row">
              {customerEntity && inquiryEntity ? (
                <Button
                  variant="primary"
                  display="full"
                  style={{ flex: 1 }}
                  onClick={() => {
                    const formSection = document.getElementById('inquiry-form');
                    if (formSection) {
                      formSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }}
                >
                  {tPage('contactUs', 'Contact us')}
                </Button>
              ) : (
                <Button variant="primary" display="full" style={{ flex: 1 }} disabled>
                  {tPage('contactUs', 'Contact us')}
                </Button>
              )}
              {canNativeShare ? (
                <Button
                  variant="outline"
                  icon={<Share2 />}
                  display="auto"
                  onClick={handleShare}
                >
                  {tPage('share', 'Share')}
                </Button>
              ) : (
                <CopyToClipboard
                  text={shareUrl}
                  variant="outline"
                  display="auto"
                  tooltipText={tPage('share', 'Share')}
                  copiedTooltipText={tPage('shareCopied', 'Link copied!')}
                >
                  {tPage('share', 'Share')}
                </CopyToClipboard>
              )}
              <Button
                variant={saved ? 'primary' : 'outline'}
                icon={<Heart size={18} />}
                display="auto"
                onClick={() => toggleFavorite(id)}
              >
                {saved ? tPage('saved', 'Saved') : tPage('save', 'Save')}
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Section>

      {/* Description */}
      {description && (
        <Section title={tPage('description', 'Description')}>
          <Card variant="glass">
            <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {description}
            </Text>
          </Card>
        </Section>
      )}

      {/* Inquiry Form */}
      {customerEntity && inquiryEntity && (
        <Section id="inquiry-form" title={tPage('interested', 'Interested?')}>
          <Card variant="glass" title={tPage('getInTouch', 'Get in touch')}>
            <InquiryFormTemplate
              customerEntity={customerEntity}
              inquiryEntity={inquiryEntity}
              contextId={id}
              contextName={vehicleName}
              contextDetails={inquiryContextDetails}
              messagePlaceholder={inquiryContextDetails}
              contextField={contextField}
            />
          </Card>
        </Section>
      )}

      {/* Related Vehicles */}
      {relatedVehicles.length > 0 && (
        <Section title={tPage('similarVehicles', 'Similar Vehicles')}>
          <Grid cols={[1, 2, 3, 3]}>
            {relatedVehicles.map((vehicle: Record<string, unknown>) => {
              const vehicleImages = vehicle[imagesField] as
                | ImageData[]
                | string
                | string[]
                | null
                | undefined;
              const imageUrl = vehicleImages
                ? typeof vehicleImages === 'string'
                  ? vehicleImages
                  : Array.isArray(vehicleImages)
                    ? (vehicleImages[0] as ImageData)?.thumbUrl ||
                      (vehicleImages[0] as ImageData)?.fullUrl ||
                      vehicleImages[0]
                    : null
                : null;

              const vMake = (vehicle[makeField] as string) || '';
              const vModel = (vehicle[modelField] as string) || '';

              return (
                <Card key={vehicle.id as string} asChild clickable elevated>
                  <Link path={`/${entity.collection}/${vehicle.id}`}>
                    <Stack direction="column">
                      {imageUrl && (
                        <div
                          style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--muted)',
                          }}
                        >
                          <img
                            src={imageUrl as string}
                            alt={`${vMake} ${vModel}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                      )}
                      <Stack direction="column" gap="tight">
                        <Text level="h4" style={{ margin: 0 }}>
                          {vMake} {vModel}
                        </Text>
                        <Text variant="muted">
                          {vehicle[yearField] as string}
                        </Text>
                        {(() => {
                          const priceValue = vehicle[priceField];
                          const config = entity.fields[priceField];
                          if (priceValue == null || !config) return null;
                          const priceDisplay = formatValue(
                            priceValue,
                            config,
                            tEntity,
                            { compact: true }
                          );
                          return typeof priceDisplay === 'string' ? (
                            <Text
                              style={{
                                fontWeight: 700,
                                color: 'var(--accent)',
                              }}
                            >
                              {priceDisplay}
                            </Text>
                          ) : (
                            <div
                              style={{
                                fontWeight: 700,
                                color: 'var(--accent)',
                              }}
                            >
                              {priceDisplay}
                            </div>
                          );
                        })()}
                      </Stack>
                    </Stack>
                  </Link>
                </Card>
              );
            })}
          </Grid>
        </Section>
      )}
    </PageContainer>
  );
}
