import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200 via-pink-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="relative px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Human API
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Intent-Based Collaboration
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              The intelligent connection engine that understands what you need.
              <br />
              Describe your goals — we'll find collaborators who truly fit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/profile")}
              className="text-lg px-10 py-7 rounded-xl font-display font-bold gap-2 group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Start Finding Matches
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/intent")}
              className="text-lg px-10 py-7 rounded-xl font-display font-bold border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
            >
              Quick Search
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12">
            {[
              { icon: Users, label: "Smart Matches", desc: "AI-powered compatibility" },
              { icon: Zap, label: "Instant Results", desc: "Get connections in seconds" },
              { icon: Sparkles, label: "Ethical AI", desc: "Privacy-first approach" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-1">
                  {label}
                </h3>
                <p className="text-sm text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
