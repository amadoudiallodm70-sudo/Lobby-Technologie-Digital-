import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  PlayCircle, 
  Flame, 
  Download,
  CreditCard
} from 'lucide-react';

interface HeroBannerProps {
  onExploreCourses: () => void;
  onOpenAILab: () => void;
  onExploreProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCourses,
  onOpenAILab,
  onExploreProducts,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Background cyber glowing ambient spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-purple-600/20 to-cyan-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 blur-[120px] -z-10 pointer-events-none" />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Official Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-inner shadow-blue-500/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>PLATEFORME OFFICIELLE GUINÉE • LOBBY TECHNOLOGIE DIGITAL</span>
          </div>
        </div>

        {/* Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Transformez vos idées en créations extraordinaires grâce à{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              l'intelligence artificielle.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Apprenez les compétences numériques de demain, créez des vidéos professionnelles, générez des images impressionnantes et développez vos activités grâce à nos formations et outils IA.
          </p>

          {/* Slogan pill */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-blue-950/60 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>APPRENDRE • CRÉER • INNOVER • GAGNER</span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>Explorer les Formations</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenAILab}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white font-semibold text-base transition shadow-lg shadow-cyan-950/30 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Mon Laboratoire IA</span>
            </button>

            <button
              onClick={onExploreProducts}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-medium text-base transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Boutique Produits</span>
            </button>
          </div>

          {/* Payment guarantees banner */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                OM
              </div>
              <div>
                <p className="text-xs font-bold text-white">Orange Money Guinée</p>
                <p className="text-[11px] text-slate-400">Paiement USSD & Push *144#</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">PayCard Guinée</p>
                <p className="text-[11px] text-slate-400">Carte & Wallet sécurisé</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Déblocage Automatique</p>
                <p className="text-[11px] text-slate-400">Accès immédiat après paiement</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Support WhatsApp 24/7</p>
                <p className="text-[11px] text-slate-400">Assistance au 611 55 44 71</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
