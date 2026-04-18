"use client";

import { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionEditor } from "../section-editor";
import type { ResumeData } from "@/lib/types/resume";

type Proj = ResumeData["projects"][number];
const newProj = (): Proj => ({ id: crypto.randomUUID(), name: "", description: "", link: "", tech: [], bullets: [""] });

export function ProjectsEditor({ projects, onChange }: { projects: Proj[]; onChange: (p: Proj[]) => void }) {
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  function update(id: string, patch: Partial<Proj>) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function addTech(proj: Proj, val: string) {
    const trimmed = val.trim();
    if (!trimmed || proj.tech.includes(trimmed)) return;
    update(proj.id, { tech: [...proj.tech, trimmed] });
    setTechInput((s) => ({ ...s, [proj.id]: "" }));
  }

  return (
    <SectionEditor title="Projects" onAdd={() => onChange([...projects, newProj()])} addLabel="add project">
      <div className="space-y-4">
        {projects.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">no projects yet</p>}
        {projects.map((proj) => (
          <div key={proj.id} className="space-y-2 border rounded-md p-3">
            <div className="flex justify-end">
              <Button aria-label="delete project" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(projects.filter((p) => p.id !== proj.id))}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">name</Label><Input className="h-7 text-sm" value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">link</Label><Input className="h-7 text-sm" value={proj.link} onChange={(e) => update(proj.id, { link: e.target.value })} /></div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">tech stack</Label>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {proj.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1 pr-1 text-xs">
                    {t}
                    <button type="button" onClick={() => update(proj.id, { tech: proj.tech.filter((x) => x !== t) })}>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input
                className="h-7 text-sm"
                placeholder="add tech, press enter"
                value={techInput[proj.id] ?? ""}
                onChange={(e) => setTechInput((s) => ({ ...s, [proj.id]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(proj, techInput[proj.id] ?? ""); } }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">bullets</Label>
              {proj.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-1.5">
                  <Input
                    className="h-7 text-sm flex-1"
                    value={b}
                    onChange={(e) => { const bullets = [...proj.bullets]; bullets[bi] = e.target.value; update(proj.id, { bullets }); }}
                  />
                  <Button aria-label="remove bullet" variant="ghost" size="icon" className="h-7 w-7" onClick={() => update(proj.id, { bullets: proj.bullets.filter((_, i) => i !== bi) })}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => update(proj.id, { bullets: [...proj.bullets, ""] })}>
                <Plus className="h-3 w-3" /> add bullet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionEditor>
  );
}
