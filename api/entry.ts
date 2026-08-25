import "dotenv/config";
import { createApp } from "../server/app";

// Source for the deployed serverless function.
// api/index.js is the pre-bundled output (kept in git) built from this file:
//   npx esbuild api/entry.ts --bundle --platform=node --format=cjs --outfile=api/index.js
// Only ONE of them may exist per route name, so the .ts entry is NOT named index.
const app = createApp();

export default app;
