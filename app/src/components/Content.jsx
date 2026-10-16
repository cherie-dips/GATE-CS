import { useLayoutEffect, useMemo, useRef } from 'react';
import { markdownToHtml, typeset } from '../lib/render.js';

/** Renders stored HTML (with \( \) / \[ \] math) or Markdown (with $ / $$ math) and typesets math. */
export default function Content({ html, md, className = '', inline = false }) {
  const ref = useRef(null);
  const body = useMemo(() => (md != null ? markdownToHtml(md, inline) : html || ''), [html, md, inline]);
  useLayoutEffect(() => {
    typeset(ref.current);
  }, [body]);
  const Tag = inline ? 'span' : 'div';
  return <Tag ref={ref} className={`content ${className}`} dangerouslySetInnerHTML={{ __html: body }} />;
}
