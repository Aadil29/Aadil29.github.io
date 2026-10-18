import { siteConfig } from "../config";

export interface NavItem {
  id: string;
  label: string;
}

/** Nav entries in page order; a section only appears when its data exists. */
export function navItems(): NavItem[] {
  const c = siteConfig;
  const s = c.social;
  const items: (NavItem | false)[] = [
    !!c.projects?.length && { id: "projects", label: "Work" },
    !!(c.aboutMe || c.skills?.length) && { id: "about", label: "About" },
    !!c.experience?.length && { id: "experience", label: "Experience" },
    !!c.education?.length && { id: "education", label: "Education" },
    !!(c.contact?.formEndpoint || s.linkedin || s.github || s.twitter) && { id: "contact", label: "Contact" },
  ];
  return items.filter(Boolean) as NavItem[];
}
