import { describe, expect, it } from "vitest";
import { handler } from "./handler.js";

describe("handler", () => {
  it("returns 200 with ok message", async () => {
    const response = await handler({});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: "ok" });
  });
});
