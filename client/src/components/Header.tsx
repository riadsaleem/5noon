import { useRef, useState } from "react";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

// Secret admin access: click/tap the brand (logo + title) 3 times quickly.
function useSecretLogin() {
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pulse, setPulse] = useState(false);

  const registerClick = () => {
    clicks.current += 1;
    setPulse(true);
    setTimeout(() => setPulse(false), 120);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 1500);

    if (clicks.current >= 3) {
      clicks.current = 0;
      window.location.assign("/login");
    }
  };

  return { registerClick, pulse };
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { registerClick, pulse } = useSecretLogin();
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/categories", label: "الأقسام" },
    { href: "/branches", label: "الفروع" },
  ];

  // Add admin link only for authenticated admin users
  if (isAuthenticated && user?.role === "admin") {
    navLinks.push({ href: "/admin", label: "لوحة التحكم" });
  }

  const handleLogout = async () => {
    if (!confirm("هل أنت متأكد من تسجيل الخروج؟")) return;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      window.location.href = "/";
    }
  };

  // Title text (whole brand block is the secret click zone)
  const titleClass = "text-2xl font-bold text-gray-700 whitespace-nowrap";

  return (
    <>
      {/* Spacer so fixed header never covers page content */}
      <div className="h-[108px] md:h-20 shrink-0" aria-hidden />

      <header className="bg-white shadow-md fixed top-0 inset-x-0 z-[100]">
        <div className="container">
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between h-20 py-2">
            {/* Brand: logo + title (secret triple-click zone) */}
            <div
              onClick={registerClick}
              className={`flex items-center gap-3 cursor-default select-none transition-transform duration-100 ${
                pulse ? "scale-[0.97] opacity-80" : ""
              }`}
            >
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="h-14 w-14 object-cover rounded-full"
              />
              <span className={titleClass}>{APP_TITLE}</span>
            </div>

            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a className="text-gray-700 hover:text-yellow-600 font-medium transition-colors">
                      {link.label}
                    </a>
                  </Link>
                ))}
              </nav>

              {isAuthenticated && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل خروج
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden py-2">
            <div className="flex items-center justify-between mb-1 h-12">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs px-2 py-1 h-8"
                >
                  <LogOut className="w-3 h-3" />
                  خروج
                </Button>
              ) : (
                <span className="w-8" aria-hidden />
              )}

              <div
                onClick={registerClick}
                className={`flex items-center gap-2 cursor-default select-none transition-transform duration-100 ${
                  pulse ? "scale-[0.97] opacity-80" : ""
                }`}
              >
                <span className="text-lg font-bold text-gray-700 whitespace-nowrap">
                  {APP_TITLE}
                </span>
                <img
                  src={APP_LOGO}
                  alt={APP_TITLE}
                  className="h-12 w-12 object-cover rounded-full"
                />
              </div>
            </div>

            <nav className="flex items-center justify-start gap-2 flex-nowrap overflow-x-auto h-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className="text-xs px-2 py-1 text-gray-700 hover:text-yellow-600 font-medium transition-colors whitespace-nowrap bg-gray-50 rounded-md block">
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
