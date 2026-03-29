export type Framework = "capacitor" | "react-native";
export type FrameworkStatus = "available" | "beta";
export type PlannedFrameworkStatus = "planned";
export type FrameworkCtaMode = "install" | "docs";

export type FrameworkOption = {
  value: Framework;
  label: string;
  shortLabel: string;
  badgeLabel: string;
  installCommand: string;
  secondaryInstallCommand: string;
  packageName: string;
  platformSummary: string;
  status: FrameworkStatus;
  group: "primary";
  docsReady: boolean;
  ctaMode: FrameworkCtaMode;
  sortOrder: number;
};

export type PlannedFrameworkOption = {
  value: string;
  label: string;
  shortLabel: string;
  badgeLabel: string;
  platformSummary: string;
  status: PlannedFrameworkStatus;
  group: "planned";
  docsReady: false;
  sortOrder: number;
};

export const FRAMEWORK_QUERY_PARAM = "framework";
export const FRAMEWORK_STORAGE_KEY = "bglocation-framework";
export const DEFAULT_FRAMEWORK: Framework = "capacitor";

export const FRAMEWORK_OPTIONS: ReadonlyArray<FrameworkOption> = [
  {
    value: "capacitor",
    label: "Capacitor",
    shortLabel: "Capacitor",
    badgeLabel: "Capacitor 8",
    installCommand: "npm install @bglocation/capacitor",
    secondaryInstallCommand: "npx cap sync",
    packageName: "@bglocation/capacitor",
    platformSummary: "Capacitor 8 + iOS + Android",
    status: "available",
    group: "primary",
    docsReady: true,
    ctaMode: "install",
    sortOrder: 10,
  },
  {
    value: "react-native",
    label: "React Native",
    shortLabel: "React Native",
    badgeLabel: "React Native 0.76+",
    installCommand: "npm install @bglocation/react-native",
    secondaryInstallCommand: "npx expo prebuild",
    packageName: "@bglocation/react-native",
    platformSummary: "React Native 0.76+ + iOS + Android",
    status: "available",
    group: "primary",
    docsReady: true,
    ctaMode: "install",
    sortOrder: 20,
  },
] as const;

export const PLANNED_FRAMEWORK_OPTIONS: ReadonlyArray<PlannedFrameworkOption> = [];

export const ORDERED_FRAMEWORK_OPTIONS = [...FRAMEWORK_OPTIONS].sort(
  (left, right) => left.sortOrder - right.sortOrder,
);

const FRAMEWORK_VALUES = ORDERED_FRAMEWORK_OPTIONS.map((option) => option.value);

export function shouldUseFrameworkMenuMode() {
  return ORDERED_FRAMEWORK_OPTIONS.length > 2 || PLANNED_FRAMEWORK_OPTIONS.length > 0;
}

export function isFramework(value: string | null | undefined): value is Framework {
  return value === "capacitor" || value === "react-native";
}

export function normalizeFrameworkQueryValue(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

function getLevenshteinDistance(left: string, right: string): number {
  const distances = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let previousDiagonal = distances[0];
    distances[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previousAbove = distances[rightIndex];
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      distances[rightIndex] = Math.min(
        distances[rightIndex] + 1,
        distances[rightIndex - 1] + 1,
        previousDiagonal + substitutionCost,
      );

      previousDiagonal = previousAbove;
    }
  }

  return distances[right.length];
}

export function resolveFrameworkQuery(value: string | null | undefined): Framework | null {
  if (!value) {
    return null;
  }

  const normalizedValue = normalizeFrameworkQueryValue(value);

  if (isFramework(normalizedValue)) {
    return normalizedValue;
  }

  const prefixMatches = FRAMEWORK_VALUES.filter(
    (frameworkValue) => frameworkValue.startsWith(normalizedValue) || normalizedValue.startsWith(frameworkValue),
  );

  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }

  const rankedMatches = FRAMEWORK_VALUES.map((frameworkValue) => ({
    frameworkValue,
    distance: getLevenshteinDistance(normalizedValue, frameworkValue),
  })).sort((left, right) => left.distance - right.distance);

  const bestMatch = rankedMatches[0];
  const secondBestMatch = rankedMatches[1];

  if (
    bestMatch &&
    bestMatch.distance <= 2 &&
    (!secondBestMatch || bestMatch.distance < secondBestMatch.distance)
  ) {
    return bestMatch.frameworkValue;
  }

  return null;
}

export function getFrameworkOption(framework: Framework) {
  return ORDERED_FRAMEWORK_OPTIONS.find((option) => option.value === framework) ?? ORDERED_FRAMEWORK_OPTIONS[0];
}

export function withFrameworkHref(href: string, framework: Framework): string {
  if (!href.startsWith("/")) {
    return href;
  }

  const url = new URL(href, "https://bglocation.dev");
  url.searchParams.set(FRAMEWORK_QUERY_PARAM, framework);
  return `${url.pathname}${url.search}${url.hash}`;
}
