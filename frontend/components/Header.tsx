"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

type NavItem = {
  label: string;
  href?: string;
  children?: Array<{ label: string; href: string; description: string }>;
};

const navItems: NavItem[] = [
  {
    label: "Product",
    children: [
      { label: "Overview", href: "#", description: "Placeholder link" },
      { label: "Workflow", href: "#", description: "Placeholder link" },
      { label: "Integrations", href: "#", description: "Placeholder link" }
    ]
  },
  {
    label: "Solutions",
    children: [
      { label: "Sales", href: "#", description: "Placeholder link" },
      { label: "Support", href: "#", description: "Placeholder link" },
      { label: "Operations", href: "#", description: "Placeholder link" }
    ]
  },
  {
    label: "Integrations",
    children: [
      { label: "Slack", href: "#", description: "Placeholder link" },
      { label: "Notion", href: "#", description: "Placeholder link" },
      { label: "Drive", href: "#", description: "Placeholder link" }
    ]
  },
  {
    label: "Resources",
    children: [
      { label: "Guides", href: "#", description: "Placeholder link" },
      { label: "Blog", href: "#", description: "Placeholder link" },
      { label: "Help", href: "#", description: "Placeholder link" }
    ]
  },
  { label: "Enterprise", href: "/placeholder" },
  { label: "Pricing", href: "/placeholder" }
];

function NavLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-[0.95rem] font-medium text-text-secondary transition-colors hover:text-text-primary",
        className
      )}
    >
      {label}
    </Link>
  );
}

function NavDropdown({ label, items }: { label: string; items: Array<{ label: string; href: string; description: string }> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-[0.95rem] font-medium text-text-secondary transition-colors hover:text-text-primary"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{label}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full mt-3 w-56 rounded-lg border border-border bg-navbar p-2 shadow-xl">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-background/60 hover:text-text-primary"
            >
              <span className="block font-medium">{item.label}</span>
              <span className="mt-1 block text-xs text-text-secondary/80">{item.description}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-navbar/95 backdrop-blur">
      <div className="mx-auto flex h-20 items-center justify-between px-6 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-3 text-base font-semibold text-text-primary">
          <Logo className="h-9 w-9" />
          <span>Fireflies.ai</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            if (item.children) {
              return <NavDropdown key={item.label} label={item.label} items={item.children} />;
            }

            return <NavLink key={item.label} href={item.href ?? "/placeholder"} label={item.label} />;
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#7B61FF] transition-colors hover:text-[#7B61FF]"
          >
            Login
          </Link>
          <a
            href="#"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors"
          >
            Request Demo
          </a>
          <Link
            href="/login"
            className="rounded-lg bg-[#7B61FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7B61FF]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-primary md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-border bg-navbar px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3">
                    <p className="text-sm font-semibold text-text-primary">{item.label}</p>
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }

              return (
                <NavLink key={item.label} href={item.href ?? "/placeholder"} label={item.label} className="text-base" />
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-4">
            <Link
              href="/login"
              className="text-left text-sm font-semibold text-[#7B61FF] transition-colors hover:text-[#7B61FF]"
            >
              Login
            </Link>
            <a
              href="#"
              className="rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-black transition-colors"
            >
              Request Demo
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-[#7B61FF] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#7B61FF]"
            >
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
