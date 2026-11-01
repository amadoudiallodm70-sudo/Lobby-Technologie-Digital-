import React from 'react';
import { Cpu, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="border-t border-blue-900/40 bg-[#050713] text-slate-400 text-xs">
      
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Col 1 & 2: Brand & Presentation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#080c1d] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold text-white">
                LOBBY <span className="text-cyan-400">TECHNOLOGIE</span> DIGITAL
              </span>
              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                Excellence Numérique en Guinée
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            « Transformez vos idées en créations extraordinaires grâce à l'intelligence artificielle. »
            Plateforme professionnelle de formations pratiques, laboratoire d'IA et boutique de produits digitaux conformes.
          </p>

          <p className="text-xs font-bold text-cyan-400 tracking-wider">
            APPRENDRE • CRÉER • INNOVER • GAGNER
          </p>

          {/* Payment guarantees */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-[10px]">
              Orange Money Guinée (*144#)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-extrabold text-[10px]">
              PayCard Guinée
            </span>
          </div>
        </div>

        {/* Col 3: Navigation Principale */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectTab('home')} className="hover:text-cyan-400 transition text-left">
                Accueil
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('about')} className="hover:text-cyan-400 transition text-left">
                À propos de nous
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-cyan-400 transition text-left">
                Nos Formations
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('ai-lab')} className="hover:text-cyan-400 transition text-left">
                Laboratoire IA
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('services')} className="hover:text-cyan-400 transition text-left">
                Nos Services Professionnels
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('resources')} className="hover:text-cyan-400 transition text-left">
                Bibliothèque & Ressources
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('pricing')} className="hover:text-cyan-400 transition text-left">
                Nos Tarifs & Abonnements
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('contact')} className="hover:text-cyan-400 transition text-left">
                Contact & Devis
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Formations Populaires */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Pôles d'Excellence
          </h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-purple-400 transition text-left">
                Intelligence Artificielle & Automatisation
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-purple-400 transition text-left">
                Création Vidéo IA (Veo 3 & Vidogrip)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-purple-400 transition text-left">
                Studio Graphique & Design Visuel
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-purple-400 transition text-left">
                Monétisation TikTok, YouTube & Facebook
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('courses')} className="hover:text-purple-400 transition text-left">
                Bureautique & Informatique Pro
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('pricing')} className="hover:text-cyan-400 transition text-left flex items-center space-x-1">
                <span>Pass Premium & Expert</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-bold">PRO</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 5: Coordonnées Officielles */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Contact Officiel
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp : <strong>611 55 44 71</strong></span>
            </div>
            <div className="flex items-start space-x-2 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="truncate">amadoudiallodm70@gmail.com</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Conakry, République de Guinée</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-[#03040a] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} LOBBY TECHNOLOGIE DIGITAL. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Devise officielle : Franc Guinéen (GNF)</span>
            <span>•</span>
            <span className="flex items-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Paiement Sécurisé
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
