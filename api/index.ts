import "dotenv/config";
import { createApp } from "../server/app";

// Vercel serverless entry point.
// vercel.json rewrites /api/* to this function; Express handles the full path.
const app = createApp();

export default app;
