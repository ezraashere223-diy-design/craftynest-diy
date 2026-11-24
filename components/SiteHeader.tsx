import Link from "next/link";
import { PINTEREST_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

/** Site header: brand + main navigation. Shown on every page. */
export default function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-2xl font-extrabold tracking-tight text-amber-800">
            {SITE_NAME}
          </span>
          <span className="text-xs font-medium tracking-wide text-stone-500 uppercase">
            {SITE_TAGLINE}
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-stone-700">
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
    </header>
  );
}
