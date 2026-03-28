"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_FRAMEWORK,
  FRAMEWORK_QUERY_PARAM,
  resolveFrameworkQuery,
  type Framework,
  withFrameworkHref,
} from "@/lib/framework";

const FRAMEWORK_LOCATION_CHANGE_EVENT = "bglocation:location-change";
let historyEventsPatched = false;

type FrameworkContextValue = {
  framework: Framework;
  frameworkHref: (href: string) => string;
  frameworkOptionHref: (framework: Framework) => string;
};

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

function getFrameworkFromLocation(): Framework | null {
  const rawFramework = getRawFrameworkFromLocation();
  return resolveFrameworkQuery(rawFramework);
}

function getRawFrameworkFromLocation(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get(FRAMEWORK_QUERY_PARAM);
}

function getFrameworkSnapshot(): Framework {
  return getFrameworkFromLocation() ?? DEFAULT_FRAMEWORK;
}

function buildCurrentHref(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function emitFrameworkLocationChange() {
  queueMicrotask(() => {
    window.dispatchEvent(new Event(FRAMEWORK_LOCATION_CHANGE_EVENT));
  });
}

function patchHistoryEvents() {
  if (typeof window === "undefined") {
    return;
  }

  if (historyEventsPatched) {
    return;
  }

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function pushState(...args) {
    const result = originalPushState(...args);
    emitFrameworkLocationChange();
    return result;
  };

  window.history.replaceState = function replaceState(...args) {
    const result = originalReplaceState(...args);
    emitFrameworkLocationChange();
    return result;
  };

  historyEventsPatched = true;
}

function subscribeToFrameworkStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  patchHistoryEvents();

  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener(FRAMEWORK_LOCATION_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener(FRAMEWORK_LOCATION_CHANGE_EVENT, onStoreChange);
  };
}

export function FrameworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const framework = useSyncExternalStore(
    subscribeToFrameworkStore,
    getFrameworkSnapshot,
    () => DEFAULT_FRAMEWORK,
  );

  useEffect(() => {
    const rawFramework = getRawFrameworkFromLocation();

    if (!rawFramework) {
      return;
    }

    const resolvedFramework = resolveFrameworkQuery(rawFramework) ?? DEFAULT_FRAMEWORK;

    if (rawFramework === resolvedFramework) {
      return;
    }

    router.replace(withFrameworkHref(buildCurrentHref(), resolvedFramework), {
      scroll: false,
    });
  }, [framework, pathname, router]);

  const value = useMemo<FrameworkContextValue>(
    () => ({
      framework,
      frameworkHref: (href) => withFrameworkHref(href, framework),
      frameworkOptionHref: (nextFramework) =>
        withFrameworkHref(
          typeof window !== "undefined" ? buildCurrentHref() : pathname,
          nextFramework,
        ),
    }),
    [framework, pathname],
  );

  return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
}

export function useFramework() {
  const context = useContext(FrameworkContext);

  if (!context) {
    throw new Error("useFramework must be used within FrameworkProvider");
  }

  return context;
}
