import { describe, expect, it } from "vitest";
import { parseTournamentDetail, parseRoundLinks } from "./detail.js";

const DETAIL_HTML = `
<html>
<body>
  <div class="container">
    <div class="row">
      <div class="col-md text-center">
        <h1>Test Tournament GT</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 text-center">
        <div class="row">
          <div class="col-md-6"><h3 class="display-1">40</h3><p>Max spots</p></div>
          <div class="col-md-6"><h3 class="display-1">53</h3><p>Interested</p></div>
        </div>
      </div>
      <div class="col-md-4 text-center">
        <h3>Organizers</h3>
        <p>
          <span class="badge rounded-pill text-bg-primary"><a href="#" class="text-white">Organizer1</a></span>
          <span class="badge rounded-pill text-bg-primary"><a href="#" class="text-white">Organizer2</a></span>
        </p>
        <h3>Tags</h3>
        <p>
          <span class="badge rounded-pill text-bg-primary text-white">GT FEQ</span>
        </p>
      </div>
    </div>
    <div class="row text-center text-primary mt-3">
      <div class="col-md-2 offset-md-1"><h3><em class="fas fa-medal"></em></h3><p>Elo rankings enabled</p></div>
      <div class="col-md-2"><h3><em class="fas fa-dice"></em></h3><p>Warhammer 40000</p></div>
      <div class="col-md-2"><h3><em class="fas fa-calendar-alt"></em></h3><p>Feb. 28, 2026</p></div>
      <div class="col-md-2"><h3><em class="fas fa-balance-scale"></em></h3><p>Rules: WTC</p></div>
      <div class="col-md-2"><h3><em class="fas fa-sync"></em></h3><p>5 rounds (Swiss round)</p></div>
    </div>
    <div class="row">
      <div class="col-md-4 mt-2">
        <div class="card h-100 border-primary">
          <div class="card-body">
            <h5 class="card-title">Army lists</h5>
            <a class="btn btn-primary stretched-link" href="/tournaments/individual/army-lists/test-tournament-gt-2026-02-28">See lists</a>
          </div>
        </div>
      </div>
      <div class="col-md-4 mt-2">
        <div class="card h-100 border-primary">
          <div class="card-body">
            <h5 class="card-title">Results</h5>
            <a class="btn btn-primary stretched-link" href="/tournaments/individual/results/test-tournament-gt-2026-02-28">Results</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md">
        <h3 class="text-center">Details</h3>
        <p>This is the tournament description with lots of info.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

describe("parseTournamentDetail", () => {
  it("extracts core tournament info", () => {
    const detail = parseTournamentDetail(DETAIL_HTML, "test-tournament-gt-2026-02-28");

    expect(detail.name).toBe("Test Tournament GT");
    expect(detail.slug).toBe("test-tournament-gt-2026-02-28");
    expect(detail.maxSpots).toBe(40);
    expect(detail.interested).toBe(53);
    expect(detail.gameSystem).toBe("Warhammer 40000");
    expect(detail.date).toBe("Feb. 28, 2026");
    expect(detail.rules).toBe("Rules: WTC");
    expect(detail.roundCount).toBe(5);
    expect(detail.roundFormat).toBe("Swiss round");
  });

  it("extracts organizers and tags", () => {
    const detail = parseTournamentDetail(DETAIL_HTML, "test-tournament-gt-2026-02-28");

    expect(detail.organizers).toEqual(["Organizer1", "Organizer2"]);
    expect(detail.tags).toEqual(["GT FEQ"]);
  });

  it("extracts results and army list URLs", () => {
    const detail = parseTournamentDetail(DETAIL_HTML, "test-tournament-gt-2026-02-28");

    expect(detail.resultsUrl).toBe("/tournaments/individual/results/test-tournament-gt-2026-02-28");
    expect(detail.armyListsUrl).toBe("/tournaments/individual/army-lists/test-tournament-gt-2026-02-28");
  });
});

const RESULTS_NAV_HTML = `
<html>
<body>
  <div class="container">
    <ul class="nav nav-pills justify-content-center">
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test/round/1">Round 1</a></li>
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test/round/2">Round 2</a></li>
      <li class="nav-item"><a class="nav-link" href="/tournaments/individual/results/test/round/3">Round 3</a></li>
      <li class="nav-item"><a class="nav-link active" href="/tournaments/individual/results/test">Results</a></li>
    </ul>
  </div>
</body>
</html>
`;

describe("parseRoundLinks", () => {
  it("extracts round URLs from nav pills", () => {
    const links = parseRoundLinks(RESULTS_NAV_HTML);

    expect(links).toEqual([
      "/tournaments/individual/results/test/round/1",
      "/tournaments/individual/results/test/round/2",
      "/tournaments/individual/results/test/round/3",
    ]);
  });
});
