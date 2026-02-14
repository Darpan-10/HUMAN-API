import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Handshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConnectionResult } from "@/lib/api";
import ConnectionCard from "@/components/ConnectionCard";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = (location.state as { results?: ConnectionResult[] })?.results;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-white to-yellow-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-200 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-yellow-200 via-green-200 to-transparent rounded-full blur-3xl opacity-30" style={{ animationDelay: '1s' }} />
      </div>

      {/* Nav */}
      <nav className="relative px-6 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
            Human API
          </span>
        </div>
        <Button
          onClick={() => navigate("/intent")}
          className="gap-2 font-semibold bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          New Search
        </Button>
      </nav>

      {/* Main content */}
      <main className="relative flex-1 px-6 py-8 max-w-6xl mx-auto w-full overflow-y-auto">
        <div className="space-y-10 animate-fade-in pb-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                Recommended Collaborators
              </span>
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {results && results.length > 0
                ? `Found ${results.length} collaborators`
                : 'Engineers aligned with your goals'}
            </p>
          </div>

          {!results || results.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center mx-auto">
                <Handshake className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  No collaborators found
                </p>
                <p className="text-gray-600 font-medium">
                  Try adjusting your search criteria or describe what you're looking for in different terms.
                </p>
              </div>
              <Button
                onClick={() => navigate("/intent")}
                className="gap-2 bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 text-white font-semibold rounded-lg"
              >
                Try a different search
              </Button>
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
              {results.map((result, i) => (
                <ConnectionCard key={i} result={result} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Results;
