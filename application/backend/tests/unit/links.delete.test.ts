import { describe, it, expect, vi, beforeEach } from "vite-plus/test";

// Mock Prisma before importing app
vi.mock("../../src/db/index.js", () => {
  return {
    default: {
      link: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    },
  };
});

import app from "../../src/index.js";
import prisma from "../../src/db/index.js";

// ============================================================
// 🚀 Bonus TDD Exercise: Delete a Link
// ============================================================
//
// Implement a DELETE /api/links/:slug endpoint that:
// 1. Deletes the link with the given slug
// 2. Returns 204 No Content on success
// 3. Returns 404 if the slug doesn't exist
//
// These tests are already green — the endpoint is implemented.
// Try commenting out the route in src/routes/links.ts to see
// the tests go Red 🔴, then bring it back to go Green 🟢.
// ============================================================

describe("delete link", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an existing link and return 204", async () => {
    const mockLink = {
      id: 1,
      slug: "abc1234",
      url: "https://example.com",
      visits: 0,
      createdAt: new Date(),
    };
    vi.mocked(prisma.link.findUnique).mockResolvedValue(mockLink);
    vi.mocked(prisma.link.delete).mockResolvedValue(mockLink);

    const res = await app.request("/api/links/abc1234", { method: "DELETE" });

    expect(res.status).toBe(204);
    expect(prisma.link.delete).toHaveBeenCalledWith({ where: { slug: "abc1234" } });
  });

  it("should return 404 when deleting a non-existent slug", async () => {
    vi.mocked(prisma.link.findUnique).mockResolvedValue(null);

    const res = await app.request("/api/links/doesnotexist", { method: "DELETE" });

    expect(res.status).toBe(404);
    expect(prisma.link.delete).not.toHaveBeenCalled();
  });

  it("should not list the deleted link anymore", async () => {
    const mockLink = {
      id: 2,
      slug: "xyz9999",
      url: "https://osday.dev",
      visits: 3,
      createdAt: new Date(),
    };

    // First: link exists
    vi.mocked(prisma.link.findUnique).mockResolvedValue(mockLink);
    vi.mocked(prisma.link.delete).mockResolvedValue(mockLink);

    const deleteRes = await app.request("/api/links/xyz9999", { method: "DELETE" });
    expect(deleteRes.status).toBe(204);

    // After deletion: list returns empty
    vi.mocked(prisma.link.findMany).mockResolvedValue([]);

    const listRes = await app.request("/api/links");
    expect(listRes.status).toBe(200);
    const links = await listRes.json();
    expect(links).toHaveLength(0);
  });
});
