import { Link } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  
  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/categories", label: "الأقسام" },
    { href: "/branches", label: "الفروع" },
  ];

  // Add admin link only for authenticated admin users
  if (isAuthenticated && user?.role === 'admin') {
    navLinks.push({ href: "/admin", label: "لوحة التحكم" });
  }

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      logout();
      // Force reload to clear all state
      window.location.href = "/";
      window.location.reload();
    }
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
              <span className="text-2xl font-bold text-gray-700 whitespace-nowrap">{APP_TITLE}</span>
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
            
            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name || user?.email}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل خروج
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleLogin}
                className="bg-yellow-600 hover:bg-yellow-700 gap-2"
                size="sm"
              >
                <LogIn className="w-4 h-4" />
                تسجيل دخول
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden py-3">
          {/* First Row: Logo, Title, and Auth Button */}
          <div className="flex items-center justify-between mb-3">
            {/* Auth Button - Left Side */}
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="gap-1 text-xs px-2 py-1 h-8"
              >
                <LogOut className="w-3 h-3" />
                خروج
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                className="bg-yellow-600 hover:bg-yellow-700 gap-1 text-xs px-2 py-1 h-8"
                size="sm"
              >
                <LogIn className="w-3 h-3" />
                دخول
              </Button>
            )}

            {/* Logo and Title - Right Side */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-lg font-bold text-gray-700 whitespace-nowrap">{APP_TITLE}</span>
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
