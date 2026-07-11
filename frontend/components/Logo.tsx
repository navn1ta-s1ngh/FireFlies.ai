import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D6249F" />
          <stop offset="100%" stopColor="#E96AC7" />
        </linearGradient>
      </defs>

      <polygon points="16,4 28,16 16,28 4,16" fill="#3A1633" />
      <polygon points="16,7.5 24.5,16 16,24.5 7.5,16" fill="url(#logo-gradient)" />
      <polygon points="16,10.5 21.5,16 16,21.5 10.5,16" fill="#120A2E" />
    </svg>
  );
}
