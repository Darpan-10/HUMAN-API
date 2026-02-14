import { UserCheck, Sparkles, Handshake, TrendingUp } from "lucide-react";
import type { ConnectionResult } from "@/lib/api";

const tagConfig: Record<string, { icon: typeof UserCheck; className: string; bgColor: string }> = {
  "Recommended Connection": {
    icon: Sparkles,
    className: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200",
    bgColor: "from-purple-600 to-pink-600"
  },
  "Compatible Match": {
    icon: Handshake,
    className: "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200",
    bgColor: "from-orange-600 to-yellow-500"
  },
  "Suggested Match": {
    icon: UserCheck,
    className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    bgColor: "from-green-600 to-emerald-600"
  },
};

// Mock expertise data - in a real app, this would come from the API
const mockExpertise = [
  { skill: "React", level: 85 },
  { skill: "Design", level: 72 },
  { skill: "Leadership", level: 88 },
  { skill: "Backend", level: 65 },
];

interface Props {
  result: ConnectionResult;
  index: number;
}

const ConnectionCard = ({ result, index }: Props) => {
  const tag = tagConfig[result.tag] || tagConfig["Recommended Connection"];
  const TagIcon = tag.icon;

  return (
    <div
      className="group rounded-2xl border-2 border-purple-100 hover:border-purple-300 bg-white/80 backdrop-blur-xl p-6 space-y-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${tag.bgColor} rounded-full blur-md opacity-30`} />
            <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${tag.bgColor} flex items-center justify-center text-white font-display font-bold text-xl`}>
              {result.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-gray-900">
              {result.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">Collaborator</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${tag.className}`}>
          <TagIcon className="w-4 h-4" />
          {result.tag}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed font-medium">
        {result.reason}
      </p>

      {/* Expertise Graph */}
      <div className="pt-4 border-t border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <p className="text-sm font-bold text-gray-900">Expertise Areas</p>
        </div>

        <div className="space-y-3">
          {mockExpertise.map((exp) => (
            <div key={exp.skill} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {exp.skill}
                </span>
                <span className="text-xs font-bold text-purple-600">
                  {exp.level}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${exp.level}%`,
                    animation: `slideIn 0.8s ease-out forwards`,
                    animationDelay: `${index * 100 + (mockExpertise.indexOf(exp) * 50)}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action button */}
      <button className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-lg active:scale-95">
        Connect with {result.name.split(' ')[0]}
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: var(--final-width);
          }
        }
      `}</style>
    </div>
  );
};

export default ConnectionCard;
