"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ResumeData } from "@/lib/types/resume";

type Personal = ResumeData["personal"];

export function PersonalEditor({ data, onChange }: { data: Personal; onChange: (p: Personal) => void }) {
  function field(key: keyof Personal) {
    return (
      <div className="space-y-1">
        <Label className="text-xs capitalize">{key.replace("_", " ")}</Label>
        <Input
          className="h-8 text-sm"
          value={data[key]}
          onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          placeholder={key}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {field("name")}
        {field("title")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("email")}
        {field("phone")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("location")}
        {field("linkedin")}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field("github")}
        {field("website")}
      </div>
    </div>
  );
}
