"use client";

import { useEffect } from "react";

function addCopyButton(pre: HTMLPreElement) {
  if (pre.hasAttribute("data-copy-processed")) return;
  pre.setAttribute("data-copy-processed", "");

  const wrapper = document.createElement("div");
  wrapper.className = "relative group/code";
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const btn = document.createElement("button");
  btn.setAttribute("data-copy-btn", "");
  btn.setAttribute("aria-label", "Copy code");
  btn.className = [
    "absolute right-2 top-2 z-10",
    "flex items-center justify-center",
    "size-8 rounded-md",
    "bg-background/80 border border-border/50 backdrop-blur-sm",
    "text-muted-foreground hover:text-foreground hover:bg-background",
    "opacity-0 group-hover/code:opacity-100",
    "transition-opacity duration-150",
    "cursor-pointer",
  ].join(" ");

  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

  btn.addEventListener("click", async () => {
    const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
    try {
      await navigator.clipboard.writeText(code);
      btn.innerHTML = checkSvg;
      btn.classList.add("text-green-500");
      setTimeout(() => {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        btn.classList.remove("text-green-500");
      }, 2000);
    } catch {
      // Fallback for older browsers / insecure context
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  });

  wrapper.appendChild(btn);
}

function processAllPre() {
  document.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
    // Skip tiny inline-like <pre> (e.g. inside chat widget)
    if (pre.scrollHeight < 40) return;
    addCopyButton(pre);
  });
}

export function CodeCopyProvider() {
  useEffect(() => {
    processAllPre();

    const observer = new MutationObserver(() => {
      processAllPre();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
