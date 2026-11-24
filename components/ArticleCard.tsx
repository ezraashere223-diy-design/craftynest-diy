import Link from "next/link";
import type { Post } from "@/lib/posts";

/** Card for one article in a list / related-articles grid. */
export default function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.slug}`} className="block p-5">
        <p className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
          {post.category}
        </p>
        <h3 className="mt-2 text-lg leading-snug font-bold text-stone-900">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
          {post.description}
        </p>
        <p className="mt-3 text-xs text-stone-500">
          {post.designs.length} ideas ·{" "}
          <time dateTime={post.date}>{post.date}</time>
        </p>
      </Link>
    </article>
  );
}
