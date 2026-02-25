import { parse } from "node-html-parser";
import type { TournamentSummary } from "../../types.js";

const MONTH_MAP: Record<string, string> = {
  Jan: "01",
  "Jan.": "01",
  January: "01",
  Feb: "02",
  "Feb.": "02",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  Aug: "08",
  "Aug.": "08",
  August: "08",
  Sept: "09",
  "Sept.": "09",
  September: "09",
  Oct: "10",
  "Oct.": "10",
  October: "10",
  Nov: "11",
  "Nov.": "11",
  November: "11",
  Dec: "12",
  "Dec.": "12",
  December: "12",
};

export function parseDateToISO(raw: string): string {
  const trimmed = raw.trim();
  // Format: "Feb. 28, 2026" or "March 1, 2026"
  const match = trimmed.match(/^(\w+\.?)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return "";
  const [, monthStr, day, year] = match;
  const month = MONTH_MAP[monthStr];
  if (!month) return "";
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

function extractSlug(href: string): string {
  // /tournaments/individual/details/some-slug-2026-02-28 -> some-slug-2026-02-28
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export interface ListingPage {
  tournaments: TournamentSummary[];
  totalPages: number;
}

export function parseTournamentList(html: string): ListingPage {
  const root = parse(html);
  const rows = root.querySelectorAll("tr.tournament-list-row");
  const tournaments: TournamentSummary[] = [];

  for (const row of rows) {
    const cells = row.querySelectorAll("td");
    if (cells.length < 4) continue;

    const link = cells[0].querySelector("a");
    if (!link) continue;

    const href = link.getAttribute("href") ?? "";
    const name = link.textContent.trim();
    const slug = extractSlug(href);
    const registrations = cells[1].textContent.trim();
    const interested = parseInt(cells[2].textContent.trim(), 10) || 0;
    const dateRaw = cells[3].textContent.trim();
    const dateISO = parseDateToISO(dateRaw);

    tournaments.push({
      name,
      slug,
      registrations,
      interested,
      date: dateRaw,
      dateISO,
      url: href,
    });
  }

  let totalPages = 1;
  const lastPageLink = root.querySelector(
    "ul.pagination li.page-item:last-child a",
  );
  if (lastPageLink) {
    const href = lastPageLink.getAttribute("href") ?? "";
    const pageMatch = href.match(/page=(\d+)/);
    if (pageMatch) {
      totalPages = parseInt(pageMatch[1], 10);
    }
  }

  return { tournaments, totalPages };
}
