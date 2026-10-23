import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Permanently delete the signed-in user's assessments and account. */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("assessments").delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: e2 } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (e2) throw new Error(e2.message);
    return { ok: true };
  });
