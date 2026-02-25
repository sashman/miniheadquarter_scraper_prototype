export interface TournamentSummary {
  name: string;
  slug: string;
  registrations: string;
  interested: number;
  date: string;
  dateISO: string;
  url: string;
}

export interface TournamentDetail {
  name: string;
  slug: string;
  maxSpots: number;
  interested: number;
  date: string;
  gameSystem: string;
  rules: string;
  roundCount: number;
  roundFormat: string;
  organizers: string[];
  tags: string[];
  description: string;
  resultsUrl: string | null;
  armyListsUrl: string | null;
}

export interface PlayerResult {
  name: string;
  outcome: "Win" | "Loss" | "Draw";
  score: number;
  totalScore: number;
  faction: string;
}

export interface Pairing {
  table: number;
  player1: PlayerResult;
  player2: PlayerResult;
}

export interface ArmyList {
  playerName: string;
  faction: string;
  listText: string;
}

export interface TournamentData {
  summary: TournamentSummary;
  detail: TournamentDetail;
  rounds: Pairing[][];
  armyLists: ArmyList[];
}

export interface ScrapeOptions {
  dateFrom: string;
  dateTo: string;
  gameSystem?: number;
  country?: string;
  delayMs?: number;
}
