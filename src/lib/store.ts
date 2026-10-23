import { useSyncExternalStore } from "react";
import type { ProjectAssessment } from "./ril";
import { supabase } from "@/integrations/supabase/client";
import { getUser, initAuth } from "./auth";

/**
 * Hybrid storage: browser localStorage when signed out, the user's account when signed in.
 * On sign-in, local assessments are moved to the account.
 */
const KEY = "ril-assessments-v1";
const listeners = new Set<() => void>();
let cache: ProjectAssessment[] | null = null;
let mode: "local" | "cloud" = "local";
const EMPTY: ProjectAssessment[] = [];

export const SCHEMA_VERSION = 2;

/** Old yes/no answers cannot be mapped to the descriptive model – clear them and flag it. */
function migrate(a: ProjectAssessment): ProjectAssessment {
  if (a.schemaVersion === SCHEMA_VERSION) return a;
  const hadAnswers = Object.keys(a.answers ?? {}).length > 0;
  return { ...a, answers: {}, schemaVersion: SCHEMA_VERSION, resetNotice: hadAnswers };
}

function readLocal(): ProjectAssessment[] {
  try {
    return (JSON.parse(localStorage.getItem(KEY) || "[]") as ProjectAssessment[]).map(migrate);
  } catch {
    return [];
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function read(): ProjectAssessment[] {
  if (!cache) {
    cache = readLocal();
    initAuth(onAuth);
  }
  return cache;
}

function set(list: ProjectAssessment[]) {
  cache = list;
  if (mode === "local") localStorage.setItem(KEY, JSON.stringify(list));
  emit();
}

async function loadCloud(userId: string) {
  const local = readLocal();
  if (local.length) {
    const rows = local.map((a) => ({ id: a.id, user_id: userId, data: a as never, updated_at: a.updatedAt || new Date().toISOString() }));
    const { error } = await supabase.from("assessments").upsert(rows);
    if (!error) localStorage.removeItem(KEY);
  }
  const { data } = await supabase.from("assessments").select("data").order("updated_at", { ascending: false });
  mode = "cloud";
  cache = (data ?? []).map((r) => migrate(r.data as unknown as ProjectAssessment));
  emit();
}

function onAuth(_event: string, user: { id: string } | null) {
  if (user) void loadCloud(user.id);
  else {
    mode = "local";
    cache = readLocal();
    emit();
  }
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
  const item = { ...a, schemaVersion: SCHEMA_VERSION, updatedAt: new Date().toISOString() };
  set([item, ...read().filter((x) => x.id !== a.id)]);
  const u = getUser();
  if (mode === "cloud" && u) {
    void supabase.from("assessments").upsert({ id: item.id, user_id: u.id, data: item as never, updated_at: item.updatedAt });
  }
}

export function deleteAssessment(id: string) {
  set(read().filter((x) => x.id !== id));
  if (mode === "cloud") void supabase.from("assessments").delete().eq("id", id);
}
