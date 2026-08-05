import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  SEED_AGENCIES,
  SEED_ALBUMS,
  SEED_CONTACT_SECTIONS,
  SEED_CONTENTS,
  SEED_JOBS,
  SEED_OFFICIALS,
  SEED_PAGES,
  SEED_SERVICES,
  SEED_SETTINGS,
  SEED_TEAM,
  type Agency,
  type Album,
  type ContactSection,
  type Content,
  type Job,
  type Official,
  type Service,
  type Settings,
  type StaticPage,
  type TeamMember,
} from "@/data/cms-seed";

export type CmsData = {
  contents: Content[];
  agencies: Agency[];
  services: Service[];
  officials: Official[];
  team: TeamMember[];
  pages: StaticPage[];
  albums: Album[];
  contactSections: ContactSection[];
  jobs: Job[];
  settings: Settings;
};

export type CollectionKey = Exclude<keyof CmsData, "settings">;

const SEED: CmsData = {
  contents: SEED_CONTENTS,
  agencies: SEED_AGENCIES,
  services: SEED_SERVICES,
  officials: SEED_OFFICIALS,
  team: SEED_TEAM,
  pages: SEED_PAGES,
  albums: SEED_ALBUMS,
  contactSections: SEED_CONTACT_SECTIONS,
  jobs: SEED_JOBS,
  settings: SEED_SETTINGS,
};

const DATA_KEY = "dofe-cms-data-v4";
const AUTH_KEY = "dofe-cms-auth-v1";

type Ctx = {
  data: CmsData;
  ready: boolean;
  isAuthed: boolean;
  login: (user: string, password: string) => boolean;
  logout: () => void;
  create: <K extends CollectionKey>(key: K, item: Omit<CmsData[K][number], "id">) => void;
  update: <K extends CollectionKey>(key: K, id: string, patch: Partial<CmsData[K][number]>) => void;
  remove: (key: CollectionKey, id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => void;
};

const CmsContext = createContext<Ctx | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData>(SEED);
  const [isAuthed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DATA_KEY);
      if (raw) setData({ ...SEED, ...(JSON.parse(raw) as CmsData) });
      setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: CmsData) => {
    setData(next);
    try {
      window.localStorage.setItem(DATA_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      data,
      ready,
      isAuthed,
      login: (user, password) => {
        const ok =
          user.trim() === data.settings.adminUser && password === data.settings.adminPassword;
        if (ok) {
          setAuthed(true);
          try {
            window.localStorage.setItem(AUTH_KEY, "1");
          } catch {
            /* ignore */
          }
        }
        return ok;
      },
      logout: () => {
        setAuthed(false);
        try {
          window.localStorage.removeItem(AUTH_KEY);
        } catch {
          /* ignore */
        }
      },
      create: (key, item) => {
        const list = data[key] as { id: string }[];
        const next = {
          ...data,
          [key]: [{ ...(item as object), id: `${key}-${Date.now()}` }, ...list],
        } as CmsData;
        persist(next);
      },
      update: (key, id, patch) => {
        const list = data[key] as { id: string }[];
        const next = {
          ...data,
          [key]: list.map((row) => (row.id === id ? { ...row, ...(patch as object) } : row)),
        } as CmsData;
        persist(next);
      },
      remove: (key, id) => {
        const list = data[key] as { id: string }[];
        const next = { ...data, [key]: list.filter((row) => row.id !== id) } as CmsData;
        persist(next);
      },
      updateSettings: (patch) => persist({ ...data, settings: { ...data.settings, ...patch } }),
      resetAll: () => persist(SEED),
    }),
    [data, isAuthed, persist, ready],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used inside CmsProvider");
  return ctx;
}
