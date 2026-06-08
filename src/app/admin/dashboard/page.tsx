"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Newspaper, FlaskConical, Settings, BookOpen, RefreshCw,
  LogOut, Save, Plus, Trash2, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, FolderOpen, Briefcase, Edit2
} from "lucide-react";
import type {
  TeamMember, NewsItem, ResearchArea, SiteConfig,
  Publication, Project, ConsultingItem
} from "@/lib/data";

type Tab = "site" | "team" | "news" | "research" | "projects" | "consulting" | "publications";

interface ToastMsg { type: "success" | "error"; message: string; }

function ToastNotif({ toast, onDismiss }: { toast: ToastMsg; onDismiss: () => void }) {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white z-50 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {toast.message}
    </div>
  );
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function FieldInput({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{label}</span>
      {type === "textarea" ? (
        <textarea
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B71]/30 focus:border-[#003B71] resize-y min-h-[80px]"
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B71]/30 focus:border-[#003B71]"
          value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        />
      )}
    </label>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("site");
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const [saving, setSaving] = useState(false);

  const [site, setSite] = useState<SiteConfig | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [research, setResearch] = useState<ResearchArea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [consulting, setConsulting] = useState<ConsultingItem[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [refreshingPubs, setRefreshingPubs] = useState(false);

  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [editResearchId, setEditResearchId] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editConsultingId, setEditConsultingId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", message: string) => setToast({ type, message });

  const checkAuth = useCallback(async () => {
    const r = await fetch("/api/auth/check");
    if (!r.ok) router.push("/admin");
  }, [router]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    const loaders: Record<Tab, () => void> = {
      site: () => fetch("/api/admin/site").then(r => r.json()).then(setSite),
      team: () => fetch("/api/admin/team").then(r => r.json()).then(setTeam),
      news: () => fetch("/api/admin/news").then(r => r.json()).then(setNews),
      research: () => fetch("/api/admin/research").then(r => r.json()).then(setResearch),
      projects: () => fetch("/api/admin/projects").then(r => r.json()).then(setProjects),
      consulting: () => fetch("/api/admin/consulting").then(r => r.json()).then(setConsulting),
      publications: () => fetch("/api/publications/list").then(r => r.json()).then(setPublications),
    };
    loaders[tab]?.();
  }, [tab]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  async function saveData(endpoint: string, data: unknown, msg: string) {
    setSaving(true);
    const r = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    r.ok ? showToast("success", msg) : showToast("error", "Failed to save. Please try again.");
    return r.ok;
  }

  async function refreshPublications() {
    setRefreshingPubs(true);
    const r = await fetch("/api/publications/refresh", { method: "POST" });
    setRefreshingPubs(false);
    if (r.ok) {
      showToast("success", "Publications refreshed!");
      fetch("/api/publications/list").then(res => res.json()).then(setPublications);
    } else {
      showToast("error", "Refresh failed. Check Scholar settings.");
    }
  }

  function addTeamMember() {
    const m: TeamMember = { id: genId(), name: "", surname: "", email: "", image: "", order: team.length + 1 };
    setTeam(prev => [...prev, m]);
    setEditTeamId(m.id);
  }
  function updateTeamMember(id: string, patch: Partial<TeamMember>) {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
  }
  function deleteTeamMember(id: string) { setTeam(prev => prev.filter(m => m.id !== id)); }

  function addNewsItem() {
    const n: NewsItem = { id: genId(), slug: "", title: "", date: new Date().toISOString().slice(0,10), category: "Research", excerpt: "", content: "", featured: false, author: "" };
    setNews(prev => [...prev, n]);
    setEditNewsId(n.id);
  }
  function updateNewsItem(id: string, patch: Partial<NewsItem>) {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
  }
  function deleteNewsItem(id: string) { setNews(prev => prev.filter(n => n.id !== id)); }

  function addResearchArea() {
    const r: ResearchArea = { id: genId(), title: "", description: "", icon: "Database", color: "#003B71", topics: [], order: research.length + 1 };
    setResearch(prev => [...prev, r]);
    setEditResearchId(r.id);
  }
  function updateResearchArea(id: string, patch: Partial<ResearchArea>) {
    setResearch(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }
  function deleteResearchArea(id: string) { setResearch(prev => prev.filter(r => r.id !== id)); }

  function addProject() {
    const p: Project = { id: genId(), title: "", description: "", status: "active", start_date: "", order: projects.length + 1 };
    setProjects(prev => [...prev, p]);
    setEditProjectId(p.id);
  }
  function updateProject(id: string, patch: Partial<Project>) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  }
  function deleteProject(id: string) { setProjects(prev => prev.filter(p => p.id !== id)); }

  function addConsultingItem() {
    const c: ConsultingItem = { id: genId(), title: "", description: "", category: "Data Analytics", order: consulting.length + 1 };
    setConsulting(prev => [...prev, c]);
    setEditConsultingId(c.id);
  }
  function updateConsultingItem(id: string, patch: Partial<ConsultingItem>) {
    setConsulting(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }
  function deleteConsultingItem(id: string) { setConsulting(prev => prev.filter(c => c.id !== id)); }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "site", label: "Site Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { id: "news", label: "News", icon: <Newspaper className="w-4 h-4" /> },
    { id: "research", label: "Research Areas", icon: <FlaskConical className="w-4 h-4" /> },
    { id: "projects", label: "Projects", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "consulting", label: "Consulting", icon: <Briefcase className="w-4 h-4" /> },
    { id: "publications", label: "Publications", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#001A3D] shrink-0">
        <div className="p-6 border-b border-white/10">
          <span className="text-white font-black text-lg">DTA<span className="text-white/40">Lab</span></span>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? "bg-white/15 text-white" : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors w-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#001A3D] overflow-x-auto">
        <div className="flex px-2 py-2 gap-1 min-w-max">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${tab === t.id ? "bg-white/20 text-white" : "text-white/55"}`}>
              {t.icon}{t.label}
            </button>
          ))}
          <button onClick={logout} className="flex items-center gap-1 px-3 py-2 text-white/50 text-xs">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10 pt-16 lg:pt-10 overflow-auto">
        {/* ---- SITE SETTINGS ---- */}
        {tab === "site" && site && (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Site Settings</h1>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Lab Short Name" value={site.name} onChange={v => setSite(s => s && ({ ...s, name: v }))} />
                <FieldInput label="Founded" value={site.founded} onChange={v => setSite(s => s && ({ ...s, founded: v }))} />
              </div>
              <FieldInput label="Full Name" value={site.full_name} onChange={v => setSite(s => s && ({ ...s, full_name: v }))} />
              <FieldInput label="University" value={site.university} onChange={v => setSite(s => s && ({ ...s, university: v }))} />
              <FieldInput label="Department" value={site.department} onChange={v => setSite(s => s && ({ ...s, department: v }))} />
              <FieldInput label="Address" value={site.address} onChange={v => setSite(s => s && ({ ...s, address: v }))} />
              <div className="grid grid-cols-2 gap-4">
                <FieldInput label="Email" value={site.email} onChange={v => setSite(s => s && ({ ...s, email: v }))} type="email" />
                <FieldInput label="Phone" value={site.phone} onChange={v => setSite(s => s && ({ ...s, phone: v }))} />
              </div>
              <FieldInput label="About (shown on home page)" value={site.about} onChange={v => setSite(s => s && ({ ...s, about: v }))} type="textarea" />
              <FieldInput label="GitHub URL" value={site.github} onChange={v => setSite(s => s && ({ ...s, github: v }))} />
              <FieldInput label="Twitter/X URL" value={site.twitter} onChange={v => setSite(s => s && ({ ...s, twitter: v }))} />
              <FieldInput label="LinkedIn URL" value={site.linkedin} onChange={v => setSite(s => s && ({ ...s, linkedin: v }))} />
              <FieldInput label="Google Scholar URL" value={site.scholar_url ?? ""} onChange={v => setSite(s => s && ({ ...s, scholar_url: v }))} />
              <button onClick={() => saveData("/api/admin/site", site, "Site settings saved!")}
                disabled={saving}
                className="btn-primary mt-2">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </div>
        )}

        {/* ---- TEAM ---- */}
        {tab === "team" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Team</h1>
              <button onClick={addTeamMember} className="btn-primary">
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>
            {team.length === 0 && (
              <p className="text-slate-400 text-sm">No team members yet. Click &quot;Add Member&quot; to get started.</p>
            )}
            <div className="space-y-3">
              {team.map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#003B71] to-[#005BAE] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {m.name?.[0] ?? "?"}{m.surname?.[0] ?? ""}
                      </div>
                      <span className="font-semibold text-slate-800">{m.name || m.surname ? `${m.name} ${m.surname}` : <span className="text-slate-400 italic">New member</span>}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditTeamId(editTeamId === m.id ? null : m.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors">
                        {editTeamId === m.id ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteTeamMember(m.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editTeamId === m.id && (
                    <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-2 gap-4 bg-slate-50">
                      <FieldInput label="Name" value={m.name} onChange={v => updateTeamMember(m.id, { name: v })} />
                      <FieldInput label="Surname" value={m.surname} onChange={v => updateTeamMember(m.id, { surname: v })} />
                      <FieldInput label="Email (optional)" value={m.email ?? ""} onChange={v => updateTeamMember(m.id, { email: v })} type="email" />
                      <FieldInput label="Image URL (optional)" value={m.image ?? ""} onChange={v => updateTeamMember(m.id, { image: v })} />
                      <FieldInput label="Order" value={String(m.order)} onChange={v => updateTeamMember(m.id, { order: Number(v) })} type="number" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {team.length > 0 && (
              <button onClick={() => saveData("/api/admin/team", team, "Team saved!")} disabled={saving} className="btn-primary mt-6">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Team"}
              </button>
            )}
          </div>
        )}

        {/* ---- NEWS ---- */}
        {tab === "news" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">News</h1>
              <button onClick={addNewsItem} className="btn-primary"><Plus className="w-4 h-4" /> Add News</button>
            </div>
            {news.length === 0 && <p className="text-slate-400 text-sm">No news items yet.</p>}
            <div className="space-y-3">
              {news.map(n => (
                <div key={n.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{n.title || <span className="text-slate-400 italic">New article</span>}</p>
                      <p className="text-xs text-slate-400">{n.date} · {n.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditNewsId(editNewsId === n.id ? null : n.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        {editNewsId === n.id ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteNewsItem(n.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editNewsId === n.id && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
                      <FieldInput label="Title" value={n.title} onChange={v => { updateNewsItem(n.id, { title: v, slug: slugify(v) }); }} />
                      <FieldInput label="Slug (auto-generated)" value={n.slug} onChange={v => updateNewsItem(n.id, { slug: v })} />
                      <div className="grid grid-cols-3 gap-3">
                        <FieldInput label="Date" value={n.date} onChange={v => updateNewsItem(n.id, { date: v })} type="date" />
                        <FieldInput label="Category" value={n.category} onChange={v => updateNewsItem(n.id, { category: v })} />
                        <FieldInput label="Author" value={n.author} onChange={v => updateNewsItem(n.id, { author: v })} />
                      </div>
                      <FieldInput label="Excerpt (short summary)" value={n.excerpt} onChange={v => updateNewsItem(n.id, { excerpt: v })} type="textarea" />
                      <FieldInput label="Full Content (HTML supported)" value={n.content} onChange={v => updateNewsItem(n.id, { content: v })} type="textarea" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {news.length > 0 && (
              <button onClick={() => saveData("/api/admin/news", news, "News saved!")} disabled={saving} className="btn-primary mt-6">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save News"}
              </button>
            )}
          </div>
        )}

        {/* ---- RESEARCH ---- */}
        {tab === "research" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Research Areas</h1>
              <button onClick={addResearchArea} className="btn-primary"><Plus className="w-4 h-4" /> Add Area</button>
            </div>
            {research.length === 0 && <p className="text-slate-400 text-sm">No research areas yet.</p>}
            <div className="space-y-3">
              {research.map(r => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <p className="font-semibold text-slate-800">{r.title || <span className="text-slate-400 italic">New area</span>}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setEditResearchId(editResearchId === r.id ? null : r.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        {editResearchId === r.id ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteResearchArea(r.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editResearchId === r.id && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
                      <FieldInput label="Title" value={r.title} onChange={v => updateResearchArea(r.id, { title: v })} />
                      <FieldInput label="Description" value={r.description} onChange={v => updateResearchArea(r.id, { description: v })} type="textarea" />
                      <div className="grid grid-cols-3 gap-3">
                        <FieldInput label="Icon name (Lucide)" value={r.icon} onChange={v => updateResearchArea(r.id, { icon: v })} />
                        <FieldInput label="Color (hex)" value={r.color} onChange={v => updateResearchArea(r.id, { color: v })} />
                        <FieldInput label="Order" value={String(r.order)} onChange={v => updateResearchArea(r.id, { order: Number(v) })} type="number" />
                      </div>
                      <FieldInput label="Topics (comma-separated)" value={r.topics.join(", ")}
                        onChange={v => updateResearchArea(r.id, { topics: v.split(",").map(s => s.trim()).filter(Boolean) })} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {research.length > 0 && (
              <button onClick={() => saveData("/api/admin/research", research, "Research areas saved!")} disabled={saving} className="btn-primary mt-6">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Research Areas"}
              </button>
            )}
          </div>
        )}

        {/* ---- PROJECTS ---- */}
        {tab === "projects" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
              <button onClick={addProject} className="btn-primary"><Plus className="w-4 h-4" /> Add Project</button>
            </div>
            {projects.length === 0 && <p className="text-slate-400 text-sm">No projects yet.</p>}
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{p.title || <span className="text-slate-400 italic">New project</span>}</p>
                      <p className="text-xs text-slate-400 capitalize">{p.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditProjectId(editProjectId === p.id ? null : p.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        {editProjectId === p.id ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteProject(p.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editProjectId === p.id && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
                      <FieldInput label="Title" value={p.title} onChange={v => updateProject(p.id, { title: v })} />
                      <FieldInput label="Description" value={p.description} onChange={v => updateProject(p.id, { description: v })} type="textarea" />
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Status</span>
                          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#003B71]/30"
                            value={p.status} onChange={e => updateProject(p.id, { status: e.target.value as Project["status"] })}>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </label>
                        <FieldInput label="Order" value={String(p.order)} onChange={v => updateProject(p.id, { order: Number(v) })} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <FieldInput label="Start Date" value={p.start_date} onChange={v => updateProject(p.id, { start_date: v })} />
                        <FieldInput label="End Date (optional)" value={p.end_date ?? ""} onChange={v => updateProject(p.id, { end_date: v })} />
                      </div>
                      <FieldInput label="Funding (optional)" value={p.funding ?? ""} onChange={v => updateProject(p.id, { funding: v })} />
                      <FieldInput label="URL (optional)" value={p.url ?? ""} onChange={v => updateProject(p.id, { url: v })} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {projects.length > 0 && (
              <button onClick={() => saveData("/api/admin/projects", projects, "Projects saved!")} disabled={saving} className="btn-primary mt-6">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Projects"}
              </button>
            )}
          </div>
        )}

        {/* ---- CONSULTING ---- */}
        {tab === "consulting" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Consulting</h1>
              <button onClick={addConsultingItem} className="btn-primary"><Plus className="w-4 h-4" /> Add Item</button>
            </div>
            {consulting.length === 0 && <p className="text-slate-400 text-sm">No consulting items yet.</p>}
            <div className="space-y-3">
              {consulting.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{c.title || <span className="text-slate-400 italic">New item</span>}</p>
                      <p className="text-xs text-slate-400">{c.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditConsultingId(editConsultingId === c.id ? null : c.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        {editConsultingId === c.id ? <ChevronUp className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => deleteConsultingItem(c.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {editConsultingId === c.id && (
                    <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50">
                      <FieldInput label="Title" value={c.title} onChange={v => updateConsultingItem(c.id, { title: v })} />
                      <FieldInput label="Description" value={c.description} onChange={v => updateConsultingItem(c.id, { description: v })} type="textarea" />
                      <div className="grid grid-cols-2 gap-3">
                        <FieldInput label="Category" value={c.category} onChange={v => updateConsultingItem(c.id, { category: v })} />
                        <FieldInput label="Client (optional)" value={c.client ?? ""} onChange={v => updateConsultingItem(c.id, { client: v })} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {consulting.length > 0 && (
              <button onClick={() => saveData("/api/admin/consulting", consulting, "Consulting saved!")} disabled={saving} className="btn-primary mt-6">
                <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Consulting"}
              </button>
            )}
          </div>
        )}

        {/* ---- PUBLICATIONS ---- */}
        {tab === "publications" && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Publications</h1>
                <p className="text-sm text-slate-500 mt-1">Auto-fetched from Google Scholar. {publications.length} publication{publications.length !== 1 ? "s" : ""} loaded.</p>
              </div>
              <button onClick={refreshPublications} disabled={refreshingPubs} className="btn-primary">
                <RefreshCw className={`w-4 h-4 ${refreshingPubs ? "animate-spin" : ""}`} />
                {refreshingPubs ? "Refreshing…" : "Refresh from Scholar"}
              </button>
            </div>
            {publications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No publications loaded yet.</p>
                <p className="text-slate-400 text-sm mt-1">Click &quot;Refresh from Scholar&quot; to fetch publications from Google Scholar, or wait for the weekly automated update.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {publications.slice(0, 50).map(p => (
                  <div key={p.id} className="bg-white rounded-xl border border-slate-100 px-5 py-3">
                    <p className="font-medium text-slate-800 text-sm">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.venue} · {p.year} · {p.citations} citations</p>
                  </div>
                ))}
                {publications.length > 50 && (
                  <p className="text-center text-slate-400 text-xs pt-2">Showing 50 of {publications.length}</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && <ToastNotif toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
