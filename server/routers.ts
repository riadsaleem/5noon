import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveCategories();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCategoryById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        nameAr: z.string(),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createCategory(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCategory(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteCategory(input.id);
      }),
    
    uploadImage: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `categories/${input.fileName}-${randomSuffix}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        return { url, key: fileKey };
      }),
  }),

  branches: router({
    list: publicProcedure.query(async () => {
      return await db.getActiveBranches();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllBranches();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBranchById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        nameAr: z.string(),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        logoUrl: z.string().optional(),
        logoKey: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        googleMapsUrl: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createBranch(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        imageKey: z.string().optional(),
        logoUrl: z.string().optional(),
        logoKey: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        googleMapsUrl: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateBranch(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await db.deleteBranch(input.id);
      }),
    
    uploadImage: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64
        mimeType: z.string(),
        type: z.enum(['image', 'logo']),
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `branches/${input.type}/${input.fileName}-${randomSuffix}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        return { url, key: fileKey };
      }),
  }),
});

export type AppRouter = typeof appRouter;
