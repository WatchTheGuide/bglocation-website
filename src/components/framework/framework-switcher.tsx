"use client";

import Link from "next/link";
import { Check, ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useFramework } from "@/components/framework/framework-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ORDERED_FRAMEWORK_OPTIONS,
  PLANNED_FRAMEWORK_OPTIONS,
  shouldUseFrameworkMenuMode,
} from "@/lib/framework";
import { cn } from "@/lib/utils";

function getFrameworkOptionButtonId(optionValue: string) {
  return `framework-switcher-option-${optionValue}`;
}

export function FrameworkSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { framework, frameworkOptionHref } = useFramework();
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const usesMenuMode = shouldUseFrameworkMenuMode();
  const activeOption = useMemo(
    () => ORDERED_FRAMEWORK_OPTIONS.find((option) => option.value === framework) ?? ORDERED_FRAMEWORK_OPTIONS[0],
    [framework],
  );

  useEffect(() => {
    if (!usesMenuMode || !menuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, usesMenuMode]);

  if (!usesMenuMode) {
    return (
      <div
        data-testid="framework-switcher"
        data-framework-switcher-mode="segmented"
        role="group"
        aria-label="Current integration"
        className={cn(
          "inline-flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur",
          className,
        )}
      >
        {ORDERED_FRAMEWORK_OPTIONS.map((option) => {
          const active = option.value === framework;
          return (
            <Link
              key={option.value}
              href={frameworkOptionHref(option.value)}
              replace
              scroll={false}
              aria-label={`Switch to ${option.label}`}
              aria-current={active ? "page" : undefined}
              data-framework-option={option.value}
              className={cn(
                buttonVariants({
                  variant: active ? "default" : "ghost",
                  size: compact ? "sm" : "default",
                }),
                "rounded-full px-3",
                !active && "text-muted-foreground hover:text-foreground",
              )}
            >
              {compact ? option.shortLabel : option.badgeLabel}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      data-testid="framework-switcher"
      data-framework-switcher-mode="menu"
      className={cn(
        "relative inline-flex",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size={compact ? "sm" : "default"}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
        aria-controls={listboxId}
        aria-label="Choose integration"
        data-testid="framework-switcher-trigger"
        className={cn(
          "min-w-0 rounded-full border bg-background/80 shadow-sm backdrop-blur",
          compact ? "max-w-52 px-3" : "max-w-80 px-4",
        )}
        onClick={() => setMenuOpen((value) => !value)}
      >
        <span className="min-w-0 truncate text-left">
          {compact ? activeOption.shortLabel : activeOption.badgeLabel}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", menuOpen && "rotate-180")} />
      </Button>

      {menuOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Choose integration"
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-background p-2 shadow-2xl",
            compact ? "right-0" : "left-1/2 -translate-x-1/2",
          )}
        >
          <div className="px-3 pb-2 pt-1">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Current integration
            </p>
          </div>

          <div className="space-y-1">
            {ORDERED_FRAMEWORK_OPTIONS.map((option) => {
              const active = option.value === framework;

              return (
                <Link
                  key={option.value}
                  id={getFrameworkOptionButtonId(option.value)}
                  href={frameworkOptionHref(option.value)}
                  replace
                  scroll={false}
                  role="option"
                  aria-selected={active}
                  aria-current={active ? "page" : undefined}
                  data-framework-option={option.value}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                    active ? "bg-primary/8 text-foreground" : "hover:bg-muted/70",
                  )}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-transparent",
                    )}
                  >
                    <Check className="size-3.5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{option.label}</span>
                      {option.status === "beta" ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                          Beta
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{option.platformSummary}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {PLANNED_FRAMEWORK_OPTIONS.length > 0 ? (
            <div className="mt-2 border-t pt-2">
              <div className="px-3 pb-2 pt-1">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Planned adapters
                </p>
              </div>

              <div className="space-y-1">
                {PLANNED_FRAMEWORK_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start gap-3 rounded-xl px-3 py-3 text-left text-muted-foreground"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/40">
                      <Clock3 className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-foreground/90">{option.label}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.16em]">
                          Planned
                        </span>
                      </span>
                      <span className="mt-1 block text-sm">{option.platformSummary}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
