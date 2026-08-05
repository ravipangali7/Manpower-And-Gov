import {
  Briefcase,
  Building2,
  Globe,
  Handshake,
  Heart,
  MapPin,
  Search,
  Star,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  listen: Users,
  wrench: Wrench,
  plan: Wrench,
  globe: Globe,
  recruit: Globe,
  star: Star,
  deliver: Star,
  briefcase: Briefcase,
  "map-pin": MapPin,
  mappin: MapPin,
  building: Building2,
  handshake: Handshake,
  heart: Heart,
  search: Search,
};

const FALLBACK_CYCLE: LucideIcon[] = [Users, Wrench, Globe, Star];

/** Resolve a CMS icon key to a Lucide component; falls back by index when unknown. */
export function resolveCmsIcon(key?: string | null, fallbackIndex = 0): LucideIcon {
  if (key) {
    const normalized = key.trim().toLowerCase().replace(/[\s_]+/g, "-");
    const found = ICON_MAP[normalized] || ICON_MAP[normalized.replace(/-/g, "")];
    if (found) return found;
  }
  return FALLBACK_CYCLE[fallbackIndex % FALLBACK_CYCLE.length];
}
