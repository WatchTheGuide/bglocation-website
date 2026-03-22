"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
  { href: "/portal", label: "Portal" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <MapPin className="h-5 w-5 text-primary" />
          <span>bglocation</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Button render={<Link href="/pricing" />} nativeButton={false} size="sm">
            Get License
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t px-4 pb-4 pt-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button render={<Link href="/pricing" />} nativeButton={false} size="sm" className="mt-2 w-full">
            Get License
          </Button>
        </nav>
      )}
    </header>
  );
}
