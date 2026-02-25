import { parse } from "node-html-parser";
import type { TournamentDetail } from "../../types.js";

export function parseTournamentDetail(
  html: string,
  slug: string,
): TournamentDetail {
  const root = parse(html);

  const name = root.querySelector("h1")?.textContent.trim() ?? "";

  const displays = root.querySelectorAll("h3.display-1");
  const maxSpots = parseInt(displays[0]?.textContent.trim() ?? "0", 10) || 0;
  const interested =
    parseInt(displays[1]?.textContent.trim() ?? "0", 10) || 0;

  const organizers = root
    .querySelectorAll(
      ".badge.rounded-pill.text-bg-primary a.text-white",
    )
    .map((el) => el.textContent.trim());

  const tags = root
    .querySelectorAll(
      ".badge.rounded-pill.text-bg-primary.text-white",
    )
    .filter((el) => !el.querySelector("a"))
    .map((el) => el.textContent.trim());

  // Icon row: elo, game system, date, rules, rounds
  const iconCols = root.querySelectorAll(
    ".row.text-center.text-primary .col-md-2 p",
  );
  const gameSystem = iconCols[1]?.textContent.trim() ?? "";
  const date = iconCols[2]?.textContent.trim() ?? "";
  const rules = iconCols[3]?.textContent.trim() ?? "";
  const roundsText = iconCols[4]?.textContent.trim() ?? "";

  let roundCount = 0;
  let roundFormat = "";
  const roundsMatch = roundsText.match(/(\d+)\s+rounds?\s*\(([^)]+)\)/i);
  if (roundsMatch) {
    roundCount = parseInt(roundsMatch[1], 10);
    roundFormat = roundsMatch[2];
  }

  // Description
  const detailsHeading = root
    .querySelectorAll("h3")
    .find((h) => h.textContent.trim() === "Details");
  const description =
    detailsHeading?.parentNode?.querySelector("p")?.textContent.trim() ?? "";

  // Links to results and army lists
  const resultsLink = root.querySelector('a[href*="/results/"]');
  const armyListsLink = root.querySelector('a[href*="/army-lists/"]');

  const resultsUrl = resultsLink?.getAttribute("href") ?? null;
  const armyListsUrl = armyListsLink?.getAttribute("href") ?? null;

  return {
    name,
    slug,
    maxSpots,
    interested,
    date,
    gameSystem,
    rules,
    roundCount,
    roundFormat,
    organizers,
    tags,
    description,
    resultsUrl,
    armyListsUrl,
  };
}

export function parseRoundLinks(html: string): string[] {
  const root = parse(html);
  return root
    .querySelectorAll("ul.nav-pills a.nav-link")
    .map((el) => el.getAttribute("href") ?? "")
    .filter((href) => href.includes("/round/"));
}
