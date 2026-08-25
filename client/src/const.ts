export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "شركة خمسة نون العربية";

export const APP_LOGO = "/logo-final.png";

// Simple login URL for local authentication
export const getLoginUrl = () => {
  return "/login";
};

// Social media links
export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/966553253688",
  instagram: "https://www.instagram.com/noon5.75ar?igsh=MWIwODM5NTZqd296eA==",
  snapchat: "https://www.snapchat.com/add/noon5.75ar?share_id=zAm3pfko_jE&locale=ar-YE",
  phone: "+966 55 325 3688",
};

// Company info
export const COMPANY_INFO = {
  nameAr: "شركة خمسة نون العربية",
  nameEn: "Noon 5 Arabic Company",
  description: "نوفر لكم أفضل المنتجات والخدمات بأسعار تنافسية",
};
