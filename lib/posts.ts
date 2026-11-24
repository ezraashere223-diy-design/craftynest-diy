// Article loading + parsing for CraftyNest.
//
// Articles are plain Markdown files in content/posts/<slug>.md with
// frontmatter (title, slug, description, keyword, category, date, images).
// There is NO admin dashboard, NO database and NO CMS: to publish an
// article you add one Markdown file + its images, commit and push, and
// Vercel deploys it. The site builds article pages from these files at
// build time (see app/posts/[slug]/page.tsx).
//
// HONEST-COUNT RULE (from the Pinterest Master Prompt, Section 5.6):
// title count == design count == image count == meta count. The parser
// derives the design count from the actual `## N. ...` sections in the
// file, and pairs image N from the frontmatter `images` list with
// design N, in order. If a file ever disagrees with itself, `validate()`
// reports the mismatch and the page is not built from it.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderInline } from "./markdown";

export const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export interface PostImage {
  file: string;
  alt: string;
}

export interface Faq {
  question: string;
  /** Plain-text answer, exactly as shown on the page (40–60 words). */
  answer: string;
}

export interface Design {
  /** 1-based design number, from the `## N. ...` heading. */
  number: number;
  title: string;
  /** Paragraphs of the design description (inline Markdown rendered). */
  paragraphs: string[];
  /** Image N from the frontmatter list — image N belongs to design N. */
  image?: PostImage;
}

export interface Post {
  title: string;
  slug: string;
  description: string;
  keyword: string;
  category: string;
  /** ISO date string, e.g. "2026-11-24". Never backdated. */
  date: string;
  images: PostImage[];
  /** Drafts (e.g. the sample structure file) are never listed or built. */
  draft: boolean;
  /** Intro paragraphs (before the first `##` heading). */
  intro: string[];
  designs: Design[];
  takeaway: string[];
  faqs: Faq[];
}

/** Split a Markdown body into sections keyed by their `##` heading. */
function splitSections(body: string): { heading: string; lines: string[] }[] {
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } = {
    heading: "",
    lines: [],
  };
  for (const line of body.split("\n")) {
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      sections.push(current);
      current = { heading: h2[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);
  return sections;
}

/** Group consecutive non-empty lines into paragraphs. */
function paragraphs(lines: string[]): string[] {
  const out: string[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length > 0) {
      out.push(renderInline(buf.join(" ").trim()));
      buf = [];
    }
  };
  for (const line of lines) {
    // Skip `###` FAQ question headings and image lines — handled elsewhere.
    if (line.startsWith("### ") || line.trim().startsWith("![")) continue;
    if (line.trim() === "") flush();
    else buf.push(line.trim());
  }
  flush();
  return out;
}

/** Parse one Markdown file into a Post. Throws on malformed frontmatter. */
export function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const images: PostImage[] = Array.isArray(data.images)
    ? data.images.map((img: { file: string; alt: string }) => ({
        file: String(img.file),
        alt: String(img.alt),
      }))
    : [];

  const post: Post = {
    title: String(data.title ?? ""),
    slug: String(data.slug ?? path.basename(filePath, ".md")),
    description: String(data.description ?? ""),
    keyword: String(data.keyword ?? ""),
    category: String(data.category ?? "DIY Crafts"),
    date: String(data.date ?? ""),
    images,
    draft: data.draft === true,
    intro: [],
    designs: [],
    takeaway: [],
    faqs: [],
  };

  for (const section of splitSections(content)) {
    const designMatch = section.heading.match(/^(\d+)\.\s+(.*)$/);
    if (designMatch) {
      const number = Number(designMatch[1]);
      post.designs.push({
        number,
        title: designMatch[2].trim(),
        paragraphs: paragraphs(section.lines),
        // Image N belongs to design N, in order (Section 5.3).
        image: images[number - 1],
      });
      continue;
    }
    if (/^takeaway$/i.test(section.heading)) {
      post.takeaway = paragraphs(section.lines);
      continue;
    }
    if (/frequently asked questions/i.test(section.heading)) {
      // FAQs are `### Question` headings, each followed by its answer.
      let current: Faq | null = null;
      const flushFaq = () => {
        if (current) post.faqs.push(current);
        current = null;
      };
      for (const line of section.lines) {
        const q = line.match(/^###\s+(.*)$/);
        if (q) {
          flushFaq();
          current = { question: q[1].trim(), answer: "" };
        } else if (current && line.trim() !== "") {
          current.answer = current.answer
            ? `${current.answer} ${line.trim()}`
            : line.trim();
        }
      }
      flushFaq();
      continue;
    }
    if (section.heading === "") {
      post.intro = paragraphs(section.lines);
    }
    // Any other `##` heading is ignored (unknown sections are not rendered).
  }

  // Designs must be numbered contiguously 1..N.
  post.designs.sort((a, b) => a.number - b.number);
  return post;
}

/**
 * Check a post against the honest-count rules. Returns a list of problems;
 * an empty list means the post is publishable. Called at build time —
 * a post with problems is excluded from the sitemap and listing so a
 * broken article can never go live silently.
 */
export function validate(post: Post): string[] {
  const problems: string[] = [];
  const titleCount = post.title.match(/^(\d+)\+?\s/)?.[1];
  if (titleCount && Number(titleCount) !== post.designs.length) {
    problems.push(
      `title count (${titleCount}) != design count (${post.designs.length})`,
    );
  }
  if (post.images.length !== post.designs.length) {
    problems.push(
      `image count (${post.images.length}) != design count (${post.designs.length})`,
    );
  }
  post.designs.forEach((d, i) => {
    if (d.number !== i + 1)
      problems.push(`design numbers are not contiguous at design ${d.number}`);
    if (!d.image)
      problems.push(`design ${d.number} ("${d.title}") has no image`);
    if (d.image && (!d.image.alt || d.image.alt.split(" ").length < 8))
      problems.push(`design ${d.number} alt text is too short`);
  });
  if (post.faqs.length < 7 || post.faqs.length > 8) {
    problems.push(`FAQ count is ${post.faqs.length}, expected 7–8`);
  }
  for (const faq of post.faqs) {
    const words = faq.answer.split(/\s+/).filter(Boolean).length;
    if (words < 40 || words > 60) {
      problems.push(
        `FAQ "${faq.question}" answer is ${words} words, expected 40–60`,
      );
    }
  }
  if (!post.description || post.description.length > 155) {
    problems.push("meta description missing or over 155 characters");
  }
  if (!post.title || post.title.length > 60) {
    problems.push("title missing or over 60 characters");
  }
  return problems;
}

function readPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(POSTS_DIR, f));
}

/** All publishable posts, newest first. Drafts and invalid posts excluded. */
export function getAllPosts(): Post[] {
  return readPostFiles()
    .map(parsePost)
    .filter((p) => !p.draft && validate(p).length === 0)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** One publishable post by slug, or null. */
export function getPostBySlug(slug: string): Post | null {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const post = parsePost(file);
  if (post.draft || validate(post).length > 0) return null;
  return post;
}
