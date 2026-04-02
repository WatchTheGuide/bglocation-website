import type { ReactNode } from "react";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-10">
          {/* Sidebar — hidden on mobile */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
