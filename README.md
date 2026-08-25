# موقع شركة خمسة نون العربية

موقع إلكتروني لشركة خمسة نون العربية للتجارة والتسوق، مبني بـ React + Express + PostgreSQL (Supabase) ومنشور على Vercel.

## المميزات

- صفحة رئيسية + صفحة الأقسام (17 قسم) + صفحة الفروع (3 فروع)
- لوحة تحكم محمية لتعديل الأقسام والفروع ورفع الصور
- رفع الصور إلى Supabase Storage

## التقنيات

- **الواجهة:** React 19 + TypeScript + Tailwind CSS + Vite
- **الخادم:** Express + tRPC (يعمل كـ Serverless Function على Vercel)
- **قاعدة البيانات:** PostgreSQL على Supabase عبر Drizzle ORM
- **التخزين:** Supabase Storage

## البنية

```
client/                 → واجهة React (تُبنى إلى dist/client)
server/                 → خادم Express + tRPC
api/entry.ts            → مصدر نقطة دخول Vercel Serverless
api/index.js            → الحزمة الجاهزة المولدة من entry.ts (مرفوعة في المستودع)
scripts/supabase-setup.sql → سكربت إنشاء الجداول والبيانات الأولية
vercel.json             → إعدادات النشر على Vercel
```

## خطوات التشغيل والنشر

### 1) تهيئة Supabase (مرة واحدة)

1. أنشئ مشروعاً جديداً في [supabase.com](https://supabase.com)
2. افتح **SQL Editor** والصق محتوى `scripts/supabase-setup.sql` ثم اضغط **Run**
3. من **Project Settings → API Keys** انسخ: `Project URL` و `Secret key`
4. أنشئ bucket عام باسم `images` من قسم Storage (أو نفّذ الخطوة 8 من السكربت)
5. من **Project Settings → Database / Connect** انسخ رابط الاتصال (Session pooler)

### 2) متغيرات البيئة (في Vercel: Settings → Environment Variables)

| المتغير | القيمة |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | `https://REF.supabase.co` |
| `SUPABASE_SECRET_KEY` | مفتاح sb_secret_... (لا يُكشف أبداً للواجهة) |
| `SUPABASE_STORAGE_BUCKET` | `images` |
| `JWT_SECRET` | سر توقيع جلسة لوحة التحكم |
| `ADMIN_EMAIL` | بريد المدير |
| `ADMIN_PASSWORD` | كلمة مرور المدير |

### 3) التطوير المحلي

```bash
npm install
npm run dev        # تشغيل التطوير
npm run check      # فحص TypeScript
npm run build      # بناء الواجهة
npm start          # تشغيل نسخة الإنتاج محلياً
```

> بعد أي تعديل على كود السيرفر يجب إعادة توليد حزمة الـ API قبل النشر:
> ```bash
> npx esbuild api/entry.ts --bundle --platform=node --format=cjs --outfile=api/index.js
> ```

### 4) النشر على Vercel

1. اربط المستودع بمشروع Vercel (Build command و Output directory مضبوطة تلقائياً من `vercel.json`)
2. أضف متغيرات البيئة أعلاه
3. بعد أول Deploy: خذ الرابط من Settings → Domains

### 5) الفهرسة في جوجل (Search Console)

1. أدخل إلى [search.google.com/search-console](https://search.google.com/search-console)
2. أضف خاصية بالنطاق `https://5noon.vercel.app`
3. تحقق بالطريقة التي تناسبك (ملف HTML ضعه في `client/public/` أو سجل DNS)
4. أرسل `https://5noon.vercel.app/sitemap.xml` للفهرسة
5. اطلب فهرسة الصفحة الرئيسية يدوياً عبر "فحص عنوان URL"

## ملاحظات

- الدخول للوحة التحكم مخفي عمداً: انقر 3 مرات على كلمة «شركة» في عنوان الموقع
- حد رفع الملفات عبر لوحة التحكم ≈ 4MB بسبب قيود Serverless (حجم الطلب)
- المشروع المجاني في Supabase يتوقف بعد 7 أيام بدون أي طلبات على قاعدة البيانات — زيارات الموقع الطبيعية تكفي لإبقائه يعمل

## الترخيص

جميع الحقوق محفوظة © شركة خمسة نون العربية
