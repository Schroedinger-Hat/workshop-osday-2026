import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import prisma from "./db/index.js";
import links from "./routes/links.js";

const app = new Hono();

app.use("/*", cors());

// API routes
app.route("/api/links", links);

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

// Redirect short URL
app.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    return c.json({ error: "Link not found" }, 404);
  }

  // TODO: increment visit counter here (TDD exercise!)

  return c.redirect(link.url, 302);
});

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

export default app;
