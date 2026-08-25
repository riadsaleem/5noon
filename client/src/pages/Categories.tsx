import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Categories() {
  const { data: categories, isLoading } = trpc.categories.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-b from-yellow-50 to-white">
        <div className="container">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-900">
            أقسامنا
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            اكتشف مجموعة واسعة من المنتجات في جميع الفئات
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : categories && categories.length > 0 ? (
            <>
              {/* Slider Section */}
              <div className="mb-16">
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="categories-swiper"
                >
                  {categories.slice(0, 6).map((category) => (
                    <SwiperSlide key={category.id}>
                      <div className="bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-[300px] md:h-auto">
                        {category.imageUrl && (
                          <div className="h-full md:aspect-square overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                            <img 
                              src={category.imageUrl} 
                              alt={category.nameAr}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                {category.nameAr}
                              </h3>
                            </div>
                          </div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Grid Section */}
              <div>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  جميع الأقسام
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
                    >
                      {category.imageUrl && (
                        <div className="aspect-square overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          <img 
                            src={category.imageUrl} 
                            alt={category.nameAr}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4 text-center bg-gradient-to-b from-white to-yellow-50">
                        <h3 className="text-lg font-bold text-gray-900">
                          {category.nameAr}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">لا توجد أقسام متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <style>{`
        .categories-swiper {
          padding-bottom: 50px;
        }
        .categories-swiper .swiper-pagination-bullet {
          background: #eab308;
          width: 12px;
          height: 12px;
        }
        .categories-swiper .swiper-pagination-bullet-active {
          background: #ca8a04;
        }
        .categories-swiper .swiper-button-next,
        .categories-swiper .swiper-button-prev {
          color: #eab308;
        }
      `}</style>
    </div>
  );
}
