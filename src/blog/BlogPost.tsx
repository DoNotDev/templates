'use client';
// packages/templates/src/blog/BlogPost.tsx

/**
 * @fileoverview Blog Post Component
 * @description Renders a single blog post with title, date, reading time, tags, and markdown content.
 * Uses `useTranslation('blog')` for labels — override via `blog_*.json` in consumer app.
 *
 * **Security:** Renders markdown via MarkdownViewer which preserves raw HTML for author styling.
 * Only use with trusted/author-controlled content. Do NOT pass user-submitted markdown.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import { HeroSection, Section, Text } from '@donotdev/components';
import { useTranslation } from '@donotdev/core';

import { MarkdownViewer } from '../components/MarkdownViewer';

import type { BlogPost as BlogPostType } from './blog-loader';

/**
 * Props for the BlogPostView component.
 *
 * @example
 * ```tsx
 * <BlogPostView post={blog.getPostBySlug('my-post')} />
 * ```
 */
export interface BlogPostProps {
  /** The blog post to render (null = not found state) */
  post: BlogPostType | null;
}

/**
 * Blog Post View Component
 *
 * Renders a full blog post with:
 * - Hero title
 * - Date + reading time
 * - Tags
 * - Full markdown content via MarkdownViewer
 *
 * Shows a not-found state if post is null.
 *
 * @version 0.1.0
 */
export function BlogPostView({ post }: BlogPostProps) {
  const { t } = useTranslation('blog');

  if (!post) {
    return (
      <Section>
        <Text as="p" variant="muted" textAlign="center">
          {t('notFound')}
        </Text>
      </Section>
    );
  }

  const dateLine = [
    post.meta.date ? `${t('publishedOn')} ${post.meta.date}` : null,
    `${post.readingTime} ${t('minuteRead')}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <HeroSection title={post.meta.title} />
      <Section>
        <Text as="p" level="small" variant="muted">
          {dateLine}
        </Text>
        {post.tags.length > 0 && (
          <Text as="p" level="caption" variant="muted">
            {post.tags.join(' · ')}
          </Text>
        )}
        {post.meta.image && (
          <img
            src={post.meta.image}
            alt={post.meta.title}
            loading="eager"
            decoding="async"
            style={{
              width: '100%',
              maxHeight: '480px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
              marginTop: 'var(--gap-md)',
              marginBottom: 'var(--gap-md)',
            }}
          />
        )}
        <MarkdownViewer content={post.content} />
      </Section>
    </>
  );
}
