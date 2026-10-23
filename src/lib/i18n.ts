import { useSyncExternalStore } from "react";

export type Lang = "nb" | "en";
const KEY = "ril-lang";
const listeners = new Set<() => void>();

function get(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "nb";
  } catch {
    return "nb";
  }
}

export function setLang(l: Lang) {
  localStorage.setItem(KEY, l);
  document.documentElement.lang = l;
  listeners.forEach((f) => f());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get,
    () => "nb",
  );
}

/** Pick text for the current language: tr({ nb: "...", en: "..." }). */
export function useT() {
  const lang = useLang();
  return { lang, tr: <T,>(v: { nb: T; en: T }): T => v[lang] };
}
