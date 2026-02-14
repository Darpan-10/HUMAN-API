import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Human API
        </span>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Intent-Based Collaboration
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Human API
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Intent-Based Human Connection Engine.
            <br />
            Describe what you need — we'll find who fits.
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/profile")}
            className="text-lg px-8 py-6 rounded-xl font-display font-semibold gap-2 group"
          >
            Get Started
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            {[
              { icon: Users, label: "Suggested Matches" },
              { icon: Zap, label: "Instant Connections" },
              { icon: Sparkles, label: "Ethical Matching" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
