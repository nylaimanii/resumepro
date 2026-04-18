"use client";

import { Slider } from "@/components/ui/slider";

function toneLabel(value: number): string {
  if (value <= 33) return "formal";
  if (value <= 66) return "professional";
  return "conversational";
}

export function ToneSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">tone</span>
        <span className="text-xs font-medium">{toneLabel(value)}</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground select-none">
        <span>formal</span>
        <span>professional</span>
        <span>conversational</span>
      </div>
    </div>
  );
}
