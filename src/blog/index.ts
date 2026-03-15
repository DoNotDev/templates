// packages/templates/src/blog/index.ts

/**
 * @fileoverview Blog utilities and components
 * @description Convention-based blog system using markdown files with frontmatter.
 *
 * ## Features
 * - i18n with `slug_lang.md` convention and `_en` fallback
 * - Reading time estimation
 * - Tag-based filtering
 * - Lazy image loading via MarkdownViewer
 * - RSS 2.0 + sitemap auto-generated at build time by SEOGenerator
 *
 * ## File Convention
 * `src/content/blog/slug_lang.md` (e.g. `my-post_en.md`, `my-post_fr.md`)
 *
 * ## Exports
 * - `createBlogLoader` — Core loader function
 * - `parseFrontmatter` — Frontmatter parser
 * - `BlogList` — Post listing component
 * - `BlogPostView` — Single post component
 * - Types: `BlogPost`, `BlogMeta`, `BlogLoader`
 *
 * @see {@link https://donotdev.com/blog | DoNotDev Blog} for a live example
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

export * from './blog-loader';
export * from './BlogList';
export * from './BlogPost';
