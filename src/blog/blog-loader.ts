// packages/templates/src/blog/blog-loader.ts

/**
 * @fileoverview Blog data loader utilities
 * @description Processes import.meta.glob results into typed blog post data with i18n,
 * reading time estimation, and tag filtering.
 * RSS and sitemap are auto-generated at build time by the SEO pipeline (SEOGenerator).
 *
 * ## Convention
 * Files are named `slug_lang.md` (e.g. `my-post_en.md`, `my-post_fr.md`).
 * The slug is everything before the last `_lang` suffix.
 * Frontmatter is parsed from `---` delimited YAML-like block.
 *
 * ## Supported frontmatter fields
 * ```yaml
 * ---
 * title: My Post Title
 * description: A short summary for listings and SEO
 * date: 2025-06-01
 * tags: typescript, react, tutorial
 * image: /assets/blog/my-post-hero.png
 * ---
 * ```
 *
 * ## i18n fallback
 * If no file exists for the requested language, falls back to `_en`.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

/**
 * Metadata parsed from markdown frontmatter.
 *
 * @example
 * ```yaml
 * ---
 * title: Getting Started
 * description: Learn DoNotDev in 5 minutes
 * date: 2025-06-01
 * tags: tutorial, getting-started
 * image: /assets/blog/hero.png
 * ---
 * ```
 */
export interface BlogMeta {
  /** Post title */
  title: string;
  /** Short description for listings and SEO meta tags */
  description: string;
  /** Publication date in YYYY-MM-DD format */
  date: string;
  /** Comma-separated tags (parsed into string[] on BlogPost) */
  tags?: string;
  /** Optional hero/og image path (relative to public/) */
  image?: string;
  /** Additional custom frontmatter fields */
  [key: string]: string | undefined;
}

/**
 * A resolved blog post with computed fields.
 *
 * @example
 * ```ts
 * const post = blog.getPostBySlug('my-post');
 * console.log(post.readingTime); // 4
 * console.log(post.tags);        // ['typescript', 'react']
 * ```
 */
export interface BlogPost {
  /** URL-safe slug derived from filename (e.g. "my-post") */
  slug: string;
  /** Parsed frontmatter metadata */
  meta: BlogMeta;
  /** Markdown content (without frontmatter) */
  content: string;
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Parsed tags array (from comma-separated frontmatter) */
  tags: string[];
}

/**
 * Result of {@link createBlogLoader}.
 * Provides methods to query blog posts.
 */
export interface BlogLoader {
  /** Get all posts sorted by date (newest first) */
  getAllPosts: () => BlogPost[];
  /** Get a single post by slug, or null if not found */
  getPostBySlug: (slug: string) => BlogPost | null;
  /** Get all unique tags across all posts */
  getAllTags: () => string[];
  /** Get posts filtered by tag */
  getPostsByTag: (tag: string) => BlogPost[];
}

/** Average reading speed in words per minute */
const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time from markdown content.
 * @param content - Raw markdown content (frontmatter already stripped)
 * @returns Reading time in minutes (minimum 1)
 */
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/**
 * Parse comma-separated tags string into trimmed, lowercased array.
 * @param tagsStr - Raw tags string from frontmatter (e.g. "TypeScript, React, tutorial")
 * @returns Normalized tags array (e.g. ["typescript", "react", "tutorial"])
 */
function parseTags(tagsStr?: string): string[] {
  if (!tagsStr) return [];
  return tagsStr
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Parse frontmatter from raw markdown string.
 * Expects `---\nkey: value\n---\ncontent` format.
 *
 * @param raw - Raw markdown file content including frontmatter
 * @returns Parsed metadata and content body
 *
 * @example
 * ```ts
 * const { meta, content } = parseFrontmatter(rawMarkdown);
 * console.log(meta.title); // "My Post"
 * ```
 */
export function parseFrontmatter(raw: string): {
  meta: BlogMeta;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      meta: { title: '', description: '', date: '' },
      content: raw,
    };
  }

  const meta: BlogMeta = { title: '', description: '', date: '' };
  const frontmatter = match[1] ?? '';
  for (const line of frontmatter.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    if (key) meta[key] = value;
  }

  return { meta, content: match[2] ?? '' };
}

/**
 * Extract slug and language from a glob path.
 * Path format: `./slug_lang.md` or `../../content/blog/slug_lang.md`
 *
 * @param path - Glob result key (e.g. "../../content/blog/my-post_en.md")
 * @returns Parsed slug and language code, or null if invalid
 */
function parseFilePath(path: string): { slug: string; lang: string } | null {
  const filename = path.split('/').pop()?.replace(/\.md$/, '');
  if (!filename) return null;

  const lastUnderscore = filename.lastIndexOf('_');
  if (lastUnderscore === -1) {
    return { slug: filename, lang: 'en' };
  }

  const lang = filename.slice(lastUnderscore + 1);
  const slug = filename.slice(0, lastUnderscore);

  // Only treat as language code if 2-5 chars AND matches locale pattern (e.g., "en", "fr", "pt", "zhCN")
  if (lang.length < 2 || lang.length > 5 || !/^[a-zA-Z]{2,5}$/.test(lang)) {
    return { slug: filename, lang: 'en' };
  }

  return { slug, lang };
}

/**
 * Create a blog loader from import.meta.glob results.
 *
 * The glob call **must** live in app code (Vite resolves paths relative to the calling file).
 * Pass the result to this function for processing.
 *
 * @param globResult - Result of `import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })`
 * @param currentLang - Current language code (e.g. 'en', 'fr'). Falls back to 'en' if missing.
 * @returns Blog loader with getAllPosts(), getPostBySlug(), getAllTags(), getPostsByTag()
 *
 * @example
 * ```ts
 * // In your app's data/blog/index.ts:
 * const files = import.meta.glob('../../content/blog/*.md', {
 *   query: '?raw', import: 'default', eager: true,
 * });
 * const blog = createBlogLoader(files as Record<string, string>, 'en');
 *
 * const posts = blog.getAllPosts();           // All posts, newest first
 * const post = blog.getPostBySlug('my-post'); // Single post
 * const tags = blog.getAllTags();              // ['react', 'typescript', ...]
 * const filtered = blog.getPostsByTag('react'); // Posts tagged 'react'
 * ```
 */
export function createBlogLoader(
  globResult: Record<string, string>,
  currentLang: string
): BlogLoader {
  // Group files by slug → { lang: rawContent }
  const bySlug = new Map<string, Map<string, string>>();

  for (const [path, raw] of Object.entries(globResult)) {
    const parsed = parseFilePath(path);
    if (!parsed) continue;

    if (!bySlug.has(parsed.slug)) {
      bySlug.set(parsed.slug, new Map());
    }
    bySlug.get(parsed.slug)!.set(parsed.lang, raw);
  }

  // Resolve posts for current language with en fallback
  const resolvedPosts: BlogPost[] = [];

  for (const [slug, langMap] of bySlug) {
    const raw = langMap.get(currentLang) || langMap.get('en');
    if (!raw) continue;

    const { meta, content } = parseFrontmatter(raw);
    resolvedPosts.push({
      slug,
      meta,
      content,
      readingTime: estimateReadingTime(content),
      tags: parseTags(meta.tags),
    });
  }

  // Sort by date descending
  resolvedPosts.sort((a, b) => {
    if (!a.meta.date && !b.meta.date) return 0;
    if (!a.meta.date) return 1;
    if (!b.meta.date) return -1;
    return b.meta.date.localeCompare(a.meta.date);
  });

  // Collect unique tags
  const tagSet = new Set<string>();
  for (const post of resolvedPosts) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  const allTags = [...tagSet].sort();

  return {
    getAllPosts: () => resolvedPosts,
    getPostBySlug: (slug: string) =>
      resolvedPosts.find((p) => p.slug === slug) || null,
    getAllTags: () => allTags,
    getPostsByTag: (tag: string) =>
      resolvedPosts.filter((p) => p.tags.includes(tag.toLowerCase())),
  };
}
