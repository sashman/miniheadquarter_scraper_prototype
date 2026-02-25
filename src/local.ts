import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { handler } from "./handler.js";

const dateFrom = process.argv[2] ?? "2026-02-22";
const dateTo = process.argv[3] ?? "2026-02-28";

console.log(`Scraping tournaments from ${dateFrom} to ${dateTo}\n`);

const response = await handler({ dateFrom, dateTo });

if (response.statusCode === 200) {
  const data = JSON.parse(response.body) as unknown[];
  console.log(`\nScrape complete: ${data.length} tournaments`);

  mkdirSync("output", { recursive: true });
  const filename = `tournaments_${dateFrom}_${dateTo}.json`;
  const filepath = join("output", filename);
  writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`Saved to ${filepath}`);
} else {
  console.error("Error:", response.body);
  process.exit(1);
}
