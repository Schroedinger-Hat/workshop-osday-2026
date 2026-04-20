import { describe, it, expect, beforeAll, afterAll } from "vite-plus/test";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

describe("links integration", () => {
  let container: StartedPostgreSqlContainer;
  let prisma: PrismaClient;
  let baseUrl: string;

  beforeAll(async () => {
    // Start a real PostgreSQL container
    container = await new PostgreSqlContainer("postgres:16-alpine").start();

    const databaseUrl = container.getConnectionUri();

    // Push the Prisma schema to the test database
    execSync("npx prisma db push --skip-generate", {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      cwd: new URL("../../", import.meta.url).pathname,
      stdio: "pipe",
    });

    // Create a Prisma client for the test database
    prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

    // Dynamically import and start the app with the test DATABASE_URL
    process.env.DATABASE_URL = databaseUrl;
    const { default: app } = await import("../../src/index.js");
    baseUrl = "http://localhost:3001";
  }, 60_000);

  afterAll(async () => {
    await prisma.$disconnect();
    await container?.stop();
  });

  it("should create a link and redirect", async () => {
    // Import fresh app with test DB
    const { default: app } = await import("../../src/index.js");

    // Create a link via the API
    const createRes = await app.request("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });

    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.slug).toBeDefined();
    expect(created.visits).toBe(0);

    // Redirect via the short URL
    const redirectRes = await app.request(`/${created.slug}`);
    expect(redirectRes.status).toBe(302);
    expect(redirectRes.headers.get("location")).toBe("https://example.com");

    // Check the visit counter was incremented
    const link = await prisma.link.findUnique({
      where: { slug: created.slug },
    });
    expect(link?.visits).toBe(1);
  });

  it("should return 404 for unknown slug", async () => {
    const { default: app } = await import("../../src/index.js");

    const res = await app.request("/nonexistent");
    expect(res.status).toBe(404);
  });

  it("should accumulate visit counter across multiple redirects", async () => {
    const { default: app } = await import("../../src/index.js");

    // Create a fresh link
    const createRes = await app.request("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com" }),
    });
    const { slug } = await createRes.json();

    // Hit the redirect 3 times sequentially
    await app.request(`/${slug}`);
    await app.request(`/${slug}`);
    await app.request(`/${slug}`);

    // Visit counter must be exactly 3, not 1 (catches naive non-atomic increments)
    const link = await prisma.link.findUnique({ where: { slug } });
    expect(link?.visits).toBe(3);
  });

  // TDD Exercise — implement DELETE /api/links/:slug
  it("should delete a link and return 204", async () => {
    const { default: app } = await import("../../src/index.js");

    // Create a link to delete
    const createRes = await app.request("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://example.com/to-delete" }),
    });
    const { slug } = await createRes.json();

    // Delete it
    const deleteRes = await app.request(`/api/links/${slug}`, {
      method: "DELETE",
    });
    expect(deleteRes.status).toBe(204);

    // Confirm it no longer exists in the real DB
    const gone = await prisma.link.findUnique({ where: { slug } });
    expect(gone).toBeNull();
  });

  it("should return 404 when deleting a non-existent slug", async () => {
    const { default: app } = await import("../../src/index.js");

    const res = await app.request("/api/links/does-not-exist", {
      method: "DELETE",
    });
    expect(res.status).toBe(404);
  });
});
