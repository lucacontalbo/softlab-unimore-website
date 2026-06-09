"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className="flex rounded-md overflow-hidden border border-slate-200 text-xs">
          {(["write", "preview"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-500 hover:text-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden">
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:ring-inset resize-y min-h-[200px] font-mono"
          />
        ) : (
          <div className="px-4 py-3 min-h-[200px] bg-white prose prose-sm prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600 prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-800">
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic text-sm">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1">Supports Markdown — **bold**, *italic*, lists, headings, links.</p>
    </div>
  );
}
