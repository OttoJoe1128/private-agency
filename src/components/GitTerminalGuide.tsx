import { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, HelpCircle, AlertTriangle, ShieldCheck, GitBranch } from 'lucide-react';

interface GitTerminalGuideProps {
  githubUsername: string;
  setGithubUsername: (name: string) => void;
  repoName: string;
  setRepoName: (repo: string) => void;
}

export default function GitTerminalGuide({
  githubUsername,
  setGithubUsername,
  repoName,
  setRepoName,
}: GitTerminalGuideProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [terminalLogInput, setTerminalLogInput] = useState<string>('');
  const [logAnalysis, setLogAnalysis] = useState<{ status: 'success' | 'warning' | 'error' | 'idle'; message: string; solution: string } | null>(null);

  const gitUrl = `https://github.com/${githubUsername || 'kullanici_adiniz'}/${repoName || 'engineering-living-systems'}.git`;

  const steps = [
    {
      title: '1. Git Deposunu Başlat',
      command: 'git init',
      desc: 'Proje ana dizininde yerel bir git sürüm kontrol deposu oluşturur.',
    },
    {
      title: '2. Tüm Dosyaları Evreye Ekle',
      command: 'git add .',
      desc: 'Kaynak kodları, bileşenleri ve yapılandırmaları commit evresine alır.',
    },
    {
      title: '3. İlk Mimari Sürümünü İşle',
      command: 'git commit -m "feat: initial engineering living systems portfolio architecture"',
      desc: 'Awwwards seviyesi editoryal ajans projesini ilk commit olarak dondurur.',
    },
    {
      title: '4. Ana Dalı Belirle',
      command: 'git branch -M main',
      desc: 'Varsayılan dağıtım dalını "main" olarak adlandırır.',
    },
    {
      title: '5. Uzak GitHub Reposunu Bağla',
      command: `git remote add origin ${gitUrl}`,
      desc: 'GitHub üzerinde oluşturduğunuz yeni boş depoyu uzak hedef olarak atar.',
    },
    {
      title: '6. Kodları GitHub\'a İt (Push)',
      command: 'git push -u origin main',
      desc: 'Tüm sistemi GitHub sunucularına aktarır.',
    },
  ];

  const fullScript = `# Engineering Living Systems - GitHub Dağıtım Komut Seti
git init
git add .
git commit -m "feat: initial engineering living systems portfolio architecture"
git branch -M main
git remote add origin ${gitUrl}
git push -u origin main`;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullScript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const analyzeTerminalLog = () => {
    const log = terminalLogInput.trim().toLowerCase();
    if (!log) {
      setLogAnalysis({
        status: 'idle',
        message: 'Lütfen terminalinizdeki çıktıyı yapıştırın.',
        solution: 'Terminal konsolunuzdaki hata veya durum çıktısını yukarıdaki alana girin.',
      });
      return;
    }

    if (log.includes('remote origin already exists')) {
      setLogAnalysis({
        status: 'warning',
        message: 'Uzak Depo (remote origin) Zaten Tanımlı',
        solution: 'Mevcut uzak bağlantıyı güncellemek için şu komutu çalıştırın: \n`git remote set-url origin ' + gitUrl + '` ve ardından `git push -u origin main` yapın.',
      });
    } else if (log.includes('permission denied (publickey)') || log.includes('authentication failed')) {
      setLogAnalysis({
        status: 'error',
        message: 'GitHub Kimlik Doğrulama / Yetki Hatası',
        solution: 'GitHub şifreleri doğrudan kabul etmez. GitHub Settings > Developer Settings > Personal Access Tokens (Classic) üzerinden "repo" yetkili bir PAT oluşturup şifre yerine kullanın veya SSH anahtarı tanımlayın.',
      });
    } else if (log.includes('updates were rejected because the remote contains work') || log.includes('fetch first')) {
      setLogAnalysis({
        status: 'warning',
        message: 'Uzak Depoda Farklı Commitler Var (README vb.)',
        solution: 'GitHub üzerinde README veya .gitignore seçtiyseniz uzak depoda commit oluşmuştur. Eşitlemek için: \n`git pull origin main --rebase` ardından `git push origin main` çalıştırın.',
      });
    } else if (log.includes('everything up-to-date') || log.includes('branch \'main\' set up to track')) {
      setLogAnalysis({
        status: 'success',
        message: 'Başarılı: Kodlar GitHub Reposuna Aktarıldı',
        solution: 'Deponuz GitHub üzerinde canlı! Artık Vercel, Cloudflare Pages veya GitHub Pages üzerinden tek tıkla canlıya alabilirsiniz.',
      });
    } else {
      setLogAnalysis({
        status: 'warning',
        message: 'Özel Terminal Çıktısı İncelendi',
        solution: 'Çıktınızda kritik bir genel hata tespit edilmedi. Komutları sırayla çalıştırdığınızdan ve GitHub üzerinde aynı isimle boş bir repo oluşturduğunuzdan emin olun.',
      });
    }
  };

  return (
    <section id="git-deploy" className="py-20 border-b border-white/10 bg-[#090b0e]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              <span>Sürüm Kontrolü &amp; Dağıtım</span>
              <span aria-hidden="true">·</span>
              <span>Terminal Destek Konsolu</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              GitHub Reposuna Aktarım Kılavuzu
            </h2>
          </div>
          <div className="max-w-md text-xs font-mono text-zinc-400 bg-[#060709] p-4 border border-white/10">
            <span className="text-amber-400 font-bold block mb-1">ŞEFFAFLIK PRENSİBİ:</span>
            Sistem yerel dosyalarınızı veya GitHub hesabınızı doğrudan göremez; paylaştığınız terminal çıktıları üzerinden deterministik olarak yönlendirir.
          </div>
        </div>

        {/* Repository Configurator Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-[#060709] border border-white/10 mb-8">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              GitHub Kullanıcı Adınız:
            </label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Örn: sircaedebiyat"
              className="w-full bg-[#0b0e14] border border-white/15 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              Oluşturacağınız Yeni GitHub Repo Adı:
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Örn: engineering-living-systems"
              className="w-full bg-[#0b0e14] border border-white/15 px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* 2-Column: Left Step-by-Step, Right Terminal Log Analyzer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-zinc-400">
              <span>TERMINAL_COMMAND_SEQUENCE</span>
              <button
                onClick={handleCopyAll}
                className="px-3 py-1.5 border border-white/20 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Tüm Komutlar Kopyalandı' : 'Tümünü Kopyala (Script)'}</span>
              </button>
            </div>

            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#060709] border border-white/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-zinc-400">{step.title}</span>
                  <button
                    onClick={() => handleCopy(step.command, idx)}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Kopyalandı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Kopyala
                      </span>
                    )}
                  </button>
                </div>
                <div className="bg-[#0b0e14] p-2.5 font-mono text-xs text-white border border-white/5 select-all overflow-x-auto">
                  $ {step.command}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-1.5">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Right Column: Terminal Output Log Diagnoser */}
          <div className="lg:col-span-5 bg-[#060709] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pb-3 border-b border-white/10 mb-4">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>TERMINAL ÇIKTISI ANALİZ VE DESTEK KONSOLU</span>
              </div>

              <p className="text-xs text-zinc-400 mb-4 font-normal leading-relaxed">
                Terminalinizde komutları çalıştırırken karşılaştığınız herhangi bir hata mesajını veya çıktıyı buraya yapıştırın. Sistem çıktıyı analiz ederek gereken düzeltme adımını sunacaktır.
              </p>

              <textarea
                rows={6}
                value={terminalLogInput}
                onChange={(e) => setTerminalLogInput(e.target.value)}
                placeholder="Terminal çıktınızı buraya yapıştırın (Örn: fatal: remote origin already exists)..."
                className="w-full bg-[#0b0e14] border border-white/15 p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-white mb-4"
              />

              <button
                type="button"
                onClick={analyzeTerminalLog}
                className="w-full py-2.5 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Çıktıyı Teşhis Et
              </button>
            </div>

            {/* Analysis Result */}
            {logAnalysis && (
              <div
                className={`mt-6 p-4 border text-xs font-mono ${
                  logAnalysis.status === 'success'
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                    : logAnalysis.status === 'error'
                    ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                    : 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-2">
                  {logAnalysis.status === 'error' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{logAnalysis.message}</span>
                </div>
                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed mt-2">
                  {logAnalysis.solution}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
              GÜVENLİK PROTOKOLÜ: Özel token veya şifrelerinizi asla genel alanlara yapıştırmayın.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
