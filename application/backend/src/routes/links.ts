import { Hono } from "hono";
import { nanoid } from "../utils.js";
import pool from "../db/index.js";

const links = new Hono();

// Create a short link
links.post("/", async (c) => {
  const { url } = await c.req.json<{ url: string }>();

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  const slug = nanoid();
  const result = await pool.query(
    "INSERT INTO links (slug, url) VALUES ($1, $2) RETURNING id, slug, url, visits, created_at",
    [slug, url],
  );

  return c.json(result.rows[0], 201);
});

// List all links
links.get("/", async (c) => {
  const result = await pool.query(
    "SELECT id, slug, url, visits, created_at FROM links ORDER BY created_at DESC",
  );
  return c.json(result.rows);
});

export default links;
