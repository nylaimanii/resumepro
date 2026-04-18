import type { SupabaseClient } from "@supabase/supabase-js";

const DAILY_LIMIT = 10;

export async function checkAndIncrementAnalysisQuota(
  userId: string,
  supabase: SupabaseClient
): Promise<{ allowed: boolean; used: number; limit: number; resetsAt: Date }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("daily_analyses_used, daily_reset_at")
    .eq("id", userId)
    .single();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (!profile) {
    await supabase.from("profiles").upsert({
      id: userId,
      daily_analyses_used: 1,
      daily_reset_at: now.toISOString(),
    });
    return { allowed: true, used: 1, limit: DAILY_LIMIT, resetsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
  }

  const resetAt = new Date(profile.daily_reset_at);
  const shouldReset = resetAt < twentyFourHoursAgo;

  if (shouldReset) {
    await supabase
      .from("profiles")
      .update({ daily_analyses_used: 1, daily_reset_at: now.toISOString() })
      .eq("id", userId);
    return { allowed: true, used: 1, limit: DAILY_LIMIT, resetsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) };
  }

  const used = profile.daily_analyses_used;
  const resetsAt = new Date(resetAt.getTime() + 24 * 60 * 60 * 1000);

  if (used >= DAILY_LIMIT) {
    return { allowed: false, used, limit: DAILY_LIMIT, resetsAt };
  }

  await supabase
    .from("profiles")
    .update({ daily_analyses_used: used + 1 })
    .eq("id", userId);

  return { allowed: true, used: used + 1, limit: DAILY_LIMIT, resetsAt };
}
