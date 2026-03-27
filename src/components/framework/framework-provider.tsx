"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_FRAMEWORK,
  FRAMEWORK_QUERY_PARAM,
  FRAMEWORK_STORAGE_KEY,
  isFramework,
  type Framework,
  withFrameworkHref,
} from "@/lib/framework";

type FrameworkContextValue = {
  framework: Framework;
  setFramework: (framework: Framework) => void;
  frameworkHref: (href: string) => string;
};

const FrameworkContext = createContext<FrameworkContextValue | null>(null);

function getFrameworkFromLocation(): Framework | null {
  if (typeof window === "undefined") {
    return null;
  }

  const fromSearch = new URLSearchParams(window.location.search).get(FRAMEWORK_QUERY_PARAM);
  return isFramework(fromSearch) ? fromSearch : null;
}

function subscribeToLocation(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("hashchange", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("hashchange", onStoreChange);
  };
}

function buildCurrentHref(pathname: string): string {
  const hash = typeof window === "undefined" ? "" : window.location.hash;
  const search = typeof window === "undefined" ? "" : window.location.search;
  return `${pathname}${search}${hash}`;
}

export function FrameworkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchFramework = useSyncExternalStore(
    subscribeToLocation,
    getFrameworkFromLocation,
    () => null,
  );
  const [storedFramework, setStoredFramework] = useState<Framework>(() => {
    const fromLocation = getFrameworkFromLocation();
    if (fromLocation) {
      return fromLocation;
    }

    if (typeof window !== "undefined") {
      const fromStorage = window.localStorage.getItem(FRAMEWORK_STORAGE_KEY);
      if (isFramework(fromStorage)) {
        return fromStorage;
      }
    }

    return DEFAULT_FRAMEWORK;
  });
  const framework = searchFramework ?? storedFramework;

  useEffect(() => {
    window.localStorage.setItem(FRAMEWORK_STORAGE_KEY, framework);
  }, [framework]);

  useEffect(() => {
    const fromLocation = getFrameworkFromLocation();
    if (fromLocation) {
      return;
    }

    startTransition(() => {
      router.replace(withFrameworkHref(buildCurrentHref(pathname), framework), {
        scroll: false,
      });
    });
  }, [framework, pathname, router]);

  const value = useMemo<FrameworkContextValue>(
    () => ({
      framework,
      setFramework: (nextFramework) => {
        setStoredFramework(nextFramework);
        startTransition(() => {
          router.replace(withFrameworkHref(buildCurrentHref(pathname), nextFramework), {
            scroll: false,
          });
        });
      },
      frameworkHref: (href) => withFrameworkHref(href, framework),
    }),
    [framework, pathname, router],
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
