import type {
  ScrapeOptions,
  TournamentData,
  TournamentSummary,
  Pairing,
  ArmyList,
} from "../types.js";
import { createClient, type ScraperClient } from "./client.js";
import { parseTournamentList } from "./parsers/listing.js";
import { parseTournamentDetail, parseRoundLinks } from "./parsers/detail.js";
import { parseRoundPairings, parseRoundNavLinks } from "./parsers/round.js";
import { parseArmyLists } from "./parsers/armyLists.js";

const DEFAULT_GAME_SYSTEM = 1; // Warhammer 40000
const DEFAULT_COUNTRY = "FR";
const PAGE_SIZE = 50;

function buildListingUrl(
  page: number,
  gameSystem: number,
  country: string,
): string {
  const params = new URLSearchParams({
    game_system: String(gameSystem),
    status: "",
    country,
    tag: "",
    exclude_tag: "",
    submit: "Filter",
    page: String(page),
    page_size: String(PAGE_SIZE),
  });
  return `/tournaments/individual/?${params.toString()}`;
}

function isInDateRange(
  dateISO: string,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (!dateISO) return false;
  return dateISO >= dateFrom && dateISO <= dateTo;
}

async function fetchAllTournaments(
  client: ScraperClient,
  gameSystem: number,
  country: string,
  dateFrom: string,
  dateTo: string,
): Promise<TournamentSummary[]> {
  const all: TournamentSummary[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = buildListingUrl(page, gameSystem, country);
    const html = await client.fetchPage(url);
    const result = parseTournamentList(html);

    if (page === 1) {
      totalPages = result.totalPages;
      console.log(`[scraper] ${totalPages} pages of tournaments found`);
    }

    for (const t of result.tournaments) {
      if (isInDateRange(t.dateISO, dateFrom, dateTo)) {
        all.push(t);
      }
    }

    // Early exit: if all tournaments on this page are past our date range,
    // no need to continue (listing is ordered by date ascending)
    const allPastRange = result.tournaments.every(
      (t) => t.dateISO > dateTo,
    );
    if (allPastRange && result.tournaments.length > 0) {
      console.log(
        `[scraper] All tournaments on page ${page} are past ${dateTo}, stopping`,
      );
      break;
    }

    page++;
  }

  return all;
}

async function fetchRounds(
  client: ScraperClient,
  resultsUrl: string,
): Promise<Pairing[][]> {
  const resultsHtml = await client.fetchPage(resultsUrl);
  const roundLinks = parseRoundLinks(resultsHtml);

  if (roundLinks.length === 0) {
    // Try from the results page itself (it also has nav pills)
    const altLinks = parseRoundNavLinks(resultsHtml);
    if (altLinks.length === 0) return [];
    roundLinks.push(...altLinks);
  }

  const rounds: Pairing[][] = [];
  for (const link of roundLinks) {
    const roundHtml = await client.fetchPage(link);
    const pairings = parseRoundPairings(roundHtml);
    rounds.push(pairings);
  }

  return rounds;
}

async function fetchArmyLists(
  client: ScraperClient,
  armyListsUrl: string,
): Promise<ArmyList[]> {
  const html = await client.fetchPage(armyListsUrl);
  return parseArmyLists(html);
}

export async function scrape(
  options: ScrapeOptions,
): Promise<TournamentData[]> {
  const {
    dateFrom,
    dateTo,
    gameSystem = DEFAULT_GAME_SYSTEM,
    country = DEFAULT_COUNTRY,
    delayMs = 500,
  } = options;

  const client = createClient(delayMs);

  console.log(
    `[scraper] Scraping tournaments from ${dateFrom} to ${dateTo} (game=${gameSystem}, country=${country})`,
  );

  const summaries = await fetchAllTournaments(
    client,
    gameSystem,
    country,
    dateFrom,
    dateTo,
  );

  console.log(
    `[scraper] Found ${summaries.length} tournaments in date range`,
  );

  const results: TournamentData[] = [];

  for (const summary of summaries) {
    console.log(`[scraper] Processing: ${summary.name}`);

    const detailHtml = await client.fetchPage(summary.url);
    const detail = parseTournamentDetail(detailHtml, summary.slug);

    let rounds: Pairing[][] = [];
    if (detail.resultsUrl) {
      try {
        rounds = await fetchRounds(client, detail.resultsUrl);
        console.log(
          `[scraper]   -> ${rounds.length} rounds with pairings`,
        );
      } catch (err) {
        console.warn(
          `[scraper]   -> Failed to fetch rounds: ${err instanceof Error ? err.message : err}`,
        );
      }
    }

    let armyLists: ArmyList[] = [];
    if (detail.armyListsUrl) {
      try {
        armyLists = await fetchArmyLists(client, detail.armyListsUrl);
        console.log(
          `[scraper]   -> ${armyLists.length} army lists`,
        );
      } catch (err) {
        console.warn(
          `[scraper]   -> Failed to fetch army lists: ${err instanceof Error ? err.message : err}`,
        );
      }
    }

    results.push({ summary, detail, rounds, armyLists });
  }

  console.log(`[scraper] Done. ${results.length} tournaments scraped.`);
  return results;
}
