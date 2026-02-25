const BASE_URL = "https://miniheadquarters.com";

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent": "MHQ-Scraper/0.1 (tournament-data-collector)",
  Accept: "text/html",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ScraperClient {
  fetchPage(path: string): Promise<string>;
}

export function createClient(delayMs = 500): ScraperClient {
  let lastRequestTime = 0;

  async function fetchPage(path: string): Promise<string> {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < delayMs) {
      await delay(delayMs - elapsed);
    }

    const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
    console.log(`[scraper] GET ${url}`);

    const response = await fetch(url, { headers: DEFAULT_HEADERS });
    lastRequestTime = Date.now();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    return response.text();
  }

  return { fetchPage };
}
