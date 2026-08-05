import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi, type NavigationData, type SiteSettings } from "@/lib/public-api";

type CompanyInfo = {
  name: string;
  short: string;
  address: string;
  phones: string[];
  email: string;
  poBox: string;
};

type SiteContextValue = {
  settings: SiteSettings | null;
  navigation: NavigationData | null;
  company: CompanyInfo;
  notice: string;
  isLoading: boolean;
  isError: boolean;
  /** True once site-settings (or navigation) successfully loaded from the API. */
  isReady: boolean;
};

const emptyCompany: CompanyInfo = {
  name: "",
  short: "",
  address: "",
  phones: [],
  email: "",
  poBox: "",
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const settingsQuery = useQuery({
    queryKey: ["public", "site-settings"],
    queryFn: () => publicApi.siteSettings(),
  });
  const navQuery = useQuery({
    queryKey: ["public", "navigation"],
    queryFn: () => publicApi.navigation(),
  });

  const value = useMemo<SiteContextValue>(() => {
    const settings = settingsQuery.data ?? null;
    const navigation = navQuery.data ?? null;
    const phones = settings?.contact_numbers?.map((c) => c.number).filter(Boolean) ?? [];

    return {
      settings,
      navigation,
      company: settings
        ? {
            name: settings.company_name || "",
            short: settings.short_name || "",
            address: settings.address || "",
            phones,
            email: settings.primary_email || "",
            poBox: settings.po_box || "",
          }
        : emptyCompany,
      notice: settings?.notice_text || "",
      isLoading: settingsQuery.isLoading || navQuery.isLoading,
      isError: settingsQuery.isError || navQuery.isError,
      isReady: settingsQuery.isSuccess || navQuery.isSuccess,
    };
  }, [
    settingsQuery.data,
    navQuery.data,
    settingsQuery.isLoading,
    navQuery.isLoading,
    settingsQuery.isError,
    navQuery.isError,
    settingsQuery.isSuccess,
    navQuery.isSuccess,
  ]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    return {
      settings: null,
      navigation: null,
      company: emptyCompany,
      notice: "",
      isLoading: false,
      isError: false,
      isReady: false,
    };
  }
  return ctx;
}
