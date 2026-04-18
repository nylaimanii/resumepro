import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold tracking-tight">resumepro</h1>
      <p className="text-muted-foreground">ai-powered resume analysis + builder</p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/auth/login">sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">get started</Link>
        </Button>
      </div>
    </main>
  );
}
