import { Link, useLocation } from "wouter";
import { useRef, useState } from "react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

// Secret admin access: click the word "شركة" in the title 3 times quickly.
function useSecretLogin() {
  const [, setLocation] = useLocation();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return () => {
    clicks.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
    }, 1200);
    if (clicks.current >= 3) {
      clicks.current = 0;
      setLocation("/login");
    }
  };
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const secretClick = useSecretLogin();
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

  // Render title with a hidden triple-click trigger on the word "شركة"
  const renderTitle = (className: string) => {
    const words = APP_TITLE.split(" ");
    return (
      <span className={className}>
        <span onClick={secretClick} className="cursor-default select-none">
          {words[0]}
        </span>{" "}
        {words.slice(1).join(" ")}
      </span>
    );
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20 py-2">
          {/* Logo and Title */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="h-14 w-14 object-cover rounded-full"
              />
              {renderTitle("text-2xl font-bold text-gray-700 whitespace-nowrap")}
            </div>
          </Link>

          {/* Desktop Navigation and Auth */}
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

            {/* Auth state (no visible login button - access is via secret gesture) */}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name || user?.email}</span>
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

        {/* Mobile Header */}
        <div className="md:hidden py-3">
          {/* First Row: Logo, Title, and Auth */}
          <div className="flex items-center justify-between mb-3 min-h-[48px]">
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

            {/* Logo and Title - Right Side */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                {renderTitle("text-lg font-bold text-gray-700 whitespace-nowrap")}
                <img
                  src={APP_LOGO}
                  alt={APP_TITLE}
                  className="h-12 w-12 object-cover rounded-full"
                />
              </div>
            </Link>
          </div>

          {/* Second Row: Navigation Links */}
          <nav className="flex items-center justify-start gap-3 flex-wrap">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className="text-xs px-2 py-1 text-gray-700 hover:text-yellow-600 font-medium transition-colors whitespace-nowrap bg-gray-50 rounded-md">
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
