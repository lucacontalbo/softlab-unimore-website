import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "src", "data");

function readJson<T>(filename: string): T {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJson(filename: string, data: unknown): void {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

export interface SiteConfig {
  name: string;
  full_name: string;
  university: string;
  department: string;
  address: string;
  email: string;
  phone: string;
  about: string;
  founded: string;
  twitter: string;
  github: string;
  linkedin: string;
  scholar_url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  surname: string;
  role?: string;
  email?: string;
  image?: string;
  order: number;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citations: number;
  abstract: string;
  doi: string | null;
  url: string | null;
  tags: string[];
  featured: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  featured: boolean;
  author: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  start_date: string;
  end_date?: string;
  funding?: string;
  url?: string;
  image?: string;
  order: number;
}

export interface ConsultingItem {
  id: string;
  title: string;
  description: string;
  client?: string;
  category: string;
  order: number;
}

export const getSiteConfig = () => readJson<SiteConfig>("site.json");
export const getTeam = () => readJson<TeamMember[]>("team.json");
export const getPublications = () => readJson<Publication[]>("publications.json");
export const getNews = () => readJson<NewsItem[]>("news.json");
export const getResearchAreas = () => readJson<ResearchArea[]>("research.json");
export const getProjects = () => readJson<Project[]>("projects.json");
export const getConsulting = () => readJson<ConsultingItem[]>("consulting.json");

export const saveSiteConfig = (data: SiteConfig) => writeJson("site.json", data);
export const saveTeam = (data: TeamMember[]) => writeJson("team.json", data);
export const savePublications = (data: Publication[]) => writeJson("publications.json", data);
export const saveNews = (data: NewsItem[]) => writeJson("news.json", data);
export const saveResearchAreas = (data: ResearchArea[]) => writeJson("research.json", data);
export const saveProjects = (data: Project[]) => writeJson("projects.json", data);
export const saveConsulting = (data: ConsultingItem[]) => writeJson("consulting.json", data);
