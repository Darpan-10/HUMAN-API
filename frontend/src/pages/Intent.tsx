import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { findConnections, type ConnectionResult } from "@/lib/api";
import { toast } from "sonner";

const Intent = () => {
  const navigate = useNavigate();
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!intent.trim()) {
      toast.error("Please describe what you're looking for");
      return;
    }

    setLoading(true);
    try {
      const results = await findConnections(intent.trim());
      navigate("/results", { state: { results } });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast.error("Request timed out. Is the backend running?");
      } else if (error instanceof TypeError) {
        toast.error("Could not reach the server. Is the backend running?");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200 via-purple-200 to-transparent rounded-full blur-3xl opacity-30" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="relative px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      </nav>

      {/* Main content */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-10 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight leading-none">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
              Tell us what you're looking for, and we'll find the best collaborators for your project.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-5">
            <div className="relative">
              <Textarea
                placeholder="Looking for a React expert to build a dashboard? A designer with 5+ years of experience? Tell us what you need..."
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="min-h-[180px] text-base resize-none rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:ring-0 bg-white/80 backdrop-blur-xl placeholder-gray-400 font-medium transition-all duration-300"
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500 font-medium">
                {intent.length} characters
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !intent.trim()}
              className="w-full py-7 text-lg font-display font-bold gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Searching for matches…
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Find Connections
                </>
              )}
            </Button>
          </div>

          {/* Examples */}
          <div className="pt-6 border-t border-purple-200">
            <p className="text-sm text-gray-600 font-semibold mb-4">Example searches:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Full-stack developer with React & Node.js experience",
                "UI/UX designer for mobile app startup",
                "Product manager with fintech background",
                "Data scientist experienced in ML models"
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setIntent(example)}
                  className="p-4 text-left rounded-xl bg-white/60 hover:bg-white border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md group"
                >
                  <p className="text-sm text-gray-700 font-medium group-hover:text-purple-600 transition-colors line-clamp-2">
                    {example}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intent;
