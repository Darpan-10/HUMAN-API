import { UserCheck, Sparkles, Handshake } from "lucide-react";
import type { ConnectionResult } from "@/lib/api";

const tagConfig: Record<string, { icon: typeof UserCheck; className: string }> = {
  "Recommended Connection": { icon: Sparkles, className: "bg-accent text-accent-foreground" },
  "Compatible Match": { icon: Handshake, className: "bg-secondary text-secondary-foreground" },
  "Suggested Match": { icon: UserCheck, className: "bg-accent text-accent-foreground" },
};

interface Props {
  result: ConnectionResult;
  index: number;
}

const ConnectionCard = ({ result, index }: Props) => {
  const tag = tagConfig[result.tag] || tagConfig["Recommended Connection"];
  const TagIcon = tag.icon;

  return (
    <div
      className="rounded-xl border border-border bg-card p-6 space-y-3 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg">
            {result.name.charAt(0)}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            {result.name}
          </h3>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${tag.className}`}
        >
          <TagIcon className="w-3.5 h-3.5" />
          {result.tag}
        </span>
      </div>

      <p className="text-muted-foreground leading-relaxed pl-[52px]">
        {result.reason}
      </p>
    </div>
  );
};

export default ConnectionCard;
