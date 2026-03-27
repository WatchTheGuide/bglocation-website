"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useFramework } from "@/components/framework/framework-provider";
import { Separator } from "@/components/ui/separator";

const GITLAB_URL = "https://gitlab.com/szymonwalczak/capacitor-background-location";

export function Footer() {
  const { frameworkHref } = useFramework();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href={frameworkHref("/")} className="flex items-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              <span>bglocation</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Production-ready background location SDK for Capacitor and React Native apps.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={frameworkHref("/#features")} className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/pricing")} className="hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/portal")} className="hover:text-foreground">
                  License Portal
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
              <li>
                <Link
                  href={GITLAB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  GitLab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Documentation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={frameworkHref("/docs")} className="hover:text-foreground">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/docs#api-reference")} className="hover:text-foreground">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/docs#platform-guides")} className="hover:text-foreground">
                  Platform Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={frameworkHref("/about")} className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/docs#licensing")} className="hover:text-foreground">
                  License (ELv2)
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/privacy")} className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={frameworkHref("/terms")} className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Szymon Walczak. All rights reserved.
            Licensed under{" "}
            <Link href={frameworkHref("/docs#licensing")} className="underline hover:text-foreground">
              Elastic License v2
            </Link>
            .
          </p>
          <a
            href="https://www.npmjs.com/package/capacitor-bglocation"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/npm/v/capacitor-bglocation?color=%23c2185b&label=npm"
              alt="npm version"
              className="h-5"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
