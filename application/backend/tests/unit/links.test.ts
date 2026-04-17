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
      },
      $connect: vi.fn(),
      $disconnect: vi.fn(),
    },
  };
});

import app from "../../src/index.js";
import prisma from "../../src/db/index.js";

describe("visit counter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should increment visits on redirect", async () => {
    // Arrange: mock a link in the database
    const mockLink = { id: 1, slug: "abc1234", url: "https://example.com", visits: 0, createdAt: new Date() };
    vi.mocked(prisma.link.findUnique).mockResolvedValue(mockLink);
    vi.mocked(prisma.link.update).mockResolvedValue({ ...mockLink, visits: 1 });

    // Act: hit the redirect endpoint
    const res = await app.request("/abc1234");

    // Assert: redirect works
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://example.com");

    // Assert: visits should have been incremented
    expect(prisma.link.update).toHaveBeenCalledWith({
      where: { slug: "abc1234" },
      data: { visits: { increment: 1 } },
    });
  });

  it("should return 404 for unknown slug", async () => {
    vi.mocked(prisma.link.findUnique).mockResolvedValue(null);

    const res = await app.request("/nonexistent");

    expect(res.status).toBe(404);
    expect(prisma.link.update).not.toHaveBeenCalled();
  });

  it("should return visits count in the links list", async () => {
    const mockLinks = [
      { id: 1, slug: "abc1234", url: "https://example.com", visits: 42, createdAt: new Date() },
    ];
    vi.mocked(prisma.link.findMany).mockResolvedValue(mockLinks);

    const res = await app.request("/api/links");
    expect(res.status).toBe(200);

    const links = await res.json();
    expect(links[0].visits).toBe(42);
  });
});
