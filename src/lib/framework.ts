export type Framework = "capacitor" | "react-native";

export const FRAMEWORK_QUERY_PARAM = "framework";
export const FRAMEWORK_STORAGE_KEY = "bglocation-framework";
export const DEFAULT_FRAMEWORK: Framework = "capacitor";

export const FRAMEWORK_OPTIONS = [
  {
    value: "capacitor",
    label: "Capacitor",
    badgeLabel: "Capacitor 8",
    installCommand: "npm install capacitor-bglocation",
    secondaryInstallCommand: "npx cap sync",
    packageName: "capacitor-bglocation",
    platformSummary: "Capacitor 8 + iOS + Android",
  },
  {
    value: "react-native",
    label: "React Native",
    badgeLabel: "React Native 0.76+",
    installCommand: "npm install react-native-bglocation",
    secondaryInstallCommand: "npx expo prebuild",
    packageName: "react-native-bglocation",
    platformSummary: "React Native 0.76+ + iOS + Android",
  },
] as const satisfies ReadonlyArray<{
  value: Framework;
  label: string;
  badgeLabel: string;
  installCommand: string;
  secondaryInstallCommand: string;
  packageName: string;
  platformSummary: string;
}>;

export function isFramework(value: string | null | undefined): value is Framework {
  return value === "capacitor" || value === "react-native";
}

export function getFrameworkOption(framework: Framework) {
  return FRAMEWORK_OPTIONS.find((option) => option.value === framework) ?? FRAMEWORK_OPTIONS[0];
}

export function withFrameworkHref(href: string, framework: Framework): string {
  if (!href.startsWith("/")) {
    return href;
  }

  const url = new URL(href, "https://bglocation.dev");
  url.searchParams.set(FRAMEWORK_QUERY_PARAM, framework);
  return `${url.pathname}${url.search}${url.hash}`;
}
