'use client';
// packages/templates/src/components/MarkdownViewer.tsx

/**
 * @fileoverview MarkdownViewer component
 * @description SSR-safe markdown rendering with framework components
 *
 * Uses marked for parsing, html-react-parser for SSR-compatible HTML→React.
 * Intercepts:
 * - Code blocks → framework Code component (Shiki syntax highlighting)
 * - Links → framework Link (internal) or `<a>` (external)
 * - Images → native `<img>` with lazy loading and async decoding
 *
 * **Security: Author-controlled content only.**
 * This component is designed for rendering trusted markdown (e.g. blog posts written by the app author).
 * Raw HTML in markdown is intentionally preserved to allow custom styling (e.g. `<span style="color:red">`).
 * A lightweight regex sanitizer strips known XSS vectors (script, iframe, event handlers, dangerous URIs)
 * but **does NOT provide full protection against adversarial input**.
 * Do NOT use this component to render user-submitted or untrusted markdown.
 * For user-generated content, use a library like react-markdown (AST-based, no HTML pass-through)
 * or add DOMPurify sanitization.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import parse, { domToReact, Element } from 'html-react-parser';
import { marked } from 'marked';
import { memo, useMemo } from 'react';

import { Code, cn } from '@donotdev/components';
import { Link } from '@donotdev/ui';

import type { DOMNode } from 'html-react-parser';
import type { ComponentType } from 'react';

// ── Lightweight HTML sanitizer (no DOMPurify dependency) ──
// Strips known XSS vectors from marked-generated HTML before parsing.
// Run iteratively to catch nested/reconstructed tags (e.g., <scr<script>ipt>).
const DANGEROUS_TAGS_RE =
  /<\/?(?:script|iframe|object|embed|form|base|meta|link|style|applet)[\s>\/][^]*?(?:<\/(?:script|iframe|object|embed|form|base|meta|link|style|applet)>|\/?>)/gi;
const DANGEROUS_SELF_CLOSING_RE =
  /<(?:script|iframe|object|embed|form|base|meta|link|applet)\s*\/?\s*>/gi;
const EVENT_HANDLER_RE = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_URI_RE =
  /\s+(?:href|src|xlink:href|action|formaction)\s*=\s*(?:"[^"]*"|'[^']*')/gi;

/** Check if a URI attribute value contains a dangerous scheme */
function hasDangerousScheme(attrMatch: string): boolean {
  const valueMatch = /=\s*["']([^"']*)["']/.exec(attrMatch);
  if (!valueMatch) return false;
  const value = (valueMatch[1] ?? '')
    .replace(/[\s\u0000-\u001f]/g, '') // strip whitespace and control chars
    .replace(/&#x?[0-9a-f]+;?/gi, '') // strip numeric HTML entities used to obfuscate
    .replace(
      /&(?:amp|lt|gt|quot|apos|tab|newline|lpar|rpar|sol|colon|semi);?/gi,
      ''
    ) // strip named entities
    .toLowerCase();
  return /^(?:javascript|data|vbscript):/.test(value);
}

function sanitizeHtml(html: string): string {
  // Loop until stable to catch tags reconstructed after stripping (max 5 iterations as safety limit)
  let result = html;
  for (let i = 0; i < 5; i++) {
    const before = result;
    result = result
      .replace(DANGEROUS_TAGS_RE, '')
      .replace(DANGEROUS_SELF_CLOSING_RE, '')
      .replace(EVENT_HANDLER_RE, '');
    // Strip href/src with dangerous schemes (javascript:, data:, vbscript:)
    result = result.replace(DANGEROUS_URI_RE, (match) =>
      hasDangerousScheme(match) ? '' : match
    );
    if (result === before) break; // stable — no more changes
  }
  return result;
}

export interface MarkdownViewerProps {
  /** Raw markdown content */
  content?: string;
  /** Additional CSS classes */
  className?: string;
}

/** Extract text from Element */
function getText(el: Element): string {
  let t = '';
  for (const c of el.children) {
    if (c.type === 'text') t += (c as unknown as { data: string }).data;
    else if (c instanceof Element) t += getText(c);
  }
  return t;
}

/**
 * MarkdownViewer - SSR-safe markdown rendering with framework components
 *
 * Intercepts:
 * - Code blocks → framework Code component (Shiki syntax highlighting)
 * - Links → framework Link (internal) or `<a>` (external)
 * - Images → `<img>` with `loading="lazy"` and `decoding="async"`
 *
 * All other elements render as default HTML with CSS prose styling.
 *
 * @version 0.1.0
 */
const MarkdownViewerBase: ComponentType<MarkdownViewerProps> = ({
  content,
  className,
}) => {
  const rendered = useMemo(() => {
    if (!content) return null;

    const rawHtml = marked.parse(content, {
      async: false,
      gfm: true,
      breaks: true,
    }) as string;

    const html = sanitizeHtml(rawHtml);

    return parse(html, {
      // eslint-disable-next-line react/no-unstable-nested-components -- replace() is a transformer callback for html-react-parser, not a React component
      replace(node) {
        if (!(node instanceof Element)) return;
        const { name, attribs, children } = node;

        // Code blocks: <pre><code> → Code component
        if (name === 'pre') {
          const codeEl = children.find(
            (c): c is Element => c instanceof Element && c.name === 'code'
          );
          if (codeEl) {
            const lang =
              /language-(\w+)/.exec(codeEl.attribs?.class || '')?.[1] || 'text';
            return (
              <Code language={lang}>{getText(codeEl).replace(/\n$/, '')}</Code>
            );
          }
        }

        // Links → framework Link (handles both internal and external)
        if (name === 'a') {
          const href = attribs?.href || '';
          return <Link path={href}>{domToReact(children as DOMNode[])}</Link>;
        }

        // Images → lazy loading + async decoding for performance
        if (name === 'img') {
          const src = attribs?.src || '';
          const alt = attribs?.alt || '';
          return (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          );
        }

        // Let everything else render as default HTML
      },
    });
  }, [content]);

  if (!rendered) return null;

  return <div className={cn('prose', className)}>{rendered}</div>;
};

export const MarkdownViewer = memo(MarkdownViewerBase);
