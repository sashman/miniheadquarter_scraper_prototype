import { describe, expect, it } from "vitest";
import { parseArmyLists } from "./armyLists.js";

const ARMY_LISTS_HTML = `
<html>
<body>
  <div class="container">
    <div class="col-md">
      <div class="accordion" id="teams-accordion">
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-0">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapse-0" aria-expanded="true" aria-controls="collapse-0">
              Alex - Orks
            </button>
          </h2>
          <div id="collapse-0" class="accordion-collapse collapse show"
               aria-labelledby="heading-0" data-bs-parent="#teams-accordion">
            <div class="accordion-body">
              <p>Mignon tout plein (2000 points)</p>
              <p>Orks Strike Force (2000 points) War Horde</p>
              <p>CHARACTERS</p>
              <p>Beastboss (95 points)</p>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="heading-1">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1">
              Boka - Aeldari - Craftworlds
            </button>
          </h2>
          <div id="collapse-1" class="accordion-collapse collapse" aria-labelledby="heading-1"
               data-bs-parent="#teams-accordion">
            <div class="accordion-body">
              <pre><p>Aspect Host list content here</p></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

describe("parseArmyLists", () => {
  it("extracts army lists from accordion", () => {
    const lists = parseArmyLists(ARMY_LISTS_HTML);

    expect(lists).toHaveLength(2);

    expect(lists[0].playerName).toBe("Alex");
    expect(lists[0].faction).toBe("Orks");
    expect(lists[0].listText).toContain("Mignon tout plein");
    expect(lists[0].listText).toContain("Beastboss");
  });

  it("handles multi-part faction names", () => {
    const lists = parseArmyLists(ARMY_LISTS_HTML);

    expect(lists[1].playerName).toBe("Boka");
    expect(lists[1].faction).toBe("Aeldari - Craftworlds");
    expect(lists[1].listText).toContain("Aspect Host list content here");
  });
});
