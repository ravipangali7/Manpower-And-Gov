/**
 * Normalize TanStack Start SPA output into a traditional static layout:
 *   dist/index.html
 *   dist/favicon.ico
 *   dist/assets/*
 *
 * Newer builds may already emit these at dist root; older ones use dist/client.
 * Either way, drop the SSR server bundle (not needed for static hosting).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");

if (!fs.existsSync(dist)) {
  console.error("[flatten-dist] Missing dist/ — build may have failed.");
  process.exit(1);
}

if (fs.existsSync(client)) {
  const staging = path.join(dist, "_static_staging");
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });

  for (const entry of fs.readdirSync(client)) {
    fs.cpSync(path.join(client, entry), path.join(staging, entry), {
      recursive: true,
    });
  }

  for (const entry of fs.readdirSync(dist)) {
    if (entry === "_static_staging") continue;
    fs.rmSync(path.join(dist, entry), { recursive: true, force: true });
  }

  for (const entry of fs.readdirSync(staging)) {
    fs.renameSync(path.join(staging, entry), path.join(dist, entry));
  }
  fs.rmSync(staging, { recursive: true, force: true });
}

const server = path.join(dist, "server");
if (fs.existsSync(server)) {
  fs.rmSync(server, { recursive: true, force: true });
}

const icoSrc = path.join(root, "public", "favicon.ico");
const icoDest = path.join(dist, "favicon.ico");
if (!fs.existsSync(icoDest) && fs.existsSync(icoSrc)) {
  fs.copyFileSync(icoSrc, icoDest);
}

const required = ["index.html", "favicon.ico", "assets"];
for (const name of required) {
  if (!fs.existsSync(path.join(dist, name))) {
    console.error(`[flatten-dist] Missing dist/${name}`);
    process.exit(1);
  }
}

console.log("[flatten-dist] Ready: dist/index.html, dist/favicon.ico, dist/assets/");
