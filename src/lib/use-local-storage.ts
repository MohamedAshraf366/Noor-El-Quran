import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

export type Bookmark = { surah: number; ayah: number; surahName: string; updatedAt: number };
export type Preferences = {
  reciterId: string;
  tafsirId: string;
  fontSize: number;
  bookmark: Bookmark | null;
  savedBookmarks: (Bookmark & { name: string })[];
};

export const DEFAULT_PREFS: Preferences = {
  reciterId: "ar.alafasy",
  tafsirId: "ar.muyassar",
  fontSize: 28,
  bookmark: null,
  savedBookmarks: [],
};

export function usePreferences() {
  return useLocalStorage<Preferences>("nq.prefs", DEFAULT_PREFS);
}