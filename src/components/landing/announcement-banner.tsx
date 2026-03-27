import Link from "next/link";
import { Rocket } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <div className="border-b bg-primary/5">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2.5 text-center text-sm sm:px-6">
        <Rocket className="h-4 w-4 shrink-0 text-primary" />
        <p>
          <strong className="text-primary">License sales launch: April 27, 2026</strong>{" "}
          —{" "}
          <Link
            href="#newsletter-cta"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Get notified
          </Link>{" "}
          or{" "}
          <Link
            href="/pricing"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            view pricing
          </Link>
        </p>
      </div>
    </div>
  );
}
