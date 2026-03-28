import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  wordmark?: string;
  priority?: boolean;
};

export function SiteLogo({
  className,
  iconClassName,
  wordmarkClassName,
  wordmark = "bglocation",
  priority = false,
}: SiteLogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/bglocation-icon.svg"
        alt=""
        aria-hidden="true"
        width={148}
        height={176}
        priority={priority}
        className={cn("h-6 w-auto shrink-0", iconClassName)}
      />
      <span className={cn("font-semibold tracking-tight", wordmarkClassName)}>{wordmark}</span>
    </span>
  );
}