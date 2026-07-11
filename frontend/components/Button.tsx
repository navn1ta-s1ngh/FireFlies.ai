import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
};

const variants = {
  primary: "bg-primary-purple text-white hover:bg-secondary-purple",
  secondary: "border border-border bg-button-dark text-white hover:border-primary-purple"
};

export function Button({ children, className, href, variant = "primary", type = "button", ...props }: ButtonProps) {
  const baseClassName = cn(
    "inline-flex items-center justify-center rounded-md px-5 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={baseClassName} {...props}>
      {children}
    </button>
  );
}
