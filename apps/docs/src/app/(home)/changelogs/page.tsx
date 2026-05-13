import { Bug, Sparkles, Wrench, ChevronRight } from "lucide-react";

const releases = [
  {
    version: "0.1.1",
    date: "May 2024",
    title: "The Scope Expansion",
    changes: [
      { type: "feat", text: "Global transition to @axeom scope for framework parity" },
      { type: "feat", text: "Introduction of @axeom/framework as the primary meta-package" },
      { type: "fix", text: "Resolved NPM typosquatting conflicts for core packages" },
      { type: "chore", text: "Standardized TypeScript 6.0 compatibility across monorepo" },
    ],
  },
  {
    version: "0.1.0",
    date: "May 2024",
    title: "Initial Launch",
    changes: [
      { type: "feat", text: "Release of the Weightless Web Engine core architecture" },
      { type: "feat", text: "Deployment of 12+ plugins including Swagger, Auth, and WS" },
      { type: "feat", text: "Native adapter support for Bun, Node.js (Express), and Web Standards" },
      { type: "feat", text: "Zero-dependency type safety via @axeom/schema" },
    ],
  },
];

export default function ChangelogsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/10 selection:text-white transition-colors duration-300 relative overflow-hidden font-sans">
      {/* Heavy Blueprint Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:128px_128px]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_80%)]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-32">
        {/* Header Section */}
        <div className="mb-24 relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
              System Updates
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic uppercase">
            Logs<span className="text-white">.</span>
          </h1>
          <p className="text-white/40 text-sm max-w-md leading-relaxed font-mono uppercase tracking-wider">
            Tracking the evolution of the weightless engine. Every byte accounted for.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Marker */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block" />

          <div className="space-y-32">
            {releases.map((release) => (
              <div key={release.version} className="relative md:pl-24 group">
                {/* Timeline Indicator (MD only) */}
                <div className="absolute left-0 top-3 w-4 h-px bg-white group-hover:w-12 transition-all duration-500 hidden md:block" />
                
                <div className="flex flex-col md:flex-row gap-12">
                  {/* Meta - Date & Version */}
                  <div className="md:w-48 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-2 py-0.5 border border-white/10 bg-white/5 text-[10px] font-mono tracking-tighter uppercase">
                        Stable
                      </div>
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        {release.date}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter uppercase italic italic">
                      v{release.version}
                    </h2>
                  </div>

                  {/* Changes Container */}
                  <div className="flex-1 space-y-8">
                    <div className="border-l border-white/10 pl-8 relative">
                      <h3 className="text-lg font-bold uppercase tracking-tight mb-8 text-white/90">
                        {release.title}
                      </h3>

                      <ul className="grid gap-6">
                        {release.changes.map((change, i) => (
                          <li key={i} className="flex items-start gap-6 group/item">
                            <div className="mt-1 flex-shrink-0">
                              {change.type === "feat" ? (
                                <div className="w-2 h-2 bg-white rotate-45 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                              ) : change.type === "fix" ? (
                                <div className="w-2 h-2 border border-white/40 rotate-45 group-hover/item:border-white transition-colors" />
                              ) : (
                                <div className="w-2 h-2 border-b border-r border-white/20 rotate-45" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/30 block">
                                {change.type === "feat" ? "Enhancement" : change.type === "fix" ? "Correction" : "Operation"}
                              </span>
                              <p className="text-sm text-white/60 group-hover/item:text-white transition-colors leading-relaxed">
                                {change.text}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Decorative Line */}
                    <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Terminal Section */}
        <div className="mt-48 p-12 border border-white/5 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h4 className="text-xl font-bold uppercase italic tracking-tighter">Stay Synchronized</h4>
              <p className="text-sm text-white/40 font-mono">Watch the repository for real-time updates.</p>
            </div>
            <button className="px-8 py-4 bg-white text-black text-xs font-mono uppercase tracking-[0.3em] font-bold hover:bg-white/90 transition-colors flex items-center gap-3">
              GitHub Repo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

