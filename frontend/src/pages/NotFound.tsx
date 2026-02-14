import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-200 to-transparent rounded-full blur-3xl opacity-30" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="text-center space-y-8 animate-fade-in px-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl blur-lg opacity-40" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main text */}
        <div className="space-y-3">
          <h1 className="font-display text-8xl sm:text-9xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed font-medium">
            Oops! We couldn't find the page you're looking for. Let's get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 px-8 py-7 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-2xl transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
          <Button
            onClick={() => navigate("/intent")}
            variant="outline"
            className="gap-2 px-8 py-7 text-lg font-bold rounded-xl border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Start Searching
          </Button>
        </div>

        {/* Route info */}
        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl border-2 border-purple-100 max-w-md">
          <p className="text-sm text-gray-600 font-medium">
            You tried to access: <code className="text-purple-600 font-bold">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
