import React from "react";
import { Info } from "lucide-react";

export default function ProductionBanner({ title, description }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
      style={{
        background: "rgba(99, 102, 241, 0.06)",
        border: "1px solid rgba(99, 102, 241, 0.15)",
      }}
    >
      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#818cf8" }} />
      <div>
        {title && <span className="font-semibold text-indigo-300">{title} — </span>}
        <span style={{ color: "#64748b" }}>{description}</span>
      </div>
    </div>
  );
}
