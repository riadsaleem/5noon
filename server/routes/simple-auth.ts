import { Router } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { SignJWT } from "jose";
import * as db from "../db";
import { JWT_SECRET } from "../auth";

const router = Router();

// Admin credentials — same values as before, overridable via env.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "mmrakan710@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Popo0909";

router.post("/simple-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من البيانات
    if (!email || !password) {
      return res.status(400).json({ message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" });
    }

    // التحقق من صحة البيانات
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
    }

    // إنشاء أو تحديث المستخدم في قاعدة البيانات
    const openId = "admin-" + ADMIN_EMAIL;
    await db.upsertUser({
      openId,
      name: "المدير",
      email: ADMIN_EMAIL,
      loginMethod: "simple",
      role: "admin",
      lastSignedIn: new Date(),
    });

    // إنشاء JWT token
    const issuedAt = Date.now();
    const expirationSeconds = Math.floor((issuedAt + ONE_YEAR_MS) / 1000);

    const token = await new SignJWT({
      openId,
      appId: "khamsanoon",
      name: "المدير",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(JWT_SECRET);

    // حفظ الـ token في cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_YEAR_MS,
      path: "/",
    });

    res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
  }
});

router.post("/simple-logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
});

export default router;
