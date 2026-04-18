"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionEditor } from "../section-editor";
import type { ResumeData } from "@/lib/types/resume";

type Edu = ResumeData["education"][number];
const newEdu = (): Edu => ({ id: crypto.randomUUID(), school: "", degree: "", field: "", location: "", start_date: "", end_date: "", gpa: "" });

export function EducationEditor({ education, onChange }: { education: Edu[]; onChange: (e: Edu[]) => void }) {
  function update(id: string, patch: Partial<Edu>) {
    onChange(education.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  return (
    <SectionEditor title="Education" onAdd={() => onChange([...education, newEdu()])} addLabel="add education">
      <div className="space-y-4">
        {education.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">no education entries yet</p>}
        {education.map((edu) => (
          <div key={edu.id} className="space-y-2 border rounded-md p-3">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(education.filter((e) => e.id !== edu.id))}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">school</Label><Input className="h-7 text-sm" value={edu.school} onChange={(e) => update(edu.id, { school: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">degree</Label><Input className="h-7 text-sm" value={edu.degree} onChange={(e) => update(edu.id, { degree: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">field of study</Label><Input className="h-7 text-sm" value={edu.field} onChange={(e) => update(edu.id, { field: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">location</Label><Input className="h-7 text-sm" value={edu.location} onChange={(e) => update(edu.id, { location: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><Label className="text-xs">start</Label><Input className="h-7 text-sm" value={edu.start_date} onChange={(e) => update(edu.id, { start_date: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">end</Label><Input className="h-7 text-sm" value={edu.end_date} onChange={(e) => update(edu.id, { end_date: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">gpa</Label><Input className="h-7 text-sm" value={edu.gpa ?? ""} onChange={(e) => update(edu.id, { gpa: e.target.value })} /></div>
            </div>
          </div>
        ))}
      </div>
    </SectionEditor>
  );
}
