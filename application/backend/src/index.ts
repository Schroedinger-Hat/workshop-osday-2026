import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import pool from "./db/index.js";
import { initDb } from "./db/index.js";
import links from "./routes/links.js";

const app = new Hono();

app.use("/*", cors());

// API routes
app.route("/api/links", links);

// Redirect short URL
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const result = await pool.query("SELECT url FROM links WHERE slug = $1", [
    slug,
  ]);

  if (result.rows.length === 0) {
    return c.json({ error: "Link not found" }, 404);
  }

  return c.redirect(result.rows[0].url, 302);
});

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT) || 3001;

initDb().then(() => {
  console.log("Database initialized");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
});

export default app;
