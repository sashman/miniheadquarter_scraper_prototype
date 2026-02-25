import { parse, type HTMLElement } from "node-html-parser";
import type { Pairing, PlayerResult } from "../../types.js";

function parseOutcome(text: string): {
  outcome: PlayerResult["outcome"];
  score: number;
  totalScore: number;
} {
  // "Win: 15 (70)" / "Loss: 5 (40)" / "Draw: 10 (57)"
  const match = text.match(/(Win|Loss|Draw):\s*(\d+)\s*\((\d+)\)/);
  if (!match) {
    return { outcome: "Draw", score: 0, totalScore: 0 };
  }
  return {
    outcome: match[1] as PlayerResult["outcome"],
    score: parseInt(match[2], 10),
    totalScore: parseInt(match[3], 10),
  };
}

function parsePlayer(col: HTMLElement): PlayerResult {
  const name = col.querySelector(".display-6")?.textContent.trim() ?? "";

  const outcomePara =
    col.querySelector("p.text-success") ??
    col.querySelector("p.text-danger") ??
    col.querySelector("p.text-primary");
  const outcomeText = outcomePara?.textContent.trim() ?? "";
  const { outcome, score, totalScore } = parseOutcome(outcomeText);

  const factionPara = col.querySelector("p.text-wrap");
  const faction = factionPara?.textContent.trim() ?? "";

  return { name, outcome, score, totalScore, faction };
}

export function parseRoundPairings(html: string): Pairing[] {
  const root = parse(html);
  const pairings: Pairing[] = [];

  // Each pairing is a .row containing col-1 (table number), col-5, col-5
  const rows = root.querySelectorAll(".container .row");

  for (const row of rows) {
    const tableCol = row.querySelector(".col-1 .display-6");
    if (!tableCol) continue;

    const tableNum = parseInt(tableCol.textContent.trim(), 10);
    if (isNaN(tableNum)) continue;

    const playerCols = row.querySelectorAll(".col-5");
    if (playerCols.length < 2) continue;

    pairings.push({
      table: tableNum,
      player1: parsePlayer(playerCols[0]),
      player2: parsePlayer(playerCols[1]),
    });
  }

  return pairings;
}

export function parseRoundNavLinks(html: string): string[] {
  const root = parse(html);
  return root
    .querySelectorAll("ul.nav-pills a.nav-link")
    .map((el) => el.getAttribute("href") ?? "")
    .filter((href) => href.includes("/round/"));
}
