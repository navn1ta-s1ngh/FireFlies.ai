import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

import { Logo } from "@/components/Logo";

type FooterLink = {
  href: string;
  label: string;
};

type FooterGroup = {
  title?: string;
  links: FooterLink[];
};

type FooterColumnProps = {
  title: string;
  groups: FooterGroup[];
};

const footerColumns: FooterColumnProps[] = [
  {
    title: "Product",
    groups: [
      {
        links: [
          { href: "/placeholder", label: "Meeting capture" },
          { href: "/placeholder", label: "Transcript workflows" },
          { href: "/placeholder", label: "AI summaries" },
          { href: "/placeholder", label: "Action items" },
          { href: "/placeholder", label: "Insights dashboard" }
        ]
      }
    ]
  },
  {
    title: "Use Cases",
    groups: [
      {
        links: [
          { href: "/placeholder", label: "Sales calls" },
          { href: "/placeholder", label: "Product reviews" },
          { href: "/placeholder", label: "Leadership syncs" },
          { href: "/placeholder", label: "Customer interviews" },
          { href: "/placeholder", label: "Team planning" }
        ]
      }
    ]
  },
  {
    title: "Integrations",
    groups: [
      {
        links: [
          { href: "/placeholder", label: "Slack workspace" },
          { href: "/placeholder", label: "Notion pages" },
          { href: "/placeholder", label: "Google Calendar" },
          { href: "/placeholder", label: "HubSpot CRM" },
          { href: "/placeholder", label: "Zapier flows" }
        ]
      }
    ]
  },
  {
    title: "Company",
    groups: [
      {
        links: [
          { href: "/placeholder", label: "About the product" },
          { href: "/placeholder", label: "Mission and values" },
          { href: "/placeholder", label: "Careers at work" },
          { href: "/placeholder", label: "Press and media" }
        ]
      },
      {
        title: "Learn",
        links: [
          { href: "/placeholder", label: "Guides and tutorials" },
          { href: "/placeholder", label: "Release notes" },
          { href: "/placeholder", label: "Support articles" }
        ]
      }
    ]
  },
  {
    title: "Download",
    groups: [
      {
        links: [
          { href: "/placeholder", label: "Desktop app" },
          { href: "/placeholder", label: "Mobile app" },
          { href: "/placeholder", label: "Browser extension" },
          { href: "/placeholder", label: "Admin setup" }
        ]
      }
    ]
  }
];

function FooterColumn({ title, groups }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {title === "Download" ? (
        <div className="mt-4 rounded-2xl border border-border bg-card-white/70 p-3 shadow-sm">
          <a
            href="https://onelink.to/aqv98c"
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-xl border border-border"
          >
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://onelink.to/aqv98c"
              alt="QR code placeholder"
              className="aspect-square w-full object-cover"
            />
          </a>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col gap-6">
        {groups.map((group, index) => (
          <div key={`${title}-${index}`}>
            {group.title ? (
              <p className="mb-3 text-sm font-medium text-text-primary">{group.title}</p>
            ) : null}
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const languages = ["English", "Español", "Deutsch"];

  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-x-10 md:gap-y-12 lg:grid-cols-5 lg:gap-x-12">
          {footerColumns.map((column) => (
            <FooterColumn key={column.title} title={column.title} groups={column.groups} />
          ))}
        </div>

        <div className="mt-16 border-t border-border py-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <Logo className="h-8 w-8" />
              <span>© {year} Fireflies.ai. All rights reserved.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-text-secondary">
              {languages.map((language, index) => (
                <div key={language} className="flex items-center gap-2">
                  <span className={language === "English" ? "text-text-primary" : ""}>{language}</span>
                  {index < languages.length - 1 ? <span className="text-text-secondary/70">•</span> : null}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-text-secondary">
              <Link href="https://www.linkedin.com/company/fireflies-inc/" aria-label="LinkedIn" className="transition-colors hover:text-text-primary" target="_blank" rel="noreferrer">
                <Linkedin size={18} />
              </Link>
              <Link href="https://twitter.com/firefliesai" aria-label="Twitter" className="transition-colors hover:text-text-primary" target="_blank" rel="noreferrer">
                <Twitter size={18} />
              </Link>
              <Link href="https://www.youtube.com/channel/UCZHSvxWARx0TRK77t1AbY0A" aria-label="YouTube" className="transition-colors hover:text-text-primary" target="_blank" rel="noreferrer">
                <Youtube size={18} />
              </Link>
              <Link href="https://www.instagram.com/firefliesai/" aria-label="Instagram" className="transition-colors hover:text-text-primary" target="_blank" rel="noreferrer">
                <Instagram size={18} />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-text-secondary/80 md:text-left">
        
        </p>
      </div>
    </footer>
  );
}
