import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

let user: User | null = null;
let ready = false;
const listeners = new Set<() => void>();
let started = false;

function emit() {
  listeners.forEach((l) => l());
}

/** Start listening to session changes once (called from the root on the client). */
export function initAuth(onChange?: (event: string, u: User | null) => void) {
  if (started) return;
  started = true;
  supabase.auth.getSession().then(({ data }) => {
    user = data.session?.user ?? null;
    ready = true;
    emit();
    onChange?.("INITIAL", user);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
    const prev = user?.id;
    user = session?.user ?? null;
    ready = true;
    emit();
    if (prev !== user?.id || event === "SIGNED_OUT") onChange?.(event, user);
  });
}

export function getUser() {
  return user;
}

export function useUser() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => user,
    () => null,
  );
}

export function useAuthReady() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => ready,
    () => false,
  );
}
