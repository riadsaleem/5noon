-- ============================================================
-- خمسة نون | سكربت تهيئة Supabase كامل
-- شغّل هذا الملف مرة واحدة في: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1) نوع الدور
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) دالة تحديث updatedAt تلقائياً (بديل MySQL ON UPDATE)
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
  "id" serial PRIMARY KEY,
  "openId" varchar(64) NOT NULL UNIQUE,
  "name" text,
  "email" varchar(320),
  "loginMethod" varchar(64),
  "role" user_role NOT NULL DEFAULT 'user',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "lastSignedIn" timestamp NOT NULL DEFAULT now()
);

-- 4) جدول الأقسام
CREATE TABLE IF NOT EXISTS categories (
  "id" serial PRIMARY KEY,
  "nameAr" varchar(255) NOT NULL,
  "nameEn" varchar(255),
  "description" text,
  "imageUrl" text,
  "imageKey" varchar(500),
  "order" integer NOT NULL DEFAULT 0,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- 5) جدول الفروع
CREATE TABLE IF NOT EXISTS branches (
  "id" serial PRIMARY KEY,
  "nameAr" varchar(255) NOT NULL,
  "nameEn" varchar(255),
  "description" text,
  "imageUrl" text,
  "imageKey" varchar(500),
  "logoUrl" text,
  "logoKey" varchar(500),
  "address" text,
  "phone" varchar(50),
  "googleMapsUrl" text,
  "order" integer NOT NULL DEFAULT 0,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

-- 6) تفعيل مشغلات updatedAt
DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated ON categories;
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_branches_updated ON branches;
CREATE TRIGGER trg_branches_updated BEFORE UPDATE ON branches
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 7) حماية الجداول من الوصول المباشر عبر REST API العام
--    (التطبيق يتصل عبر DATABASE_URL ويتجاوز RLS، فلا تتأثر أي وظيفة)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- 8) إنشاء Bucket الصور (عام للقراءة)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- السماح بقراءة صور الزوار (الرفع يحدث عبر المفتاح السري فقط من السيرفر)
DO $$ BEGIN
  CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 9) زرع البيانات الحالية (17 قسم + 3 فروع + حساب المدير)

INSERT INTO categories ("id","nameAr","nameEn","description","imageUrl","order","isActive") VALUES
(1,'الملابس','Clothes','ملابس رجالية ونسائية وأطفال','/categories/01_Clothes.png',1,true),
(2,'الأدوات المدرسية','School Supplies','أدوات مدرسية ومكتبية','/categories/02_School_tools.png',2,true),
(3,'البلاستيك','Plastic','منتجات بلاستيكية منزلية','/categories/03_plastic.png',3,true),
(4,'الحلويات','Sweets','حلويات وشوكولاتة','/categories/04_candies.png',4,true),
(5,'الألعاب','Toys','ألعاب أطفال','/categories/05_Games.png',5,true),
(6,'العطور','Perfumes','عطور رجالية ونسائية','/categories/06_Perfumes.png',6,true),
(7,'الهدايا','Gifts','هدايا ومناسبات','/categories/07_Gifts.png',7,true),
(8,'التجميل','Beauty','مستحضرات تجميل','/categories/08_Beautification.png',8,true),
(9,'الأواني المنزلية','Kitchenware','أواني وأدوات مطبخ','/categories/09_household_utensils.png',9,true),
(10,'المناديل','Tissues','مناديل ورقية','/categories/10_tissues.png',10,true),
(11,'المياه','Water','مياه معدنية','/categories/11_Water.png',11,true),
(12,'المخبوزات','Bakery','خبز ومعجنات','/categories/12_baked_goods.png',12,true),
(13,'الأطعمة المجمدة','Frozen Foods','أطعمة مجمدة','/categories/13_Frozen_foods.png',13,true),
(14,'العصائر','Juices','عصائر طبيعية','/categories/14_juices.png',14,true),
(15,'البطاطس','Chips','بطاطس ومقرمشات','/categories/15_potato.png',15,true),
(16,'الأثاث','Furniture','أثاث منزلي','/categories/16_Furniture.png',16,true),
(17,'البسكويت','Biscuits','بسكويت وكوكيز','/categories/17_biscuits.png',17,true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO branches ("id","nameAr","nameEn","description","imageUrl","logoUrl","address","phone","googleMapsUrl","order","isActive") VALUES
(1,'خمسة نون العربية فرع وادي الدواسر','Five Noon Al-Arabia - Wadi Al-Dawasir Branch','فرع وادي الدواسر','/branch/branch-main.jpg','/logo-new.png','وادي الدواسر، المملكة العربية السعودية','+966 55 325 3688','https://share.google/2YrGZiunsWylDbbcP',1,true),
(2,'زهرة محطم الأسعار فرع وادي الدواسر','Zahra Price Crusher - Wadi Al-Dawasir Branch','فرع وادي الدواسر','/branch/branch-2.jpg','/zahra-logo.png','وادي الدواسر، المملكة العربية السعودية','+966 55 325 3688','https://share.google/4zLfIXC1zRR5DOQ1V',2,true),
(3,'زهرة محطم الأسعار فرع الخرمة','Zahra Price Crusher - Al-Khurmah Branch','فرع الخرمة','/branch/branch-3.jpg','/zahra-logo.png','الخرمة، المملكة العربية السعودية','+966 55 325 3688','https://share.google/tpAyi7vQJdjSrI0CS',3,true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO users ("openId","name","email","loginMethod","role") VALUES
('admin-mmrakan710@gmail.com','المدير','mmrakan710@gmail.com','simple','admin')
ON CONFLICT ("openId") DO NOTHING;

-- 10) ضبط عدادات المفاتيح الأساسية بعد الزرع اليدوي
SELECT setval(pg_get_serial_sequence('categories','id'), COALESCE((SELECT MAX("id") FROM categories), 1));
SELECT setval(pg_get_serial_sequence('branches','id'), COALESCE((SELECT MAX("id") FROM branches), 1));
SELECT setval(pg_get_serial_sequence('users','id'), COALESCE((SELECT MAX("id") FROM users), 1));

-- تم! 🎉
