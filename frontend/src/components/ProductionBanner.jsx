import React from "react";
import { Info } from "lucide-react";

export default function ProductionBanner({ title, description }) {
  return (
    <div className="production-banner flex items-start gap-3 p-4 mb-6 rounded-lg glass-panel bg-blue-900/20 border border-blue-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
      <div className="z-10 bg-blue-500/20 p-2 rounded-md">
        <Info className="w-5 h-5 text-blue-400" />
      </div>
      <div className="z-10 flex-1">
        <h4 className="text-sm font-semibold text-blue-300 tracking-wide uppercase font-display">{title}</h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
