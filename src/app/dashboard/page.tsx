import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-semibold">welcome, {user.email}</p>
      <form action="/auth/logout" method="POST">
        <Button type="submit" variant="outline">sign out</Button>
      </form>
    </main>
  );
}
