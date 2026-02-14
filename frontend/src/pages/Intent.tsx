import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span
          className="font-display text-xl font-bold tracking-tight text-foreground cursor-pointer"
          onClick={() => navigate("/")}
        >
          Human API
        </span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Connect with Collaborators
            </h1>
            <p className="text-muted-foreground">
              Describe the kind of collaborator you need.
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="What kind of collaborator are you looking for?"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="min-h-[160px] text-base resize-none"
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-6 text-base font-display font-semibold gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find Connections
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Intent;
