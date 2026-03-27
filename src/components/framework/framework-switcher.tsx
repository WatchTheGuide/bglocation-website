"use client";

import { useFramework } from "@/components/framework/framework-provider";
import { Button } from "@/components/ui/button";
import { FRAMEWORK_OPTIONS } from "@/lib/framework";
import { cn } from "@/lib/utils";

export function FrameworkSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { framework, setFramework } = useFramework();

  return (
    <div
      data-testid="framework-switcher"
      role="tablist"
      aria-label="Framework switcher"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      {FRAMEWORK_OPTIONS.map((option) => {
        const active = option.value === framework;
        return (
          <Button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Switch to ${option.label}`}
            variant={active ? "default" : "ghost"}
            size={compact ? "sm" : "default"}
            className={cn(
              "rounded-full px-3",
              !active && "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setFramework(option.value)}
          >
            {compact ? option.label : option.badgeLabel}
          </Button>
        );
      })}
    </div>
  );
}
