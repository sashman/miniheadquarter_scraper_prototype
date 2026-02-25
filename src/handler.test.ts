import { describe, expect, it } from "vitest";
import { handler } from "./handler.js";

describe("handler", () => {
  it("returns 400 when dates are missing", async () => {
    const response = await handler({});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: "dateFrom and dateTo are required (YYYY-MM-DD)",
    });
  });
});
