import { UserCheck, Sparkles, Handshake, TrendingUp } from "lucide-react";
import type { ConnectionResult } from "@/lib/api";

const tagConfig: Record<string, { icon: typeof UserCheck; className: string; bgColor: string }> = {
  "Explore": {
    icon: Sparkles,
    className: "bg-gradient-to-r from-lime-100 to-yellow-100 text-green-700 border border-green-200",
    bgColor: "from-green-600 to-lime-600"
  },
  "Medium Alignment": {
    icon: Handshake,
    className: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
    bgColor: "from-yellow-600 to-amber-600"
  },
  "High Alignment": {
    icon: UserCheck,
    className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200",
    bgColor: "from-green-600 to-emerald-600"
  },
};

interface Props {
  result: ConnectionResult;
  index: number;
}

const ConnectionCard = ({ result, index }: Props) => {
  const tag = tagConfig[result.tag] || tagConfig["Explore"];
  const TagIcon = tag.icon;

  // Use real expertise data from backend or fallback to empty array
  const expertise = result.expertise || [];

  return (
    <div
      className="group rounded-3xl border-2 border-green-100 hover:border-green-300 bg-white/80 backdrop-blur-xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden flex flex-col min-h-[450px] relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 -z-10" />

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
      <div className="pt-4 border-t border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <p className="text-sm font-bold text-gray-900">Expertise Areas</p>
        </div>

        <div className="space-y-3">
          {expertise.length > 0 ? (
            expertise.map((exp) => (
              <div key={exp.skill} className="space-y-1.5" title={`${exp.skill}: ${exp.level}%`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    {exp.skill}
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    {exp.level}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-lime-600 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${exp.level}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No specific skills listed</p>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="mt-auto pt-4">
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${result.email || ''}&su=Collaboration Opportunity - Human API&body=Hi ${result.name.split(' ')[0]}, I saw your profile on Human API and would love to connect and discuss a potential collaboration!`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center py-4 px-6 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700 transition-all duration-300 hover:shadow-lg active:scale-95 no-underline"
        >
          Chat with {result.name.split(' ')[0]}
        </a>
      </div>

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
