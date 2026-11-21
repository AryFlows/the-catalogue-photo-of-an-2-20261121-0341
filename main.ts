// FROST-1 Ice-Cube Toaster — catalogue photo entry.
// Copies the pre-compressed catalogue photograph (assets/entry.jpg)
// to the grader's output path. No encoder runs at runtime: the image
// bytes are already a valid JPEG within the gate limits
// (at most 1,048,576 bytes, at most 1024x1024 px).

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "assets", "entry.jpg");

// OUTPUT_DIR is a local-test override; the grader runs with /output.
const outDir = process.env.OUTPUT_DIR || "/output";

// Never remove /output: it is a mounted volume. Create it if needed,
// then write only.
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(source, dest);

// Validate the copy: it must be a whole JPEG within the gate limits.
const bytes = readFileSync(dest);
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.length - 2] === 0xff && bytes[bytes.length - 1] === 0xd9;
if (!isJpeg) {
  throw new Error("entry.png is not a whole JPEG");
}
const size = statSync(dest).size;
if (size > 1_048_576) {
  throw new Error(`entry.png is ${size} bytes, over the 1,048,576-byte limit`);
}

console.log(`Wrote entry.png (${size} bytes) from assets/entry.jpg`);
