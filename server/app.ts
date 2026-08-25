import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import simpleAuthRouter from "./routes/simple-auth";

/**
 * Builds the Express app with all API routes.
 * Used by:
 *  - api/index.ts (Vercel serverless function)
 *  - server/_core/index.ts (local dev / standalone production server)
 */
export function createApp(): express.Express {
  const app = express();

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Simple login routes
  app.use("/api", simpleAuthRouter);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
