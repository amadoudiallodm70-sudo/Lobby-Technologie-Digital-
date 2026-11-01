import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Headphones, 
  Award, 
  DownloadCloud,
  CheckCircle2
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const benefits = [
    {
      icon: Smartphone,
      title: "Paiement Mobile Money Simplifié",
      desc: "Réglez vos commandes directement en Francs Guinéens (GNF) via Orange Money (*144#) et PayCard sans carte bancaire internationale."
    },
    {
      icon: Zap,
      title: "Déblocage Automatique Instantané",
      desc: "Dès validation de votre paiement, l'accès à vos vidéos et vos liens de téléchargement sécurisés sont déverrouillés sans attente."
    },
    {
      icon: DownloadCloud,
      title: "Téléchargement & Accès à Vie",
      desc: "Accédez à vos modules et documents depuis votre téléphone Android, iPhone ou ordinateur de bureau, 24h/24 et 7j/7."
    },
    {
      icon: Award,
      title: "Programmes Conformes au Marché",
      desc: "Des formations orientées résultats, adaptées aux réalités économiques guinéennes et ouest-africaines (OHADA, e-commerce local, etc.)."
    },
    {
      icon: Headphones,
      title: "Assistance WhatsApp Dédiée",
      desc: "Notre équipe vous accompagne en direct au 611 55 44 71 pour résoudre toute difficulté technique ou répondre à vos questions."
    },
    {
      icon: ShieldCheck,
      title: "Laboratoire IA de Pointe",
      desc: "Profitez d'un accès à des générateurs de prompts, scripts vidéo viraux et outils assistés par intelligence artificielle de niveau mondial."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/60 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Pourquoi Choisir Lobby Technologie</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          L'Excellence Numérique au Service de Votre Réussite
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Une plateforme moderne conçue pour accélérer vos compétences et vous permettre de générer des revenus en Guinée et à l'international.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#0c1026] to-[#070916] border border-blue-950 hover:border-cyan-500/40 transition duration-300 space-y-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-md shadow-blue-950/40">
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                {b.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {b.desc}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
};
