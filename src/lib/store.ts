import { useSyncExternalStore } from "react";
import type { ProjectAssessment } from "./ril";

const KEY = "ril-assessments-v1";
const listeners = new Set<() => void>();
let cache: ProjectAssessment[] | null = null;
const EMPTY: ProjectAssessment[] = [];

function read(): ProjectAssessment[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]") as ProjectAssessment[];
    cache = raw.map(migrate);
  } catch {
    cache = [];
  }
  return cache!;
}

export const SCHEMA_VERSION = 2;

/** Old yes/no answers cannot be mapped to the descriptive model – clear them and flag it. */
function migrate(a: ProjectAssessment): ProjectAssessment {
  if (a.schemaVersion === SCHEMA_VERSION) return a;
  const hadAnswers = Object.keys(a.answers ?? {}).length > 0;
  return { ...a, answers: {}, schemaVersion: SCHEMA_VERSION, resetNotice: hadAnswers };
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
  write([{ ...a, schemaVersion: SCHEMA_VERSION, updatedAt: new Date().toISOString() }, ...list]);
}

export function deleteAssessment(id: string) {
  write(read().filter((x) => x.id !== id));
}
