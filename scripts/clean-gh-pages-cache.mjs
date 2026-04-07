#!/usr/bin/env node
/**
 * gh-pages-clean can crash when find-cache-dir returns undefined (e.g. Node 24).
 * This removes the default cache location used by gh-pages under node_modules.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cache = path.join(root, "node_modules", ".cache", "gh-pages");
if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true, force: true });
  console.log("Removed:", cache);
} else {
  console.log("Nothing to remove:", cache);
}
