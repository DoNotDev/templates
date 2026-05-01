# @donotdev/templates

Page templates, blog system, and reusable components for common app patterns.

## What's Included

- **Page Templates** — Home, Dashboard, Login, Profile, Admin Landing, What's New
- **Blog System** — Convention-based markdown blog with i18n (`slug_lang.md`), reading time, tags, and auto-generated RSS/sitemap
- **CRUD Templates** — Entity list/detail page templates
- **Billing Templates** — Pricing, checkout, subscription management pages
- **Legal Templates** — Privacy policy, terms of service
- **MarkdownViewer** — SSR-safe markdown renderer with syntax highlighting, lazy images, and framework Link integration

## Installation

```bash
bun install @donotdev/templates
```

## Blog Quick Start

```typescript
import { createBlogLoader, BlogList, BlogPostView } from '@donotdev/templates';

// In your app's data loader:
const files = import.meta.glob('../../content/blog/*.md', {
  query: '?raw', import: 'default', eager: true,
});
const blog = createBlogLoader(files as Record<string, string>, 'en');

// Get posts
const posts = blog.getAllPosts();       // Sorted by date, newest first
const post = blog.getPostBySlug('my-post');
const tags = blog.getAllTags();
const filtered = blog.getPostsByTag('react');
```

File convention: `src/content/blog/my-post_en.md`, `my-post_fr.md` (falls back to `_en`).

## License

This package is part of the DoNotDev Framework.
