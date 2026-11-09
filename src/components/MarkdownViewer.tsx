'use client';
// packages/templates/src/components/MarkdownViewer.tsx

/**
 * @fileoverview MarkdownViewer component
 * @description SSR-safe markdown rendering with framework components
 *
 * Uses marked + marked-footnote (GFM footnotes), html-react-parser for SSR-compatible HTML→React.
 * Intercepts:
 * - Code blocks → framework Code component (Shiki syntax highlighting)
 * - Links → framework Link (internal / external) or native `<a>` (hash-only, e.g. footnotes)
 * - Images → native `<img>` with lazy loading and async decoding
 *
 * **Security:** the rendered HTML goes through `sanitizeHtml` (DOMPurify in the browser,
 * DOMPurify + jsdom during SSR) with DOMPurify's safe defaults. Raw HTML in markdown keeps
 * safe markup and inline styles (e.g. `<span style="color:red">`); scripts, event handlers
 * and dangerous URIs are removed.
 *
 * @version 0.1.0
 * @since 0.0.1
 * @author AMBROISE PARK Consulting
 */

import parse, {
  attributesToProps,
  domToReact,
  Element,
} from 'html-react-parser';
import type { DOMNode } from 'html-react-parser';
import { marked } from 'marked';
import markedFootnote from 'marked-footnote';
import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';

import { Code, cn, sanitizeHtml } from '@donotdev/components';
import { Link } from '@donotdev/ui';

marked.use(markedFootnote());

/** Props for the MarkdownViewer component. */
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
 * - Links → framework Link (internal / external) or native `<a>` (hash-only)
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

        // Links → framework Link (routes / external). Hash-only = native <a> (footnote refs; Link uses navigate()).
        if (name === 'a') {
          const href = attribs?.href || '';
          if (href.startsWith('#')) {
            return (
              <a {...attributesToProps(attribs)}>
                {domToReact(children as DOMNode[])}
              </a>
            );
          }
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
