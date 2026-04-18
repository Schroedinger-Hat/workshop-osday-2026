"use client";

import { useState, useEffect } from "react";

interface Link {
  id: number;
  slug: string;
  url: string;
  visits: number;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<Link[]>([]);

  async function fetchLinks() {
    const res = await fetch(`${API_URL}/api/links`);
    const data = await res.json();
    setLinks(data);
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    await fetch(`${API_URL}/api/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setUrl("");
    fetchLinks();
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1>🔗 Link Pulse</h1>
      <p>A simple URL shortener</p>

      <form onSubmit={createLink} style={{ marginBottom: "2rem" }}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          style={{ width: "70%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          Shorten
        </button>
      </form>

      <h2>Your Links</h2>
      {links.length === 0 ? (
        <p>No links yet. Create one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {links.map((link) => (
            <li
              key={link.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <div>
                <strong>
                  <a href={`${API_URL}/${link.slug}`} target="_blank" rel="noopener noreferrer">
                    {API_URL}/{link.slug}
                  </a>
                </strong>
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>→ {link.url}</div>
              <div style={{ fontSize: "0.8rem", color: "#999" }}>
                {link.visits} visits · created {new Date(link.created_at).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
