import { Hono } from "hono";
import { nanoid } from "../utils.js";
import prisma from "../db/index.js";

const links = new Hono();

// Create a short link
links.post("/", async (c) => {
  const { url } = await c.req.json<{ url: string }>();

  if (!url) {
    return c.json({ error: "URL is required" }, 400);
  }

  const slug = nanoid();
  const link = await prisma.link.create({
    data: { slug, url },
  });

  return c.json(link, 201);
});

// List all links
links.get("/", async (c) => {
  const allLinks = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
  });
  return c.json(allLinks);
});

// Delete a link
links.delete("/:slug", async (c) => {
  // TODO: delete the link!
  // const slug = c.req.param("slug");
  // await prisma.link.delete({ where: { slug } });
  // return new Response(null, { status: 204 });
});

export default links;
