"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Trash2, ArrowUp, ArrowDown, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionEditor } from "../section-editor";
import type { ResumeData } from "@/lib/types/resume";

type Exp = ResumeData["experience"][number];

function newExp(): Exp {
  return { id: crypto.randomUUID(), company: "", role: "", location: "", start_date: "", end_date: "", current: false, bullets: [""] };
}

export function ExperienceEditor({
  experiences,
  onChange,
}: {
  experiences: Exp[];
  onChange: (exps: Exp[]) => void;
}) {
  const [rewriting, setRewriting] = useState<string | null>(null);

  function update(id: string, patch: Partial<Exp>) {
    onChange(experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function updateBullet(expId: string, idx: number, val: string) {
    const exp = experiences.find((e) => e.id === expId)!;
    const bullets = [...exp.bullets];
    bullets[idx] = val;
    update(expId, { bullets });
  }

  function addBullet(expId: string) {
    const exp = experiences.find((e) => e.id === expId)!;
    update(expId, { bullets: [...exp.bullets, ""] });
  }

  function removeBullet(expId: string, idx: number) {
    const exp = experiences.find((e) => e.id === expId)!;
    update(expId, { bullets: exp.bullets.filter((_, i) => i !== idx) });
  }

  async function rewriteBullet(expId: string, idx: number, bullet: string) {
    const key = `${expId}-${idx}`;
    setRewriting(key);
    try {
      const res = await fetch("/api/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet }),
      });
      const data = await res.json();
      if (data.rewritten) {
        updateBullet(expId, idx, data.rewritten);
        toast.success("bullet rewritten");
      } else {
        toast.error(data.error ?? "rewrite failed");
      }
    } catch {
      toast.error("network error");
    } finally {
      setRewriting(null);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const arr = [...experiences];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange(arr);
  }

  return (
    <SectionEditor title="Experience" onAdd={() => onChange([...experiences, newExp()])} addLabel="add experience">
      <div className="space-y-5">
        {experiences.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">no experience entries yet</p>
        )}
        {experiences.map((exp, idx) => (
          <div key={exp.id} className="space-y-2 border rounded-md p-3">
            <div className="flex justify-end gap-1">
              <Button aria-label="move up" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
              <Button aria-label="move down" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(idx, 1)} disabled={idx === experiences.length - 1}><ArrowDown className="h-3 w-3" /></Button>
              <Button aria-label="delete experience" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(experiences.filter((e) => e.id !== exp.id))}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">role</Label><Input className="h-7 text-sm" value={exp.role} onChange={(e) => update(exp.id, { role: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">company</Label><Input className="h-7 text-sm" value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><Label className="text-xs">location</Label><Input className="h-7 text-sm" value={exp.location} onChange={(e) => update(exp.id, { location: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">start</Label><Input className="h-7 text-sm" placeholder="Jan 2022" value={exp.start_date} onChange={(e) => update(exp.id, { start_date: e.target.value })} /></div>
              <div className="space-y-1">
                <Label className="text-xs">end</Label>
                <Input className="h-7 text-sm" placeholder="Dec 2024" value={exp.end_date} disabled={exp.current} onChange={(e) => update(exp.id, { end_date: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={exp.current} onCheckedChange={(v) => update(exp.id, { current: !!v, end_date: v ? "" : exp.end_date })} id={`cur-${exp.id}`} />
              <Label htmlFor={`cur-${exp.id}`} className="text-xs cursor-pointer">currently work here</Label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">bullets</Label>
              {exp.bullets.map((bullet, bi) => (
                <div key={bi} className="flex gap-1.5 items-start">
                  <Input
                    className="h-7 text-sm flex-1"
                    value={bullet}
                    placeholder="• achieved X by doing Y, resulting in Z"
                    onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                  />
                  <Button
                    aria-label="improve bullet with ai"
                    variant="ghost" size="icon" className="h-7 w-7 shrink-0"
                    disabled={rewriting === `${exp.id}-${bi}`}
                    onClick={() => rewriteBullet(exp.id, bi, bullet)}
                  >
                    <Sparkles className="h-3 w-3" />
                  </Button>
                  <Button aria-label="remove bullet" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeBullet(exp.id, bi)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => addBullet(exp.id)}>
                <Plus className="h-3 w-3" /> add bullet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionEditor>
  );
}
