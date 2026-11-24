import Link from "next/link";
import { PINTEREST_URL, SITE_NAME } from "@/lib/site";

/** Site footer: brand line + main links. Shown on every page. */
export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-stone-800">{SITE_NAME}</span> —
          easy DIY crafts and home decor ideas you can make at home.
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/" className="hover:text-amber-800">
            Home
          </Link>
          <Link href="/posts" className="hover:text-amber-800">
            All Ideas
          </Link>
          <a
            href={PINTEREST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-800"
          >
            Pinterest
          </a>
        </nav>
      </div>
    </footer>
  );
}
