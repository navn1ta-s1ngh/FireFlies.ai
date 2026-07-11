import Link from "next/link";

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 shadow-sm">
      <p className="text-sm font-medium text-primary-purple">Placeholder route</p>
      <h1 className="mt-3 text-3xl font-semibold capitalize text-text-primary">{slug.replace(/-/g, " ")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
        This is a placeholder page for the new design-system navigation. The content is intentionally minimal so you can review the layout and token usage.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary-purple px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-secondary-purple"
      >
        Back to home
      </Link>
    </div>
  );
}
