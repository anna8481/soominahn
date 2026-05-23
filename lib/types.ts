export type Artwork = {
  id: string;
  year: number;
  title: string;
  statement: string | null;
  medium: string | null;
  dimensions: string | null;
  image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type CVSection =
  | "contact"
  | "education"
  | "solo"
  | "group"
  | "interview";

export const CV_SECTIONS: { key: CVSection; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "education", label: "Education" },
  { key: "solo", label: "Solo Exhibition" },
  { key: "group", label: "Group Exhibition" },
  { key: "interview", label: "Article / Interview" },
];

export type CVEntry = {
  id: string;
  section: CVSection;
  year: number | null;
  year_end: number | null;
  title: string;
  link: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export function formatYearRange(
  year: number | null,
  yearEnd: number | null
): string {
  if (year == null && yearEnd == null) return "";
  if (year != null && yearEnd != null && year !== yearEnd) {
    return `${year}–${yearEnd}`;
  }
  return String(year ?? yearEnd);
}
