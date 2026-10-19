import React, { useRef, useEffect } from 'react';
import { GitCommit, ExternalLink, ArrowRight } from 'lucide-react';

interface CommitItem {
  sha: string;
  shortSha: string;
  repo: string;
  message: string;
  date: string;
  url: string;
}

interface CommitTickerProps {
  commits: CommitItem[];
}

export default function CommitTicker({ commits }: CommitTickerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // Duplicate list to achieve continuous loop
  const displayCommits = commits.length > 0 ? [...commits, ...commits, ...commits] : [];

  return (
    <div className="w-full bg-[#030406] overflow-hidden select-none py-3.5 group">
      <div className="max-w-7xl mx-auto px-6 mb-2 flex items-center justify-between text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-300 font-bold">Canlı Commit Akışı</span>
          <span className="text-zinc-700">·</span>
          <span>Son Atılan İtme &amp; Değişiklik Telemetrisi</span>
        </div>
        <span className="text-[11px] text-zinc-600 hidden sm:inline">Durdurmak için üzerine gelin</span>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left & Right gradient masks */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030406] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030406] to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollerRef}
          className="flex items-center gap-6 whitespace-nowrap animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]"
          style={{
            animation: 'tickerFlow 35s linear infinite',
          }}
        >
          {displayCommits.map((c, idx) => (
            <a
              key={`${c.sha}-${idx}`}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#080b10] hover:bg-[#101520] text-xs font-mono text-zinc-300 transition-colors shrink-0 group/item"
            >
              <span className="px-1.5 py-0.5 bg-white/10 text-emerald-400 font-bold text-[11px]">
                {c.shortSha}
              </span>
              <span className="text-white font-medium">
                {c.repo}
              </span>
              <span className="text-zinc-600">:</span>
              <span className="text-zinc-300 max-w-xs md:max-w-sm truncate">
                {c.message}
              </span>
              <span className="text-zinc-600 text-[10px]">
                ({new Date(c.date).toLocaleDateString('tr-TR')})
              </span>
              <ExternalLink className="w-3 h-3 text-zinc-500 group-hover/item:text-emerald-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes tickerFlow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
