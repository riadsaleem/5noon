import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { ShoppingBag, MapPin, Award, TrendingUp, Users, Target, Star, Shield, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 py-8 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="container relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 drop-shadow-lg">
                شركة خمسة نون العربية
              </h1>
              <p className="text-lg md:text-2xl text-white mb-2 md:mb-3 font-bold">
                وجهتك الأولى للتسوق الذكي
              </p>
              <p className="text-sm md:text-lg text-yellow-50 mb-4 md:mb-6">
                نوفر لكم أفضل المنتجات والخدمات بأسعار تنافسية
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/categories">
                  <Button size="default" className="bg-white text-yellow-600 hover:bg-yellow-50 font-bold text-base px-6 py-3">
                    تصفح الأقسام
                  </Button>
                </Link>
                <Link href="/branches">
                  <Button size="default" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-yellow-600 font-bold text-base px-6 py-3">
                    زوروا فروعنا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section - قصتنا */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-yellow-400">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-right">
                  <p>
                    <strong className="text-yellow-600 text-2xl block mb-4 text-left">شركة خمسة نون العربية</strong>
                    هي واحدة من الشركات الرائدة في مجال التجارة والتسوق في المملكة العربية السعودية. تأسست الشركة برؤية واضحة: توفير أفضل المنتجات بأسعار تنافسية مع خدمة عملاء استثنائية.
                  </p>
                  <p>
                    نحن نؤمن بأن التسوق يجب أن يكون تجربة ممتعة وسهلة للجميع. لذلك، نعمل جاهدين لتوفير مجموعة واسعة من المنتجات عالية الجودة التي تلبي احتياجات جميع أفراد الأسرة.
                  </p>
                  <p>
                    مع فروعنا المنتشرة في مواقع استراتيجية، نسعى دائماً لأن نكون قريبين منكم، ونقدم لكم أفضل العروض والخدمات التي تفوق توقعاتكم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-yellow-50 to-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              لماذا تختار خمسة نون العربية؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">جودة عالية</h3>
                <p className="text-gray-700 text-lg">
                  نختار لكم أفضل المنتجات من علامات تجارية موثوقة
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">أسعار تنافسية</h3>
                <p className="text-gray-700 text-lg">
                  نحطم الأسعار لنوفر لكم أفضل العروض في السوق
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">خدمة ممتازة</h3>
                <p className="text-gray-700 text-lg">
                  فريق متخصص لخدمتكم وتلبية احتياجاتكم
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - قيمنا ومبادئنا */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              قيمنا ومبادئنا
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-yellow-500">
                <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">الجودة</h3>
                <p className="text-gray-600">
                  نلتزم بتقديم منتجات عالية الجودة من أفضل العلامات التجارية
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-500">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">الثقة</h3>
                <p className="text-gray-600">
                  نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة والشفافية
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-green-500">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">الاهتمام</h3>
                <p className="text-gray-600">
                  نهتم بعملائنا ونسعى دائماً لتجاوز توقعاتهم في كل تعامل
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-purple-500">
                <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">السرعة</h3>
                <p className="text-gray-600">
                  نوفر خدمة سريعة وفعالة لتوفير وقتكم وجهدكم
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-b from-yellow-50 to-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Mission */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white rounded-full p-4">
                    <Target className="w-12 h-12 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-center mb-6">رسالتنا</h3>
                <p className="text-lg text-yellow-50 leading-relaxed text-center">
                  تقديم تجربة تسوق استثنائية لعملائنا من خلال توفير منتجات عالية الجودة بأسعار تنافسية، مع خدمة عملاء متميزة تضمن رضاهم التام.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-white rounded-full p-4">
                    <Star className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-center mb-6">رؤيتنا</h3>
                <p className="text-lg text-blue-50 leading-relaxed text-center">
                  أن نكون الوجهة الأولى للتسوق في المملكة، ونحقق الريادة في مجال التجارة من خلال الابتكار المستمر والتزامنا بالتميز.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Options Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <h2 className="text-5xl font-bold text-center mb-4 text-gray-900">
              اكتشف عالمنا
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              تصفح أقسامنا المتنوعة أو تعرف على فروعنا المنتشرة
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Categories Card */}
              <Link href="/categories">
                <div className="group cursor-pointer bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-lg" />
                    <h3 className="text-4xl font-black text-white mb-3">أقسامنا</h3>
                    <p className="text-xl text-yellow-50 font-medium">تصفح جميع الأقسام والمنتجات</p>
                  </div>
                  <div className="p-8 text-center bg-gradient-to-b from-white to-yellow-50">
                    <p className="text-gray-700 text-lg mb-6">
                      اكتشف مجموعة واسعة من المنتجات في جميع الفئات
                    </p>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg py-6">
                      استكشف الأقسام
                    </Button>
                  </div>
                </div>
              </Link>

              {/* Branches Card */}
              <Link href="/branches">
                <div className="group cursor-pointer bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <MapPin className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-lg" />
                    <h3 className="text-4xl font-black text-white mb-3">فروعنا</h3>
                    <p className="text-xl text-blue-50 font-medium">تعرف على فروعنا ومواقعها</p>
                  </div>
                  <div className="p-8 text-center bg-gradient-to-b from-white to-blue-50">
                    <p className="text-gray-700 text-lg mb-6">
                      زوروا أحد فروعنا الثلاثة في مواقع مختلفة
                    </p>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-6">
                      اكتشف الفروع
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Company Image Section - تسوق بذكاء */}
        <section className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 py-8 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="container relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="text-white">
                  <h2 className="text-2xl md:text-3xl font-black mb-2 md:mb-3">
                    <span className="text-white">تسوق بذكاء</span>
                  </h2>
                  <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-3">
                    <span className="text-yellow-900">ووفر أكثر</span>
                  </h3>
                  <p className="text-sm md:text-base text-yellow-50 mb-2 leading-relaxed">
                    اكتشف عروضنا الحصرية واحصل على أفضل الأسعار في السوق.
                  </p>
                  <p className="text-xs md:text-sm text-yellow-100 leading-relaxed">
                    مع خمسة نون العربية، أنت دائماً في المقدمة.
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl p-2">
                  <img 
                    src="/branch-main.jpg"
                    alt="شركة خمسة نون العربية"
                    className="w-full h-auto rounded-xl object-cover max-h-40 md:max-h-48"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
