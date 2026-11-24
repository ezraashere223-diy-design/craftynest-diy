import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";

/**
 * Homepage: one H1, a short intro, then the latest articles.
 * When no real article exists yet, the page says so honestly instead
 * of showing invented content.
 */
export default function Home() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div>
      <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-stone-900 sm:text-4xl">
        DIY Crafts &amp; Home Decor Ideas
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
        Easy DIY crafts and home decor ideas you can actually make at home.
        Every article is a numbered list of ideas with a photo for each one —
        browse, save your favourites, and try something new this week.
      </p>

      {categories.length > 0 && (
        <p className="mt-6 flex flex-wrap gap-2 text-sm">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-800"
            >
              {c}
            </span>
          ))}
        </p>
      )}

      <h2 className="mt-10 text-2xl font-bold text-stone-900">
        Latest ideas
      </h2>
      {posts.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-stone-600">
          No articles published yet — the first article is on its way. Follow
          us on Pinterest to see new ideas as soon as they are published.
        </p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <p className="mt-8">
          <Link
            href="/posts"
            className="font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-900"
          >
            Browse all ideas →
          </Link>
        </p>
      )}
    </div>
  );
}
