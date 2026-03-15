'use client';
// packages/templates/src/crud/InquiryAdminTemplate.tsx

/**
 * @fileoverview Showcase inquiry admin CRUD template.
 * @description Admin-facing template to review and respond to inquiries created via InquiryFormTemplate.
 *
 * **This is example/showcase code.** Consumer apps replace this template
 * entirely with their own implementation. Hardcoded English strings are
 * intentional — this is not production i18n code, it's a starting point
 * that demonstrates an admin CRUD workflow.
 *
 * Shows all inquiries in a card-based layout with:
 * - Message preview
 * - Customer info (name, email, phone) inline
 * - One-click actions: email, call, mark as responded
 * - Status badge
 *
 * @see {@link https://donotdev.com/docs/templates} for customization guide
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { Mail, Phone, User, CheckCircle2, Clock } from 'lucide-react';
import { useMemo, useCallback } from 'react';

import {
  Button,
  Card,
  Section,
  Stack,
  Text,
  Badge,
  Grid,
  Skeleton,
} from '@donotdev/components';
import { useTranslation, formatDate, useBreakpoint } from '@donotdev/core';
import type { Entity } from '@donotdev/core';
import {
  isCrudModuleAvailable,
  useCrud,
  useCrudList,
  translateLabel,
} from './crudImports';
import type { InferEntityData } from '@donotdev/crud';
import { Link } from '@donotdev/ui';

import type { ReactElement } from 'react';

export interface InquiryAdminTemplateProps {
  /** Customer entity definition (linked via customerId) */
  customerEntity: Entity;
  /** Inquiry entity definition */
  inquiryEntity: Entity;
  /** Optional base path for customer detail pages (defaults to `/customers`) */
  customerBasePath?: string;
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Default open state (when collapsible) */
  defaultOpen?: boolean;
  /** Controlled open state (when collapsible) */
  open?: boolean;
  /** Callback when open state changes (when collapsible) */
  onOpenChange?: (open: boolean) => void;
  /** Section title (defaults to inquiry entity name) */
  title?: string;
  /** Field name for context reference in inquiry (default: 'carId') */
  contextField?: string;
}

export function InquiryAdminTemplate({
  customerEntity,
  inquiryEntity,
  customerBasePath = '/customers',
  collapsible = false,
  defaultOpen = false,
  open,
  onOpenChange,
  title,
  contextField = 'carId',
}: InquiryAdminTemplateProps): ReactElement | null {
  // Safe guard: isCrudModuleAvailable is a module-level constant (immutable after load).
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!isCrudModuleAvailable) return null;

  const { t: tInquiry } = useTranslation(
    `entity-${inquiryEntity.name.toLowerCase()}`
  );
  const { t: tCrud } = useTranslation('crud');

  const sectionTitle = title || tInquiry('name');

  // Fetch all inquiries
  const { items: inquiries, loading } = useCrudList<
    InferEntityData<typeof inquiryEntity> & { id: string }
  >(inquiryEntity);

  // Fetch all customers in parallel (we'll map them by ID)
  const { items: customers } = useCrudList<
    InferEntityData<typeof customerEntity> & { id: string }
  >(customerEntity);

  // Create a map of customerId -> customer for quick lookup
  const customersMap = useMemo(() => {
    const map = new Map<
      string,
      InferEntityData<typeof customerEntity> & { id: string }
    >();
    customers?.forEach((customer) => {
      if (customer.id) {
        map.set(customer.id, customer);
      }
    });
    return map;
  }, [customers]);

  const { update: updateInquiry } = useCrud<
    InferEntityData<typeof inquiryEntity> & { id: string }
  >(inquiryEntity);

  const handleMarkResponded = useCallback(
    async (inquiryId: string) => {
      await updateInquiry(inquiryId, { status: 'responded' });
      // Cache is automatically updated by CrudService, no manual refresh needed
    },
    [updateInquiry]
  );

  // Filter to only show draft (new) inquiries, then sort by date (newest first)
  const sortedInquiries = useMemo(() => {
    if (!inquiries) return [];
    return [...inquiries]
      .filter((inquiry) => {
        const status =
          typeof inquiry.status === 'string' ? inquiry.status : 'draft';
        return status === 'draft';
      })
      .sort((a, b) => {
        const aDate =
          (typeof a.createdAt === 'string'
            ? a.createdAt
            : typeof a.date === 'string'
              ? a.date
              : '') || '';
        const bDate =
          (typeof b.createdAt === 'string'
            ? b.createdAt
            : typeof b.date === 'string'
              ? b.date
              : '') || '';
        return bDate.localeCompare(aDate);
      });
  }, [inquiries]);

  const inquiryCols: [number, number, number, number] = [1, 1, 2, 2];

  // Breakpoint-aware skeleton count: 3 rows at current breakpoint
  const bp = useBreakpoint('current');
  const bpIndex: Record<string, number> = {
    mobile: 0,
    tablet: 1,
    laptop: 2,
    desktop: 3,
  };
  const colIndex = bpIndex[bp] ?? 3;
  const skeletonCount = (inquiryCols[colIndex] ?? 2) * 3;

  const content = (
    <>
      {loading ? (
        <Grid cols={inquiryCols}>
          {Array.from({ length: skeletonCount }, (_, i) => (
            <Card
              key={i}
              title={<Skeleton width="50%" />}
              content={
                <Stack direction="column" gap="tight">
                  <Skeleton width="70%" />
                  <Skeleton width="90%" />
                  <Skeleton width="40%" />
                </Stack>
              }
            />
          ))}
        </Grid>
      ) : sortedInquiries.length === 0 ? (
        <Text variant="muted">
          {tCrud('noInquiries', { defaultValue: 'No inquiries found.' })}
        </Text>
      ) : (
        <Grid cols={[1, 1, 2, 2]}>
          {sortedInquiries.map((inquiry) => {
            const customerId =
              typeof inquiry.customerId === 'string'
                ? inquiry.customerId
                : undefined;
            const customer = customerId
              ? customersMap.get(customerId)
              : undefined;
            const inquiryStatus =
              typeof inquiry.status === 'string' ? inquiry.status : 'draft';
            const isAvailable = inquiryStatus === 'available';
            const customerEmail =
              typeof customer?.email === 'string' ? customer.email : undefined;
            const customerPhone =
              typeof customer?.phone === 'string' ? customer.phone : undefined;
            const fullName =
              customer && (customer.firstName || customer.lastName)
                ? [customer.firstName, customer.lastName]
                    .filter(Boolean)
                    .join(' ')
                : undefined;
            const messagePreview =
              typeof inquiry.message === 'string' && inquiry.message
                ? inquiry.message.length > 150
                  ? `${inquiry.message.substring(0, 150)}...`
                  : inquiry.message
                : '';
            const inquiryDate =
              typeof inquiry.date === 'string'
                ? inquiry.date
                : typeof inquiry.createdAt === 'string'
                  ? inquiry.createdAt
                  : undefined;

            const cardContent = (
              <Stack>
                {/* Header: Status + Date */}
                <Stack
                  direction="row"
                  gap="tight"
                  align="center"
                  justify="between"
                >
                  <Badge variant={isAvailable ? 'secondary' : 'outline'}>
                    <Stack direction="row" gap="tight" align="center">
                      {isAvailable ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {translateLabel(`status.${inquiryStatus}`, tInquiry)}
                    </Stack>
                  </Badge>
                  {inquiryDate && (
                    <Text variant="muted" level="small">
                      {formatDate(inquiryDate)}
                    </Text>
                  )}
                </Stack>

                {/* Customer Info */}
                {customer ? (
                  <Stack gap="tight">
                    <Stack direction="row" gap="tight" align="center">
                      <User size={14} />
                      <Text weight="medium" level="small">
                        {fullName ||
                          tCrud('customer', { defaultValue: 'Customer' })}
                      </Text>
                    </Stack>
                    {customerEmail && (
                      <Text level="small" variant="muted">
                        {customerEmail}
                      </Text>
                    )}
                    {customerPhone && (
                      <Text level="small" variant="muted">
                        {customerPhone}
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text variant="muted" level="small">
                    {tCrud('noCustomer', {
                      defaultValue: 'No customer linked',
                    })}
                  </Text>
                )}

                {/* Message Preview */}
                {messagePreview && <Text level="small">{messagePreview}</Text>}

                {/* Actions */}
                <Stack gap="tight">
                  {(customerEmail || customerPhone) && (
                    <Stack direction="row" gap="tight">
                      {customerEmail && (
                        <Button
                          variant="outline"
                          icon={Mail}
                          fullWidth
                          className="dndev-flex-1"
                          render={({ children, className, ...props }) => (
                            <Link
                              path={`mailto:${encodeURIComponent(customerEmail)}${typeof (inquiry as Record<string, unknown>)[contextField] === 'string' && (inquiry as Record<string, unknown>)[contextField] ? `?subject=${encodeURIComponent(tCrud('actions.replySubject', { defaultValue: 'Re: Your inquiry' }))}` : ''}`}
                              className={className}
                              onClick={(e) => e.stopPropagation()}
                              {...props}
                            >
                              {children}
                            </Link>
                          )}
                        >
                          {tCrud('actions.email', { defaultValue: 'Email' })}
                        </Button>
                      )}
                      {customerPhone && (
                        <Button
                          variant="outline"
                          icon={Phone}
                          fullWidth
                          className="dndev-flex-1"
                          render={({ children, className, ...props }) => (
                            <Link
                              path={`tel:${customerPhone}`}
                              className={className}
                              onClick={(e) => e.stopPropagation()}
                              {...props}
                            >
                              {children}
                            </Link>
                          )}
                        >
                          {tCrud('actions.call', { defaultValue: 'Call' })}
                        </Button>
                      )}
                    </Stack>
                  )}
                  {!isAvailable && (
                    <Button
                      variant="outline"
                      icon={CheckCircle2}
                      fullWidth
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMarkResponded(inquiry.id);
                      }}
                    >
                      {tCrud('actions.markResponded', {
                        defaultValue: 'Mark responded',
                      })}
                    </Button>
                  )}
                </Stack>
              </Stack>
            );

            return customer?.id ? (
              <Link
                key={inquiry.id}
                path={`${customerBasePath}/${customer.id}`}
                className="dndev-block dndev-h-full"
                onClick={(e) => {
                  // Don't navigate if clicking on action buttons
                  const target = e.target as HTMLElement;
                  if (
                    target.closest('button') ||
                    target.closest('a[href^="mailto:"]') ||
                    target.closest('a[href^="tel:"]')
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <Card clickable>{cardContent}</Card>
              </Link>
            ) : (
              <Card key={inquiry.id}>{cardContent}</Card>
            );
          })}
        </Grid>
      )}
    </>
  );

  if (collapsible) {
    return (
      <Section
        title={sectionTitle}
        collapsible
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        {content}
      </Section>
    );
  }

  return content;
}
