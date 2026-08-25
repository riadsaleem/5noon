import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, MapPin, Phone } from "lucide-react";

export default function Branches() {
  const formatPhoneNumber = (phone: string) => {
    // Format phone number like "+966 55 325 3688"
    return phone.replace(/(\+\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  };

  const { data: branches, isLoading } = trpc.branches.list.useQuery();

  const getGradientColor = (branchName: string) => {
    if (branchName.includes("خمسة نون") || branchName.includes("نون")) {
      return "from-yellow-400 via-yellow-500 to-yellow-600";
    } else if (branchName.includes("زهرة") && branchName.includes("الخرمة")) {
      // زهرة فرع الخرمة - بنفسجي غامق
      return "from-purple-700 via-purple-800 to-purple-900";
    } else if (branchName.includes("زهرة") || branchName.includes("محطم")) {
      // زهرة فرع وادي الدواسر - بنفسجي فاتح
      return "from-purple-300 via-purple-400 to-purple-500";
    }
    return "from-blue-400 via-blue-500 to-blue-600";
  };

  const getBranchLogo = (branchName: string) => {
    if (branchName.includes("خمسة نون") || branchName.includes("نون")) {
      return "/logos/noon-logo.png";
    } else if (branchName.includes("زهرة") || branchName.includes("محطم")) {
      return "/logos/zahra-logo.png";
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 bg-gradient-to-b from-yellow-50 to-white">
        <div className="container">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4 text-gray-900">
            فروعنا
          </h1>
          <p className="text-base md:text-xl text-center text-gray-600 mb-2 md:mb-4">
            نفتخر بخدمتكم في جميع فروعنا المنتشرة في مختلف المناطق
          </p>
          <p className="text-sm md:text-lg text-center text-gray-500 mb-6 md:mb-12">
            زوروا أحد فروعنا المنتشرة في مواقع مختلفة
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : branches && branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div 
                  key={branch.id}
                  className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-4 border-yellow-400"
                >
                  {branch.imageUrl && (
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={branch.imageUrl} 
                        alt={branch.nameAr}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Logo in Bottom Left Corner */}
                      {getBranchLogo(branch.nameAr) && (
                        <div className="absolute bottom-3 left-3 bg-white rounded-full p-1.5 shadow-xl">
                          <img 
                            src={getBranchLogo(branch.nameAr)!} 
                            alt={`${branch.nameAr} logo`}
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Gradient Box Below Image - Fixed Height */}
                  <div className={`bg-gradient-to-r ${getGradientColor(branch.nameAr)} p-4 min-h-[80px] flex items-center justify-center`}>
                    <h3 className="text-xl font-bold text-white text-center drop-shadow-lg">
                      {branch.nameAr}
                    </h3>
                  </div>
                  
                  <div className="p-5">
                    
                    <div className="space-y-2 bg-gradient-to-br from-yellow-50 to-white p-3 rounded-xl">
                      {branch.address && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600" />
                          <span className="text-xs">{branch.address}</span>
                        </div>
                      )}
                      
                      {branch.phone && (
                        <a 
                          href={`tel:${branch.phone}`}
                          className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors cursor-pointer"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0 text-yellow-600" />
                          <span className="text-xs" dir="ltr">{formatPhoneNumber(branch.phone)}</span>
                        </a>
                      )}
                    </div>
                    
                    {branch.googleMapsUrl && (
                      <div className="mt-3">
                        <a 
                          href={branch.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            if (branch.googleMapsUrl) {
                              window.open(branch.googleMapsUrl, '_blank');
                            }
                          }}
                          className={`block w-full bg-gradient-to-r ${getGradientColor(branch.nameAr)} hover:opacity-90 text-white text-center py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-sm`}
                        >
                          عرض الموقع
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">لا توجد فروع متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
