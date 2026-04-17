import { describe, it } from "vite-plus/test";

// ============================================================
// 🚀 Bonus TDD Exercise: Delete a Link
// ============================================================
//
// Implement a DELETE /api/links/:slug endpoint that:
// 1. Deletes the link with the given slug
// 2. Returns 204 No Content on success
// 3. Returns 404 if the slug doesn't exist
//
// Steps:
// 1. Replace the it.todo() calls below with real tests
// 2. Run `vp test run` — they should fail (Red 🔴)
// 3. Implement the DELETE route in src/routes/links.ts
// 4. Run `vp test run` — they should pass (Green 🟢)
// ============================================================

describe("delete link", () => {
  it.todo("should delete an existing link and return 204");

  it.todo("should return 404 when deleting a non-existent slug");

  it.todo("should not list the deleted link anymore");
});
