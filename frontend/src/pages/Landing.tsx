import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-white to-yellow-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-200 via-yellow-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-display text-4xl font-black tracking-tighter bg-gradient-to-r from-green-600 via-lime-600 to-yellow-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate("/")}>
          &lt;DEV / DEX&gt;
        </span>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{user.name}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 flex items-center justify-center px-6 pb-12">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-100 to-yellow-100 border border-green-200 text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Intent-Based Collaboration
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-green-600 via-lime-600 to-yellow-500 bg-clip-text text-transparent">
                Connect With
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
                The Collaborators
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              The intelligent connection engine that understands what you need.
              <br />
              Describe your goals — we'll find collaborators who truly fit.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => navigate(user ? "/intent" : "/register")}
            className="text-lg px-8 py-6 rounded-xl font-display font-semibold gap-2 group"
          >
            {user ? "Find Collaborators" : "Get Started"}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12">
            {[
              { icon: Users, label: "Smart Matches", desc: "AI-powered compatibility" },
              { icon: Zap, label: "Instant Results", desc: "Get connections in seconds" },
              { icon: Sparkles, label: "Ethical AI", desc: "Privacy-first approach" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all">
                  <Icon className="w-6 h-6 text-green-600" />
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
