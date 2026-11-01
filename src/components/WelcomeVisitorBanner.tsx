import React from 'react';
import { 
  Sparkles, 
  UserPlus, 
  LogIn, 
  CheckCircle2, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WelcomeVisitorBanner: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  // If already authenticated, no need for the first-time welcome invitation
  if (user) return null;

  return (
    <div className="relative overflow-hidden border-b border-blue-500/20 bg-gradient-to-r from-[#090e28] via-[#0f153d] to-[#0a0e28] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-600/15 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left column: Welcome Message & Presentation */}
        <div className="space-y-4 max-w-2xl text-center lg:text-left">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>ESPACE D'ACCUEIL DES NOUVEAUX VISITEURS</span>
          </div>

          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#090d22] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              LOBBY <span className="text-cyan-400">TECHNOLOGIE</span> DIGITAL
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            « Bienvenue chez LOBBY TECHNOLOGIE DIGITAL ! Découvrez un univers de formations numériques, d'intelligence artificielle et de ressources professionnelles. Créez votre compte pour accéder à notre plateforme et développer vos compétences. »
          </p>

          <p className="text-xs text-slate-400">
            Formations pratiques, Laboratoire IA certifié, boutique de documents juridiques OHADA, bibles de prompts et paiements instantanés en Guinée par Orange Money (*144#) et PayCard.
          </p>
        </div>

        {/* Right column: Benefits card & CTAs */}
        <div className="w-full lg:w-auto p-6 rounded-3xl bg-[#070b1e]/90 border border-blue-500/30 shadow-2xl space-y-5 shrink-0 max-w-md">
          <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider block">
            Pourquoi créer votre compte dès aujourd'hui ?
          </span>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accès exclusif au laboratoire d'outils d'intelligence artificielle</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Visionnage des formations certifiantes & modules vidéo</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Téléchargement immédiat et factures officielles en GNF</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Assistance prioritaire sur WhatsApp au 611 55 44 71</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => openAuthModal('register')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>CRÉER MON COMPTE</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4 text-cyan-400" />
              <span>SE CONNECTER</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
