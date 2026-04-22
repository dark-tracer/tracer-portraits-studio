import portfolioData from "@/data/portfolioData.json";

// Eagerly import every portfolio asset so we can map JSON paths → bundled URLs.
const assetModules = import.meta.glob("@/assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function resolveAsset(path: string): string {
  // Normalize "/src/assets/foo.jpg" to match glob keys like "/src/assets/foo.jpg".
  const match = Object.entries(assetModules).find(([key]) => key.endsWith(path.replace(/^\/?/, "/")));
  if (match) return match[1];
  // Fallback: return raw path (useful if user later points to /public).
  return path;
}

export type Category = "portrait" | "wedding" | "event";

export type PortfolioEvent = {
  id: string;
  name: string;
  category: Category;
  date: string;
  coverImage: string;
  description: string;
  photos: string[];
};

const raw = portfolioData.events as PortfolioEvent[];

export const events: PortfolioEvent[] = raw
  .map((e) => ({
    ...e,
    coverImage: resolveAsset(e.coverImage),
    photos: e.photos.map(resolveAsset),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const categoryLabel: Record<Category, string> = {
  portrait: "Portrait",
  wedding: "Wedding",
  event: "Event",
};

// Flatten photos across all events, sorted by event date (most recent first),
// preserving event metadata so the lightbox / recent row can label them.
export type RecentPhoto = {
  src: string;
  eventId: string;
  eventName: string;
  category: Category;
  date: string;
};

export const recentPhotos: RecentPhoto[] = events.flatMap((e) =>
  e.photos.map((src) => ({
    src,
    eventId: e.id,
    eventName: e.name,
    category: e.category,
    date: e.date,
  })),
);

export function getEventById(id: string): PortfolioEvent | undefined {
  return events.find((e) => e.id === id);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
