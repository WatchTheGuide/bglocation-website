import Link from "next/link";
import { MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              <span>capacitor-bglocation</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Production-ready background location tracking for Capacitor 8 apps.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.npmjs.com/package/capacitor-bglocation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  npm
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs#api" className="hover:text-foreground">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs#guides" className="hover:text-foreground">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/license" className="hover:text-foreground">
                  License (ELv2)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GuideTrackee. All rights reserved.
          Licensed under{" "}
          <Link href="/license" className="underline hover:text-foreground">
            Elastic License v2
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
