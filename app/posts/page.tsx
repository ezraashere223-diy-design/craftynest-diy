import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All DIY Crafts & Home Decor Ideas",
  description:
    "Browse every DIY crafts and home decor idea list on CraftyNest, newest first.",
};

/** Index of every published article, newest first. */
export default function AllPosts() {
  const posts = getAllPosts();
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        All Ideas
      </h1>
      <p className="mt-3 text-lg text-stone-600">
        Every DIY crafts and home decor idea list on CraftyNest, newest first.
      </p>
      {posts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-stone-600">
          No articles published yet.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
