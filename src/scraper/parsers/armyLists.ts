import { parse } from "node-html-parser";
import type { ArmyList } from "../../types.js";

export function parseArmyLists(html: string): ArmyList[] {
  const root = parse(html);
  const items = root.querySelectorAll(".accordion-item");
  const lists: ArmyList[] = [];

  for (const item of items) {
    const button = item.querySelector(".accordion-button");
    const headerText = button?.textContent.trim() ?? "";

    // Header format: "PlayerName - Faction" or "PlayerName - Faction - SubFaction"
    const separatorIndex = headerText.indexOf(" - ");
    let playerName = headerText;
    let faction = "";
    if (separatorIndex !== -1) {
      playerName = headerText.slice(0, separatorIndex).trim();
      faction = headerText.slice(separatorIndex + 3).trim();
    }

    const body = item.querySelector(".accordion-body");
    const listText = body?.textContent.trim() ?? "";

    lists.push({ playerName, faction, listText });
  }

  return lists;
}
