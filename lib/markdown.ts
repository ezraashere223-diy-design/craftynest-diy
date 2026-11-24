// Tiny inline-markdown renderer for article paragraphs.
//
// Articles are written by us in plain Markdown files (see content/posts/).
// Paragraphs only need a small subset of Markdown: **bold**, *italic* and
// [links](https://...). This renderer escapes HTML first, then applies
// those three inline rules, so author-written files can never inject
// markup. Block-level structure (headings, images, FAQs) is parsed
// separately in lib/posts.ts — it never goes through this file.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Render one paragraph of inline Markdown to safe HTML. */
export function renderInline(text: string): string {
  let html = escapeHtml(text);
  // Links first, so ** inside a link label still renders.
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2">$1</a>',
  );
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return html;
}
