"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionEditor } from "../section-editor";
import type { ResumeData } from "@/lib/types/resume";

type Cert = ResumeData["certifications"][number];
const newCert = (): Cert => ({ id: crypto.randomUUID(), name: "", issuer: "", date: "" });

export function CertificationsEditor({ certifications, onChange }: { certifications: Cert[]; onChange: (c: Cert[]) => void }) {
  function update(id: string, patch: Partial<Cert>) {
    onChange(certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  return (
    <SectionEditor title="Certifications" onAdd={() => onChange([...certifications, newCert()])} addLabel="add cert" defaultOpen={false}>
      <div className="space-y-3">
        {certifications.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">no certifications yet</p>}
        {certifications.map((cert) => (
          <div key={cert.id} className="space-y-2 border rounded-md p-3">
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onChange(certifications.filter((c) => c.id !== cert.id))}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1"><Label className="text-xs">name</Label><Input className="h-7 text-sm" value={cert.name} onChange={(e) => update(cert.id, { name: e.target.value })} /></div>
              <div className="space-y-1"><Label className="text-xs">date</Label><Input className="h-7 text-sm" placeholder="2024" value={cert.date} onChange={(e) => update(cert.id, { date: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">issuer</Label><Input className="h-7 text-sm" value={cert.issuer} onChange={(e) => update(cert.id, { issuer: e.target.value })} /></div>
          </div>
        ))}
      </div>
    </SectionEditor>
  );
}
