import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, UserCheck, Handshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConnectionResult } from "@/lib/api";
import ConnectionCard from "@/components/ConnectionCard";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = (location.state as { results?: ConnectionResult[] })?.results;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span
          className="font-display text-xl font-bold tracking-tight text-foreground cursor-pointer"
          onClick={() => navigate("/")}
        >
          Human API
        </span>
        <Button
          variant="ghost"
          onClick={() => navigate("/intent")}
          className="gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          New Search
        </Button>
      </nav>

      <main className="flex-1 px-6 py-12 max-w-3xl mx-auto w-full">
        <div className="space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Suggested Connections
            </h1>
            <p className="text-muted-foreground">
              People who align with your intent.
            </p>
          </div>

          {!results || results.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto">
                <Handshake className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                No compatible connections found.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/intent")}
                className="gap-2"
              >
                Try a different search
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
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
