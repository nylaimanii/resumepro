"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SectionEditor } from "../section-editor";
import type { ResumeData } from "@/lib/types/resume";

type Skills = ResumeData["skills"];

export function SkillsEditor({ skills, onChange }: { skills: Skills; onChange: (s: Skills) => void }) {
  const [input, setInput] = useState("");
  const cat = skills.categories[0] ?? { id: "default", name: "Skills", items: [] };

  function addSkill(val: string) {
    const trimmed = val.trim();
    if (!trimmed || cat.items.includes(trimmed)) return;
    const updated = { ...cat, items: [...cat.items, trimmed] };
    onChange({ categories: [updated] });
    setInput("");
  }

  function removeSkill(item: string) {
    const updated = { ...cat, items: cat.items.filter((i) => i !== item) };
    onChange({ categories: [updated] });
  }

  return (
    <SectionEditor title="Skills">
      <div className="space-y-3">
        <Input
          className="h-8 text-sm"
          placeholder="type a skill, press enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); addSkill(input); }
            if (e.key === "Backspace" && !input && cat.items.length > 0) {
              removeSkill(cat.items[cat.items.length - 1]);
            }
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          {cat.items.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1 pr-1">
              {item}
              <button type="button" onClick={() => removeSkill(item)} className="hover:text-destructive">
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </SectionEditor>
  );
}
