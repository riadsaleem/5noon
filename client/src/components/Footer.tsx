import { Link } from "wouter";
import { Phone } from "lucide-react";
import { SOCIAL_LINKS, COMPANY_INFO } from "@/const";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="container">
        {/* Desktop Footer - 2 columns */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">{COMPANY_INFO.nameAr}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Right Column: Social Media with Real Icons */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">تواصل معنا</h3>
            <div className="flex flex-col gap-3">
              <a 
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors"
              >
                <img src="/social-icons/whatsapp.svg" alt="واتساب" className="w-10 h-10" />
                <span className="text-base">واتساب</span>
              </a>
              <a 
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-pink-400 transition-colors"
              >
                <img src="/social-icons/instagram.png" alt="انستقرام" className="w-10 h-10 rounded-lg" />
                <span className="text-base">انستقرام</span>
              </a>
              <a 
                href={SOCIAL_LINKS.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <img src="/social-icons/snapchat.svg" alt="سناب شات" className="w-10 h-10" />
                <span className="text-base">سناب شات</span>
              </a>
              <a 
                href={`tel:${SOCIAL_LINKS.phone}`}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors text-lg"
              >
                <Phone className="w-6 h-6" />
                <span dir="ltr">{SOCIAL_LINKS.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Footer - 2 columns side by side */}
        <div className="md:hidden grid grid-cols-2 gap-2 mb-4">
          {/* Right Column: Company Info */}
          <div className="pr-2">
            <h3 className="text-sm font-bold mb-1 text-yellow-400">{COMPANY_INFO.nameAr}</h3>
            <p className="text-gray-300 text-xs leading-relaxed">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Left Column: Social Media Icons - Aligned to left edge */}
          <div className="flex flex-col gap-2 pl-0">
            <a 
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
            >
              <img src="/social-icons/whatsapp.svg" alt="واتساب" className="w-8 h-8" />
              <span className="text-xs">واتساب</span>
            </a>
            <a 
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors"
            >
              <img src="/social-icons/instagram.png" alt="انستقرام" className="w-8 h-8 rounded-lg" />
              <span className="text-xs">انستقرام</span>
            </a>
            <a 
              href={SOCIAL_LINKS.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <img src="/social-icons/snapchat.svg" alt="سناب شات" className="w-8 h-8" />
              <span className="text-xs">سناب شات</span>
            </a>
            <a 
              href={`tel:${SOCIAL_LINKS.phone}`}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center gap-1 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr" className="text-xs">{SOCIAL_LINKS.phone}</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-3 text-center">
          <p className="text-gray-400 text-xs md:text-sm">
            © 2025 {COMPANY_INFO.nameAr}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
