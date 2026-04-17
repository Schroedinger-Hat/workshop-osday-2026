#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Setting up the workshop environment..."

# ── Install Vite+ CLI ──────────────────────────────────────────────
echo "📦 Installing Vite+ CLI..."
curl -fsSL https://vite.plus | bash
export PATH="$HOME/.vite-plus/bin:$PATH"

# Add vp to PATH permanently
if ! grep -q '.vite-plus/bin' "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.vite-plus/bin:$PATH"' >> "$HOME/.bashrc"
fi

# ── Install backend dependencies ──────────────────────────────────
echo "📦 Installing backend dependencies..."
cd /workspaces/workshop-osday-2026/application/backend
npm ci

# ── Generate Prisma client ────────────────────────────────────────
echo "📦 Generating Prisma client..."
npx prisma generate

# ── Install frontend dependencies ─────────────────────────────────
echo "📦 Installing frontend dependencies..."
cd /workspaces/workshop-osday-2026/application/frontend
npm ci

echo ""
echo "✅ Workshop environment ready!"
echo ""
echo "  Quick start:"
echo "    cd application/backend && vp test run   # Run backend tests"
echo "    cd application/backend && vp dev         # Start backend dev server"
echo ""
