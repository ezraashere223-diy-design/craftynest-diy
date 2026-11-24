import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { getAllPosts, getPostBySlug, type Post } from "@/lib/posts";
import { SITE_NAME, SITE_URL, truncate } from "@/lib/site";

// Slugs are generated at build time from the article files. Any other
// slug is a 404 (dynamicParams = false). This works because Cache
// Components is disabled in next.config.ts (see the comment there).
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE_URL}/posts/${slug}`;
  const image =
    post.images[0] && post.designs[0]?.image
      ? `${SITE_URL}/images/${slug}/${post.images[0].file}`
      : undefined;
  return {
    // Title and description come from the article file; real articles
    // keep them keyword-first, title < 60 chars, description < 155.
    title: truncate(post.title, 60),
    description: truncate(post.description, 155),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: truncate(post.title, 60),
      description: truncate(post.description, 155),
      publishedTime: post.date,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: truncate(post.title, 60),
      description: truncate(post.description, 155),
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** Related articles: same category first, then the newest others (max 3). */
function relatedPosts(post: Post): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, 3);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/posts/${slug}`;
  const related = relatedPosts(post);

  // Structured data is generated FROM the visible content, 1:1:
  // the FAQPage answers are exactly the answers shown on the page.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: url,
    ...(post.images[0]
      ? { image: `${SITE_URL}/images/${slug}/${post.images[0].file}` }
      : {}),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Ideas",
        item: `${SITE_URL}/posts`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <Link href="/" className="hover:text-amber-800">
          Home
        </Link>
        {" / "}
        <Link href="/posts" className="hover:text-amber-800">
          All Ideas
        </Link>
        {" / "}
        <span aria-current="page">{post.title}</span>
      </nav>

      <p className="mt-6 text-xs font-semibold tracking-wide text-amber-700 uppercase">
        {post.category}
      </p>
      <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-stone-500">
        <time dateTime={post.date}>{post.date}</time> · {post.designs.length}{" "}
        ideas
      </p>

      {/* Intro — main keyword appears in the first 100 words (author rule). */}
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-700">
        {post.intro.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
      </div>

      {/* Numbered design sections 1..N — one image per design, in order. */}
      {post.designs.map((design) => (
        <section key={design.number} className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900">
            {design.number}. {design.title}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-stone-700">
            {design.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
          {design.image && (
            <figure className="mt-5">
              <Image
                src={`/images/${slug}/${design.image.file}`}
                alt={design.image.alt}
                width={768}
                height={1152}
                sizes="(max-width: 768px) 100vw, 768px"
                className="h-auto w-full max-w-xl rounded-xl"
              />
            </figure>
          )}
        </section>
      ))}

      {/* Takeaway */}
      {post.takeaway.length > 0 && (
        <section className="mt-12 rounded-xl bg-amber-50 p-6">
          <h2 className="text-2xl font-bold text-stone-900">Takeaway</h2>
          <div className="mt-3 space-y-4 leading-relaxed text-stone-700">
            {post.takeaway.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
        </section>
      )}

      {/* FAQs — visible answers match the FAQPage schema above, 1:1. */}
      {post.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-6">
            {post.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-semibold text-stone-900">
                  {faq.question}
                </h3>
                <p className="mt-2 leading-relaxed text-stone-700">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900">
            More ideas you may like
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
