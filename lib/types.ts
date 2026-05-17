export type Artwork = {
  id: string;
  year: number;
  title: string;
  statement: string | null;
  medium: string | null;
  dimensions: string | null;
  image_url: string | null;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type CVSection =
  | "education"
  | "solo"
  | "group"
  | "award"
  | "collection"
  | "info";

export const CV_SECTIONS: { key: CVSection; label: string }[] = [
  { key: "education", label: "Education" },
  { key: "solo", label: "Solo Exhibitions" },
  { key: "group", label: "Group Exhibitions" },
  { key: "award", label: "Awards & Grants" },
  { key: "collection", label: "Collections" },
  { key: "info", label: "Info" },
];

export type CVEntry = {
  id: string;
  section: CVSection;
  year: number | null;
  year_end: number | null;
  title: string;
  location: string | null;
  detail: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};
