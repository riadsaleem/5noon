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
client/          → واجهة React (تُبنى إلى dist/client)
server/          → خادم Express + tRPC
api/index.ts     → نقطة دخول Vercel Serverless
SUPABASE_SETUP.sql → سكربت إنشاء الجداول والبيانات الأولية
vercel.json      → إعدادات النشر على Vercel
```

## خطوات التشغيل والنشر

### 1) تهيئة Supabase (مرة واحدة)

1. أنشئ مشروعاً جديداً في [supabase.com](https://supabase.com)
2. افتح **SQL Editor** والصق محتوى `SUPABASE_SETUP.sql` ثم اضغط **Run**
3. من **Project Settings → API Keys** انسخ: `Project URL` و `Secret key`
4. من **Project Settings → Database / Connect** انسخ رابط الاتصال (Session pooler)

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

### 4) النشر على Vercel

1. اربط المستودع بمشروع Vercel (Build command و Output directory مضبوطة تلقائياً من `vercel.json`)
2. أضف متغيرات البيئة أعلاه
3. **مهم:** من Project Settings → Deployment Protection عطّل الحماية حتى يستطيع الزوار فتح الموقع

## ملاحظات

- حد رفع الملفات عبر لوحة التحكم ≈ 4MB بسبب قيود Serverless (حجم الطلب)
- المشروع المجاني في Supabase يتوقف بعد 7 أيام بدون أي طلبات على قاعدة البيانات — زيارات الموقع الطبيعية تكفي لإبقائه يعمل، أو أضف Cron job يضرب `/api/trpc/categories.list` كل بضعة أيام

## الترخيص

جميع الحقوق محفوظة © شركة خمسة نون العربية
