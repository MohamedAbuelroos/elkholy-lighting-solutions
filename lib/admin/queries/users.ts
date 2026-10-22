import "server-only";

import { requireOwner } from "@/lib/auth/require-owner";
import type { Database } from "@/types/database";

export type AdminUser =
  Database["public"]["Functions"]["get_admin_users"]["Returns"][number];

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { supabase } = await requireOwner();

  const { data, error } = await supabase.rpc("get_admin_users");

  if (error) {
    console.error("Failed to load admin users", {
      code: error.code,
    });

    throw new Error("تعذّر تحميل المستخدمين.");
  }

  return data ?? [];
}
