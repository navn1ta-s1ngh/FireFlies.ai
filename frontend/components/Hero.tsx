import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 md:px-8 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-size-[16px_16px]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-text-primary md:text-5xl lg:text-6xl">
          Your AI Assistant built to turn every conversation into clear next steps
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary md:text-lg">
          Transcribe, summarize, search, and organize every meeting so your team can move faster.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-primary-purple px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-purple"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border bg-transparent px-6 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary-purple"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
