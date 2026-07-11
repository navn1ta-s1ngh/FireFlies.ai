import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 shadow-sm">
      <p className="text-sm font-medium text-primary-purple">Placeholder page</p>
      <h1 className="mt-3 text-3xl font-semibold text-text-primary">This page is still being prepared.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
        The new shell is in place, and these placeholder routes now render with the same design tokens.
      </p>
      <Link href="/" className="mt-6 inline-flex items-center rounded-md bg-primary-purple px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary-purple">
        Back to home
      </Link>
    </div>
  );
}
