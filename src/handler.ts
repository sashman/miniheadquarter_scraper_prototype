import { scrape } from "./scraper/index.js";
import type { ScrapeOptions, TournamentData } from "./types.js";

export interface Event {
  dateFrom?: string;
  dateTo?: string;
  gameSystem?: number;
  country?: string;
  delayMs?: number;
  [key: string]: unknown;
}

export interface Response {
  statusCode: number;
  body: string;
}

export async function handler(event: Event): Promise<Response> {
  const dateFrom = event.dateFrom;
  const dateTo = event.dateTo;

  if (!dateFrom || !dateTo) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "dateFrom and dateTo are required (YYYY-MM-DD)",
      }),
    };
  }

  const options: ScrapeOptions = {
    dateFrom,
    dateTo,
    gameSystem: event.gameSystem,
    country: event.country,
    delayMs: event.delayMs,
  };

  try {
    const data: TournamentData[] = await scrape(options);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[handler] Scrape failed:", message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    };
  }
}
