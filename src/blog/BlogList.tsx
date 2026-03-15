'use client';
// packages/templates/src/blog/BlogList.tsx

/**
 * @fileoverview Blog List Component
 * @description Renders blog posts with tag filtering, featured hero card, and responsive grid.
 *
 * Layout: tag filter chips → featured/latest post (full-width) → rest in [1,1,2,3] grid.
 * Uses `useTranslation('blog')` for labels — override via `blog_*.json` in consumer app.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { useState } from 'react';

import { Card, Grid, Stack, Tag, Text } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';
import { Link } from '@donotdev/ui';

import type { BlogPost } from './blog-loader';
import type { ReactNode } from 'react';

/**
 * Props for the BlogList component.
 *
 * @example
 * ```tsx
 * <BlogList posts={blog.getAllPosts()} />
 * ```
 */
export interface BlogListProps {
  /** Array of blog posts to display (newest first) */
  posts: BlogPost[];
  /** Empty state content when no posts exist */
  emptyState?: ReactNode;
}

/** Shared card footer: tags + read more */
function PostFooter({
  post,
  readMoreLabel,
}: {
  post: BlogPost;
  readMoreLabel?: string;
}) {
  return (
    <Stack
      direction="row"
      justify="between"
      align="center"
      style={{ width: '100%' }}
    >
      {post.tags.length > 0 && (
        <Text as="span" level="caption" variant="muted">
          {post.tags.join(' · ')}
        </Text>
      )}
      <Text as="span" level="small" variant="accent">
        {readMoreLabel} &rarr;
      </Text>
    </Stack>
  );
}

/**
 * Blog List Component
 *
 * Renders blog posts with:
 * - Tag filter chips at the top
 * - Featured/latest post displayed larger with optional hero image
 * - Remaining posts in a responsive [1,1,2,3] grid
 *
 * @version 0.1.0
 */
export function BlogList({ posts, emptyState }: BlogListProps) {
  const { t } = useTranslation('blog');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      emptyState || (
        <Text as="p" variant="muted" textAlign="center">
          {t('empty')}
        </Text>
      )
    );
  }

  // Collect unique tags from all posts (not just filtered)
  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  // Filter by active tag
  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  const [featured, ...rest] = filtered;

  return (
    <Stack gap="large">
      {/* Tag filter chips */}
      {allTags.length > 0 && (
        <Stack direction="row" gap="tight" wrap="wrap" justify="center">
          <Tag
            interactive
            variant={activeTag === null ? 'accent' : 'outline'}
            onClick={() => setActiveTag(null)}
            size="sm"
          >
            {t('all')}
          </Tag>
          {allTags.map((tag) => (
            <Tag
              key={tag}
              interactive
              variant={activeTag === tag ? 'accent' : 'outline'}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              size="sm"
            >
              {tag}
            </Tag>
          ))}
        </Stack>
      )}

      {/* Featured / latest post (full-width, with optional hero image) */}
      {featured && (
        <Link path={`/blog/${featured.slug}`}>
          <Card
            clickable
            title={featured.meta.title}
            subtitle={[
              featured.meta.date,
              `${featured.readingTime} ${t('minuteRead')}`,
            ]
              .filter(Boolean)
              .join(' · ')}
            content={
              <>
                {featured.meta.image && (
                  <img
                    src={featured.meta.image}
                    alt={featured.meta.title}
                    loading="eager"
                    decoding="async"
                    style={{
                      width: '100%',
                      maxHeight: '360px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--gap-md)',
                    }}
                  />
                )}
                <Text as="p">{featured.meta.description}</Text>
              </>
            }
            footer={
              <PostFooter post={featured} readMoreLabel={t('readMore')} />
            }
          />
        </Link>
      )}

      {/* Rest of posts in responsive grid */}
      {rest.length > 0 && (
        <Grid cols={[1, 1, 2, 3]}>
          {rest.map((post) => (
            <Link key={post.slug} path={`/blog/${post.slug}`}>
              <Card
                clickable
                title={post.meta.title}
                subtitle={[
                  post.meta.date,
                  `${post.readingTime} ${t('minuteRead')}`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
                content={
                  <>
                    {post.meta.image && (
                      <img
                        src={post.meta.image}
                        alt={post.meta.title}
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          maxHeight: '180px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--gap-sm)',
                        }}
                      />
                    )}
                    <Text as="p" level="small">
                      {post.meta.description}
                    </Text>
                  </>
                }
                footer={
                  <PostFooter post={post} readMoreLabel={t('readMore')} />
                }
              />
            </Link>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
