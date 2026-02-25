import { describe, expect, it } from "vitest";
import { parseRoundPairings, parseRoundNavLinks } from "./round.js";

const ROUND_HTML = `
<html>
<body>
  <div class="container">
    <ul class="nav nav-pills justify-content-center">
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test/round/1">Round 1</a></li>
      <li class="nav-item"><a class="nav-link active" href="/tournaments/individual/results/test/round/2">Round 2</a></li>
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test/round/3">Round 3</a></li>
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test">Results</a></li>
    </ul>
  </div>

  <div class="container mt-4">
    <div class="row">
      <div class="col-1"><h4>Table</h4></div>
    </div>

    <div class="row">
      <div class="col-1">
        <span class="display-6">1</span>
      </div>
      <div class="col-5 text-truncate">
        <span class="display-6">PlayerA</span>
        <hr>
        <p class="text-danger">Loss: 5 (40)</p>
        <p class="text-wrap">Imperium - Imperial Knights</p>
      </div>
      <div class="col-5 text-truncate">
        <span class="display-6">PlayerB</span>
        <hr>
        <p class="text-success">Win: 15 (70)</p>
        <p class="text-wrap">Imperium - Astra Militarum</p>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-1">
        <span class="display-6">2</span>
      </div>
      <div class="col-5 text-truncate">
        <span class="display-6">PlayerC</span>
        <hr>
        <p class="text-primary">Draw: 10 (57)</p>
        <p class="text-wrap">Chaos - Emperor's Children</p>
      </div>
      <div class="col-5 text-truncate">
        <span class="display-6">PlayerD</span>
        <hr>
        <p class="text-primary">Draw: 10 (58)</p>
        <p class="text-wrap">Chaos - Chaos Space Marines</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

describe("parseRoundPairings", () => {
  it("extracts pairings from round page", () => {
    const pairings = parseRoundPairings(ROUND_HTML);

    expect(pairings).toHaveLength(2);

    expect(pairings[0]).toEqual({
      table: 1,
      player1: {
        name: "PlayerA",
        outcome: "Loss",
        score: 5,
        totalScore: 40,
        faction: "Imperium - Imperial Knights",
      },
      player2: {
        name: "PlayerB",
        outcome: "Win",
        score: 15,
        totalScore: 70,
        faction: "Imperium - Astra Militarum",
      },
    });

    expect(pairings[1]).toEqual({
      table: 2,
      player1: {
        name: "PlayerC",
        outcome: "Draw",
        score: 10,
        totalScore: 57,
        faction: "Chaos - Emperor's Children",
      },
      player2: {
        name: "PlayerD",
        outcome: "Draw",
        score: 10,
        totalScore: 58,
        faction: "Chaos - Chaos Space Marines",
      },
    });
  });
});

describe("parseRoundNavLinks", () => {
  it("extracts round links from nav pills", () => {
    const links = parseRoundNavLinks(ROUND_HTML);

    expect(links).toEqual([
      "/tournaments/individual/results/test/round/1",
      "/tournaments/individual/results/test/round/2",
      "/tournaments/individual/results/test/round/3",
    ]);
  });
});
