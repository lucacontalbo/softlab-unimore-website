"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Newspaper, Microscope, Settings, BookOpen, RefreshCw,
  LogOut, Save, Plus, Trash2, FlaskConical, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle
} from "lucide-react";
import type { TeamMember, NewsItem, ResearchArea, SiteConfig, Publication } from "@/lib/data";

type Tab = "site" | "team" | "news" | "research" | "publications";

interface Toast { type: "success" | "error"; message: string; }

function Toast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white z-50 transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {toast.message}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("site");
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);

  // Data states
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [research, setResearch] = useState<ResearchArea[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [refreshingPubs, setRefreshingPubs] = useState(false);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  const checkAuth = useCallback(async () => {
    const r = await fetch("/api/auth/check");
    if (!r.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    if (tab === "site") fetch("/api/admin/site").then(r => r.json()).then(setSite);
    if (tab === "team") fetch("/api/admin/team").then(r => r.json()).then(setTeam);
    if (tab === "news") fetch("/api/admin/news").then(r => r.json()).then(setNews);
    if (tab === "research") fetch("/api/admin/research").then(r => r.json()).then(setResearch);
    if (tab === "publications") fetch("/api/publications/list").then(r => r.json()).then(setPublications);
  }, [tab]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  async function saveSite() {
    if (!site) return;
    setSaving(true);
    const r = await fetch("/api/admin/site", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(site) });
    setSaving(false);
    r.ok ? showToast("success", "Site settings saved!") : showToast("error", "Failed to save.");
  }

  async function saveTeam() {
    setSaving(true);
    const r = await fetch("/api/admin/team", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(team) });
    setSaving(false);
    r.ok ? showToast("success", "Team saved!") : showToast("error", "Failed to save.");
  }

  async function saveNews() {
    setSaving(true);
    const r = await fetch("/api/admin/news", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(news) });
    setSaving(false);
    r.ok ? showToast("success", "News saved!") : showToast("error", "Failed to save.");
  }

  async function saveResearch() {
    setSaving(true);
    const r = await fetch("/api/admin/research", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(research) });
    setSaving(false);
    r.ok ? showToast("success", "Research areas saved!") : showToast("error", "Failed to save.");
  }

  async function refreshPublications() {
    setRefreshingPubs(true);
    try {
      const r = await fetch("/api/publications/refresh", { method: "POST" });
      const data = await r.json();
      if (r.ok) {
        setPublications(data.publications ?? []);
        showToast("success", `Updated ${data.count ?? 0} publications`);
      } else {
        showToast("error", data.error ?? "Refresh failed");
      }
    } catch {
      showToast("error", "Refresh failed");
    }
    setRefreshingPubs(false);
  }

  const TABS = [
    { id: "site" as Tab, label: "Site Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "team" as Tab, label: "Team", icon: <Users className="w-4 h-4" /> },
    { id: "news" as Tab, label: "News", icon: <Newspaper className="w-4 h-4" /> },
    { id: "research" as Tab, label: "Research Areas", icon: <Microscope className="w-4 h-4" /> },
    { id: "publications" as Tab, label: "Publications", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-0">
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}

      {/* Admin header */}
      <header className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg">SoftLab <span className="text-slate-400 font-normal text-base">Admin</span></span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-cyan-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Site Settings */}
        {tab === "site" && site && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">Site Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(Object.keys(site) as (keyof SiteConfig)[]).map((key) => (
                <div key={key} className={key === "about" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{key.replace(/_/g, " ")}</label>
                  {key === "about" ? (
                    <textarea
                      rows={5}
                      value={site[key]}
                      onChange={(e) => setSite({ ...site, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={site[key]}
                      onChange={(e) => setSite({ ...site, [key]: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={saveSite} disabled={saving} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />{saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        )}

        {/* Team */}
        {tab === "team" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Team Members ({team.length})</h2>
              <button
                onClick={() => setTeam([...team, { id: Date.now().toString(), name: "New Member", role: "PhD Student", email: "", bio: "", research_interests: [], scholar_url: null, github_url: null, personal_url: null, featured: true, order: team.length + 1 }])}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>
            <div className="space-y-4">
              {team.map((m, i) => (
                <TeamMemberEditor key={m.id} member={m} onChange={(updated) => { const t = [...team]; t[i] = updated; setTeam(t); }} onDelete={() => setTeam(team.filter((_, idx) => idx !== i))} />
              ))}
            </div>
            <button onClick={saveTeam} disabled={saving} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />{saving ? "Saving…" : "Save Team"}
            </button>
          </div>
        )}

        {/* News */}
        {tab === "news" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">News Items ({news.length})</h2>
              <button
                onClick={() => {
                  const id = Date.now().toString();
                  setNews([{ id, slug: `news-${id}`, title: "New Article", date: new Date().toISOString().split("T")[0], category: "Research", excerpt: "", content: "<p>Article content here.</p>", featured: false, author: "SoftLab" }, ...news]);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add Article
              </button>
            </div>
            <div className="space-y-4">
              {news.map((item, i) => (
                <NewsItemEditor key={item.id} item={item} onChange={(updated) => { const n = [...news]; n[i] = updated; setNews(n); }} onDelete={() => setNews(news.filter((_, idx) => idx !== i))} />
              ))}
            </div>
            <button onClick={saveNews} disabled={saving} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />{saving ? "Saving…" : "Save News"}
            </button>
          </div>
        )}

        {/* Research */}
        {tab === "research" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">Research Areas ({research.length})</h2>
            <div className="space-y-4">
              {research.map((area, i) => (
                <ResearchAreaEditor key={area.id} area={area} onChange={(updated) => { const r = [...research]; r[i] = updated; setResearch(r); }} onDelete={() => setResearch(research.filter((_, idx) => idx !== i))} />
              ))}
            </div>
            <button onClick={saveResearch} disabled={saving} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60">
              <Save className="w-4 h-4" />{saving ? "Saving…" : "Save Research Areas"}
            </button>
          </div>
        )}

        {/* Publications */}
        {tab === "publications" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Publications ({publications.length})</h2>
              <button
                onClick={refreshPublications}
                disabled={refreshingPubs}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${refreshingPubs ? "animate-spin" : ""}`} />
                {refreshingPubs ? "Refreshing…" : "Refresh from Scholar"}
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Publications are automatically fetched from{" "}
              <a href="https://scholar.google.it/citations?user=A68h4-8AAAAJ" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                Francesco Guerra&apos;s Google Scholar profile
              </a>
              . Use the button above to manually refresh.
            </p>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {publications.map((pub) => (
                <div key={pub.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="font-semibold text-slate-900 text-sm">{pub.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{pub.authors.join(", ")} · {pub.venue} · {pub.year}</p>
                  <p className="text-xs text-slate-400">{pub.citations} citations</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamMemberEditor({ member, onChange, onDelete }: { member: TeamMember; onChange: (m: TeamMember) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <span className="font-semibold text-slate-900 text-sm">{member.name}</span>
          <span className="ml-2 text-xs text-slate-400">{member.role}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["name", "role", "email", "scholar_url", "github_url", "personal_url"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{field.replace(/_/g, " ")}</label>
              <input type="text" value={(member[field] as string) ?? ""} onChange={(e) => onChange({ ...member, [field]: e.target.value || null })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Bio</label>
            <textarea rows={3} value={member.bio} onChange={(e) => onChange({ ...member, bio: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Research Interests (comma-separated)</label>
            <input type="text" value={member.research_interests.join(", ")} onChange={(e) => onChange({ ...member, research_interests: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured</label>
            <input type="checkbox" checked={member.featured} onChange={(e) => onChange({ ...member, featured: e.target.checked })} className="w-4 h-4 accent-cyan-600" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Order</label>
            <input type="number" value={member.order} onChange={(e) => onChange({ ...member, order: parseInt(e.target.value) })} className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
        </div>
      )}
    </div>
  );
}

function NewsItemEditor({ item, onChange, onDelete }: { item: NewsItem; onChange: (n: NewsItem) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer" onClick={() => setOpen(!open)}>
        <div>
          <span className="font-semibold text-slate-900 text-sm">{item.title}</span>
          <span className="ml-2 text-xs text-slate-400">{item.date} · {item.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["title", "slug", "date", "author"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{field}</label>
              <input type={field === "date" ? "date" : "text"} value={item[field]} onChange={(e) => onChange({ ...item, [field]: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
            <select value={item.category} onChange={(e) => onChange({ ...item, category: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              {["Research", "Publication", "Award", "Event"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured</label>
            <input type="checkbox" checked={item.featured} onChange={(e) => onChange({ ...item, featured: e.target.checked })} className="w-4 h-4 accent-cyan-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Excerpt</label>
            <textarea rows={2} value={item.excerpt} onChange={(e) => onChange({ ...item, excerpt: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Content (HTML)</label>
            <textarea rows={6} value={item.content} onChange={(e) => onChange({ ...item, content: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none font-mono" />
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchAreaEditor({ area, onChange, onDelete }: { area: ResearchArea; onChange: (a: ResearchArea) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="font-semibold text-slate-900 text-sm">{area.title}</span>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>
      {open && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["title", "icon", "color"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{field}</label>
              <input type="text" value={area[field]} onChange={(e) => onChange({ ...area, [field]: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Order</label>
            <input type="number" value={area.order} onChange={(e) => onChange({ ...area, order: parseInt(e.target.value) })} className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
            <textarea rows={3} value={area.description} onChange={(e) => onChange({ ...area, description: e.target.value })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Topics (comma-separated)</label>
            <input type="text" value={area.topics.join(", ")} onChange={(e) => onChange({ ...area, topics: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
        </div>
      )}
    </div>
  );
}
