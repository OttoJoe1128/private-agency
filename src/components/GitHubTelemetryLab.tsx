import React, { useState, useEffect } from 'react';
import GitHub3DMatrix from './GitHub3DMatrix.tsx';
import CommitTicker from './CommitTicker.tsx';
import RnDLabBento from './RnDLabBento.tsx';
import { Github, GitPullRequest, Code2, Terminal, Layers } from 'lucide-react';

interface GitHubData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  totalContributions: number;
  weeks: any[];
  recentCommits: any[];
  languages: Array<{ name: string; color: string; percentage: number }>;
}

export default function GitHubTelemetryLab() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/github')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to fetch github telemetry:', err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="manifesto" className="py-20 md:py-28 border-b border-white/10 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
              <Github className="w-4 h-4 text-white" />
              <span className="text-white font-bold">3D GitHub Telemetrisi &amp; R&amp;D Lab</span>
              <span className="text-zinc-700">·</span>
              <span className="text-emerald-400">Canlı Sistem Aktivitesi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
              Açık Kaynak Kod &amp; Telemetri Matrisi
            </h2>
          </div>

          {/* User Metrics & Telemetry Bar */}
          <div className="bg-[#090b0e] border border-white/10 p-4 font-mono text-xs text-zinc-400 flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">KULLANICI:</span>
              <span className="text-white font-bold">@{data?.username || 'OttoJoe1128'}</span>
            </div>
            <div className="border-l border-white/10 pl-6">
              <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">YILLIK KATKI:</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {data?.totalContributions ? data.totalContributions.toLocaleString() : '1,428'} Commit / PR
              </span>
            </div>
            <div className="border-l border-white/10 pl-6">
              <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">ÖNBELLEK:</span>
              <span className="text-sky-400 font-bold">3600s Edge ISR</span>
            </div>
          </div>
        </div>

        {/* Language Breakdown Strip */}
        {data?.languages && data.languages.length > 0 && (
          <div className="mb-6 bg-[#080b10] border border-white/10 p-4 font-mono text-xs">
            <div className="flex items-center justify-between mb-2 text-zinc-400">
              <span className="text-[11px] text-zinc-500 uppercase">Baskın Programlama Dilleri:</span>
              <span className="text-[11px] text-zinc-500">GraphQL Telemetri Analizi</span>
            </div>
            <div className="h-2 w-full bg-[#121620] flex overflow-hidden mb-3">
              {data.languages.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color || '#38bdf8',
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-zinc-300">
                  <span
                    className="w-2.5 h-2.5 shrink-0"
                    style={{ backgroundColor: lang.color || '#38bdf8' }}
                  />
                  <span className="text-white font-medium">{lang.name}</span>
                  <span className="text-zinc-500 tabular-nums">({lang.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. 3D Contribution Matrix (R3F Monoliths) */}
        <div className="mb-8">
          <GitHub3DMatrix weeks={data?.weeks || []} />
        </div>

        {/* 2. Live Kinetic Commit Ticker */}
        <div className="mb-8">
          <CommitTicker commits={data?.recentCommits || []} />
        </div>

        {/* 3. R&D Lab Asymmetric Bento Grid */}
        <RnDLabBento />

      </div>
    </section>
  );
}
