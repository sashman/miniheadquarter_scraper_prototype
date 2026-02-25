import { describe, expect, it } from "vitest";
import { parseTournamentList, parseDateToISO } from "./listing.js";

describe("parseDateToISO", () => {
  it("parses abbreviated month with period", () => {
    expect(parseDateToISO("Feb. 28, 2026")).toBe("2026-02-28");
  });

  it("parses full month name", () => {
    expect(parseDateToISO("March 1, 2026")).toBe("2026-03-01");
  });

  it("pads single-digit day", () => {
    expect(parseDateToISO("Jan. 5, 2026")).toBe("2026-01-05");
  });

  it("returns empty string for unrecognized format", () => {
    expect(parseDateToISO("not a date")).toBe("");
  });
});

const LISTING_HTML = `
<html>
<body>
  <table class="table table-hover">
    <thead>
      <tr><th>Name</th><th>Registrations</th><th>Interested</th><th>Date</th></tr>
    </thead>
    <tbody>
      <tr class="tournament-list-row" onclick="window.location='/tournaments/individual/details/my-tournament-2026-02-28'">
        <td>
          <a href="/tournaments/individual/details/my-tournament-2026-02-28">My Tournament</a>
          <span class="badge text-bg-primary text-white">GT FEQ</span>
        </td>
        <td>30 / 40</td>
        <td>55</td>
        <td>Feb. 28, 2026</td>
      </tr>
      <tr class="tournament-list-row" onclick="window.location='/tournaments/individual/details/another-one-2026-03-07'">
        <td>
          <a href="/tournaments/individual/details/another-one-2026-03-07">Another One</a>
        </td>
        <td>10 / 20</td>
        <td>12</td>
        <td>March 7, 2026</td>
      </tr>
    </tbody>
  </table>
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item disabled"><a class="page-link" href="/tournaments/individual/?page=1&game_system=1&country=FR&page_size=10">First</a></li>
      <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
      <li class="page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="/tournaments/individual/?page=2&game_system=1&country=FR&page_size=10">Next</a></li>
      <li class="page-item"><a class="page-link" href="/tournaments/individual/?page=5&game_system=1&country=FR&page_size=10">Last</a></li>
    </ul>
  </nav>
</body>
</html>
`;

describe("parseTournamentList", () => {
  it("extracts tournaments from table rows", () => {
    const result = parseTournamentList(LISTING_HTML);

    expect(result.tournaments).toHaveLength(2);

    expect(result.tournaments[0]).toEqual({
      name: "My Tournament",
      slug: "my-tournament-2026-02-28",
      registrations: "30 / 40",
      interested: 55,
      date: "Feb. 28, 2026",
      dateISO: "2026-02-28",
      url: "/tournaments/individual/details/my-tournament-2026-02-28",
    });

    expect(result.tournaments[1]).toEqual({
      name: "Another One",
      slug: "another-one-2026-03-07",
      registrations: "10 / 20",
      interested: 12,
      date: "March 7, 2026",
      dateISO: "2026-03-07",
      url: "/tournaments/individual/details/another-one-2026-03-07",
    });
  });

  it("extracts total pages from pagination", () => {
    const result = parseTournamentList(LISTING_HTML);
    expect(result.totalPages).toBe(5);
  });
});
