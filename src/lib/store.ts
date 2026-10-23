import { useSyncExternalStore } from "react";
import type { ProjectAssessment } from "./ril";

const KEY = "ril-assessments-v1";
const listeners = new Set<() => void>();
let cache: ProjectAssessment[] | null = null;
const EMPTY: ProjectAssessment[] = [];

function read(): ProjectAssessment[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

function write(list: ProjectAssessment[]) {
  cache = list;
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l());
}

export function useAssessments() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}

export function saveAssessment(a: ProjectAssessment) {
  const list = read().filter((x) => x.id !== a.id);
  write([{ ...a, updatedAt: new Date().toISOString() }, ...list]);
}

export function deleteAssessment(id: string) {
  write(read().filter((x) => x.id !== id));
}
