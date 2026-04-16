import { describe, it, expect } from "vite-plus/test";
import { nanoid } from "../../src/utils.js";

describe("nanoid", () => {
  it("should generate a slug of length 7", () => {
    const slug = nanoid();
    expect(slug).toHaveLength(7);
  });

  it("should only contain lowercase letters and digits", () => {
    const slug = nanoid();
    expect(slug).toMatch(/^[a-z0-9]+$/);
  });

  it("should generate unique slugs", () => {
    const slugs = new Set(Array.from({ length: 100 }, () => nanoid()));
    expect(slugs.size).toBe(100);
  });
});
