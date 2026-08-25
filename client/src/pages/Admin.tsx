import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            غير مصرح لك بالدخول
          </h1>
          <p className="text-gray-600 mb-6">
            هذه الصفحة مخصصة للمدراء فقط
          </p>
          <Button onClick={() => window.location.href = "/"}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          لوحة التحكم
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            مرحباً {user.name}
          </h2>
          <p className="text-gray-600 mb-6">
            يمكنك إدارة الأقسام والفروع من هنا
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">إدارة الأقسام</h3>
              <p className="text-gray-600 mb-4">إضافة وتعديل وحذف الأقسام</p>
              <Button className="w-full" onClick={() => window.location.href = "/admin/categories"}>إدارة الأقسام</Button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">إدارة الفروع</h3>
              <p className="text-gray-600 mb-4">إضافة وتعديل وحذف الفروع</p>
              <Button className="w-full">قريباً</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
