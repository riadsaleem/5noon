import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setPageMeta } from "@/lib/seo";

interface Branch {
  id: number;
  nameAr: string;
  nameEn: string | null;
  description: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  logoUrl: string | null;
  logoKey: string | null;
  address: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  order: number;
  isActive: boolean;
}

type ImageField = "image" | "logo";

const emptyForm = {
  nameAr: "",
  nameEn: "",
  description: "",
  address: "",
  phone: "",
  googleMapsUrl: "",
  order: 0,
};

export default function AdminBranches() {
  const { user, loading, isAuthenticated } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  setPageMeta({
    title: "إدارة الفروع | لوحة التحكم",
    description: "لوحة إدارة فروع شركة خمسة نون العربية",
    noindex: true,
  });

  const branchesQuery = trpc.branches.listAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const createMutation = trpc.branches.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة الفرع بنجاح");
      branchesQuery.refetch();
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error("فشل إضافة الفرع: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const updateMutation = trpc.branches.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الفرع بنجاح");
      branchesQuery.refetch();
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error("فشل تحديث الفرع: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const deleteMutation = trpc.branches.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الفرع بنجاح");
      branchesQuery.refetch();
    },
    onError: (error: unknown) => {
      toast.error("فشل حذف الفرع: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const uploadImageMutation = trpc.branches.uploadImage.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (branchesQuery.data) {
      setBranches(branchesQuery.data);
    }
  }, [branchesQuery.data]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData({ ...emptyForm });
    setImageFile(null);
    setImagePreview("");
    setLogoFile(null);
    setLogoPreview("");
  };

  const openCreateModal = () => {
    setEditingBranch(null);
    setFormData({ ...emptyForm, order: branches.length });
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      nameAr: branch.nameAr,
      nameEn: branch.nameEn || "",
      description: branch.description || "",
      address: branch.address || "",
      phone: branch.phone || "",
      googleMapsUrl: branch.googleMapsUrl || "",
      order: branch.order,
    });
    setImagePreview(branch.imageUrl || "");
    setLogoPreview(branch.logoUrl || "");
    setIsModalOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ImageField
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === "image") {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadOne = async (
    file: File,
    type: ImageField
  ): Promise<{ url: string; key: string }> => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve((reader.result as string).split(",")[1] ?? "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return uploadImageMutation.mutateAsync({
      fileName: file.name,
      fileData: base64Data,
      mimeType: file.type,
      type,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = editingBranch?.imageUrl ?? "";
      let imageKey = editingBranch?.imageKey ?? undefined;
      let logoUrl = editingBranch?.logoUrl ?? "";
      let logoKey = editingBranch?.logoKey ?? undefined;

      if (imageFile) {
        const up = await uploadOne(imageFile, "image");
        imageUrl = up.url;
        imageKey = up.key;
      }
      if (logoFile) {
        const up = await uploadOne(logoFile, "logo");
        logoUrl = up.url;
        logoKey = up.key;
      }

      saveBranch(imageUrl, imageKey, logoUrl, logoKey);
    } catch {
      toast.error("فشل رفع الصور");
      setIsUploading(false);
    }
  };

  const saveBranch = (
    imageUrl: string,
    imageKey?: string | null,
    logoUrl?: string,
    logoKey?: string | null
  ) => {
    const data = {
      nameAr: formData.nameAr,
      nameEn: formData.nameEn || undefined,
      description: formData.description || undefined,
      imageUrl: imageUrl || undefined,
      imageKey: imageKey || undefined,
      logoUrl: logoUrl || undefined,
      logoKey: logoKey || undefined,
      address: formData.address || undefined,
      phone: formData.phone || undefined,
      googleMapsUrl: formData.googleMapsUrl || undefined,
      order: formData.order,
    };

    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, ...data });
    } else {
      createMutation.mutate(data);
    }
    setIsUploading(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الفرع؟")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleActive = (branch: Branch) => {
    updateMutation.mutate({
      id: branch.id,
      isActive: !branch.isActive,
    });
  };

  const moveBranch = (index: number, direction: "up" | "down") => {
    const next = [...branches];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= next.length) return;

    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    next.forEach((b, idx) => {
      updateMutation.mutate({ id: b.id, order: idx });
    });

    setBranches(next);
  };

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

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">غير مصرح لك بالدخول</h1>
          <p className="text-gray-600 mb-6">هذه الصفحة مخصصة للمدراء فقط</p>
          <Button onClick={() => (window.location.href = "/")}>العودة للرئيسية</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">إدارة الفروع</h1>
            <Button onClick={openCreateModal} className="bg-yellow-500 hover:bg-yellow-600">
              <Plus className="w-5 h-5 ml-2" />
              إضافة فرع جديد
            </Button>
          </div>

          {branchesQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch, index) => (
                <div
                  key={branch.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    !branch.isActive ? "opacity-50" : ""
                  }`}
                >
                  {branch.imageUrl && (
                    <img
                      src={branch.imageUrl}
                      alt={branch.nameAr}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      {branch.logoUrl && (
                        <img
                          src={branch.logoUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{branch.nameAr}</h3>
                        {branch.nameEn && (
                          <p className="text-sm text-gray-600">{branch.nameEn}</p>
                        )}
                      </div>
                    </div>
                    {branch.address && (
                      <p className="text-sm text-gray-700 mb-1">📍 {branch.address}</p>
                    )}
                    {branch.phone && (
                      <p className="text-sm text-gray-700 mb-4" dir="ltr">
                        📞 {branch.phone}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(branch)}>
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(branch.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(branch)}>
                        {branch.isActive ? "إخفاء" : "إظهار"}
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveBranch(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveBranch(index, "down")}
                          disabled={index === branches.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBranch ? "تعديل الفرع" : "إضافة فرع جديد"}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالعربية *
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                    placeholder="مثال: خمسة نون العربية فرع وادي الدواسر"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإنجليزية
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Example: Wadi Al-Dawasir Branch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر للفرع"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="وادي الدواسر، المملكة العربية السعودية"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+966 55 325 3688"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط خرائط جوجل
                  </label>
                  <Input
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>

                {/* Branch image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة الفرع
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>اختر صورة</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "image")}
                        className="hidden"
                      />
                    </label>
                    {imageFile && <span className="text-sm text-gray-600">{imageFile.name}</span>}
                  </div>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="mt-3 w-full h-40 object-cover rounded-lg"
                    />
                  )}
                </div>

                {/* Branch logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شعار الفرع
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Upload className="w-5 h-5" />
                        <span>اختر الشعار</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="hidden"
                      />
                    </label>
                    {logoFile && <span className="text-sm text-gray-600">{logoFile.name}</span>}
                  </div>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="معاينة الشعار"
                      className="mt-3 w-24 h-24 object-contain rounded-lg border"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isUploading || createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                  >
                    {isUploading || createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : editingBranch ? (
                      "تحديث"
                    ) : (
                      "إضافة"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
