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

interface Category {
  id: number;
  nameAr: string;
  nameEn: string | null;
  description: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminCategories() {
  const { user, loading, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    imageUrl: "",
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const categoriesQuery = trpc.categories.listAll.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة القسم بنجاح");
      categoriesQuery.refetch();
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error("فشل إضافة القسم: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث القسم بنجاح");
      categoriesQuery.refetch();
      closeModal();
    },
    onError: (error: unknown) => {
      toast.error("فشل تحديث القسم: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف القسم بنجاح");
      categoriesQuery.refetch();
    },
    onError: (error: unknown) => {
      toast.error("فشل حذف القسم: " + (error instanceof Error ? error.message : String(error)));
    },
  });

  const uploadImageMutation = trpc.categories.uploadImage.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (categoriesQuery.data) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      description: "",
      imageUrl: "",
      order: 0,
    });
    setImageFile(null);
    setImagePreview("");
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      nameAr: "",
      nameEn: "",
      description: "",
      imageUrl: "",
      order: categories.length,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameAr: category.nameAr,
      nameEn: category.nameEn || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      order: category.order,
    });
    setImagePreview(category.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = formData.imageUrl;
      let imageKey = editingCategory?.imageKey;

      // Upload new image if selected
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          const uploadResult = await uploadImageMutation.mutateAsync({
            fileName: imageFile.name,
            fileData: base64Data,
            mimeType: imageFile.type,
          });
          imageUrl = uploadResult.url;
          imageKey = uploadResult.key;

          // Now save the category
          saveCategory(imageUrl, imageKey);
        };
        reader.readAsDataURL(imageFile);
      } else {
        saveCategory(imageUrl, imageKey);
      }
    } catch (error: unknown) {
      toast.error("فشل رفع الصورة");
      setIsUploading(false);
    }
  };

  const saveCategory = (imageUrl: string, imageKey?: string | null) => {
    const data = {
      nameAr: formData.nameAr,
      nameEn: formData.nameEn || undefined,
      description: formData.description || undefined,
      imageUrl: imageUrl || undefined,
      imageKey: imageKey || undefined,
      order: formData.order,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...data });
    } else {
      createMutation.mutate(data);
    }
    setIsUploading(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleActive = (category: Category) => {
    updateMutation.mutate({
      id: category.id,
      isActive: !category.isActive,
    });
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;
    
    // Swap
    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
    
    // Update orders
    newCategories.forEach((cat, idx) => {
      updateMutation.mutate({ id: cat.id, order: idx });
    });
    
    setCategories(newCategories);
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              إدارة الأقسام
            </h1>
            <Button onClick={openCreateModal} className="bg-yellow-500 hover:bg-yellow-600">
              <Plus className="w-5 h-5 ml-2" />
              إضافة قسم جديد
            </Button>
          </div>

          {categoriesQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    !category.isActive ? 'opacity-50' : ''
                  }`}
                >
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt={category.nameAr}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.nameAr}
                    </h3>
                    {category.nameEn && (
                      <p className="text-sm text-gray-600 mb-2">{category.nameEn}</p>
                    )}
                    {category.description && (
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(category)}
                      >
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(category)}
                      >
                        {category.isActive ? 'إخفاء' : 'إظهار'}
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveCategory(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === categories.length - 1}
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
                  {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
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
                    placeholder="مثال: الملابس"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم بالإنجليزية
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Example: Clothes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف مختصر للقسم"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الترتيب
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة القسم
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
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imageFile && <span className="text-sm text-gray-600">{imageFile.name}</span>}
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isUploading || createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                  >
                    {(isUploading || createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      editingCategory ? 'تحديث' : 'إضافة'
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
