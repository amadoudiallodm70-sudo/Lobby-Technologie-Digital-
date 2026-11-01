import React from 'react';
import { 
  Cpu, 
  Target, 
  Eye, 
  Heart, 
  Award, 
  Users, 
  Globe2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Mail,
  MapPin
} from 'lucide-react';

interface AboutPageProps {
  onExploreCourses: () => void;
  onOpenAILab: () => void;
  onOpenContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onExploreCourses,
  onOpenAILab,
  onOpenContact,
}) => {
  const values = [
    {
      title: 'Excellence & Rigueur',
      desc: 'Nous offrons des formations et des outils conformes aux standards technologiques internationaux les plus exigeants.',
      icon: Award,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Accessibilité & Démocratisation',
      desc: 'Rendre l\'intelligence artificielle et le numérique accessibles à tous les Guinéens et Africains, sans barrière technique.',
      icon: Globe2,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Innovation Continue',
      desc: 'Intégration permanente des modèles d\'IA de pointe (Google Veo, Gemini, assistants neuronaux) pour garder une longueur d\'avance.',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Pragmatisme & Monétisation',
      desc: 'Chaque compétence enseignée est immédiatement orientée vers la création de valeur et la génération de revenus concrets.',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const team = [
    {
      name: 'Amadou Diallo',
      role: 'Directeur Général & Fondateur',
      bio: 'Visionnaire tech et architecte de la plateforme Lobby Technologie Digital. Passionné par l\'émancipation numérique de la jeunesse africaine.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badge: 'Direction'
    },
    {
      name: 'Ibrahima Sory Bah',
      role: 'Lead Intelligence Artificielle & R&D',
      bio: 'Ingénieur spécialisé dans les modèles génératifs d\'images et de vidéos (Google Veo, Stable Diffusion, LLMs) et le prompt engineering avancé.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      badge: 'Laboratoire IA'
    },
    {
      name: 'Fatoumata Binta Diallo',
      role: 'Responsable Pédagogique & Certifications',
      bio: 'Experte en e-learning et conception de programmes de formation professionnelle orientés compétences pratiques et insertion professionnelle.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      badge: 'Formations'
    },
    {
      name: 'Mohamed Lamine Camara',
      role: 'Chef de Support & Relations Partenaires',
      bio: 'Supervise l\'assistance client 24/7 sur WhatsApp et les intégrations de paiement mobile Orange Money et PayCard à Conakry.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      badge: 'Support & Conakry'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Hero Header */}
      <div className="relative text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>À PROPOS DE LOBBY TECHNOLOGIE DIGITAL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
          Bâtir l'avenir du numérique et de{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            l'intelligence artificielle en Afrique.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
          LOBBY TECHNOLOGIE DIGITAL est une entreprise technologique de référence en République de Guinée, dédiée à la formation professionnelle certifiante, à la création assistée par intelligence artificielle et à la distribution de ressources numériques d'élite.
        </p>

        {/* Slogan Badge */}
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-blue-950/70 to-purple-950/70 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-lg shadow-cyan-950/30">
          ⚡ APPRENDRE • CRÉER • INNOVER • GAGNER
        </div>
      </div>

      {/* Vision, Mission, Ambition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mission */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/30 relative overflow-hidden space-y-4 hover:border-cyan-400/60 transition group">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Notre Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Démocratiser l'accès aux compétences technologiques de pointe en offrant des formations pratiques pas-à-pas, des bibles de prompts et des outils de création IA directement intégrés, simples à utiliser sur smartphone et ordinateur.
          </p>
        </div>

        {/* Vision */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-blue-500/30 relative overflow-hidden space-y-4 hover:border-blue-400/60 transition group">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Notre Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Positionner la Guinée et l'Afrique de l'Ouest comme des acteurs majeurs de la révolution de l'intelligence artificielle en formant plus de 50 000 créateurs, développeurs, marketeurs et entrepreneurs autonomes d'ici 2030.
          </p>
        </div>

        {/* Ambition */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-purple-500/30 relative overflow-hidden space-y-4 hover:border-purple-400/60 transition group">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Notre Ambition</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Rendre la technologie productive et rentable. Nous connectons nos formations aux systèmes de paiement locaux (Orange Money *144# et PayCard) pour permettre à chaque talent d'apprendre et de vendre sans barrières bancaires.
          </p>
        </div>

      </div>

      {/* Notre Histoire & Engagement */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#070b1e] border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest block">
            HISTOIRE & ENGAGEMENT CONTINU
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Née de la conviction que l'Afrique ne doit plus être spectatrice de l'IA
          </h2>
          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              Fondée à Conakry par <strong>Amadou Diallo</strong>, <strong>LOBBY TECHNOLOGIE DIGITAL</strong> est née d'un constat frappant : l'intelligence artificielle transforme tous les métiers à une vitesse vertigineuse, mais les ressources pédagogiques de qualité restaient souvent inadaptées au contexte ouest-africain et inaccessibles aux portefeuilles locaux.
            </p>
            <p>
              Pour combler ce fossé, nous avons conçu une infrastructure tout-en-un où chaque citoyen, étudiant ou entrepreneur peut non seulement se former en français avec des cas réels (contrats OHADA, commerce local, réseaux sociaux en Afrique), mais aussi générer directement ses vidéos et images IA sans quitter la plateforme.
            </p>
            <p>
              Aujourd'hui, Lobby Technologie Digital réunit une communauté passionnée d'apprenants, des collaborations avec des PME locales et un laboratoire d'outils IA continuellement mis à jour avec les avancées mondiales (Google Veo, Gemini, assistants vocaux).
            </p>
          </div>
        </div>
      </div>

      {/* Nos 4 Valeurs Fondamentales */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
            NOTRE ADN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Nos Valeurs Fondamentales
          </h2>
          <p className="text-slate-400 text-sm">
            Ce qui guide chacune de nos formations, innovations et relations avec nos apprenants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${v.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{v.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notre Équipe Dirigeante */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            LEADERSHIP & EXPERTISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Notre Équipe à Conakry
          </h2>
          <p className="text-slate-400 text-sm">
            Des ingénieurs, formateurs et créateurs mobilisés pour votre réussite numérique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div key={i} className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-cyan-500/40 transition group">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-sm">
                  {member.badge}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-purple-400">{member.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Coordinates & Contact Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/80 via-purple-950/60 to-blue-950/80 border border-blue-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center lg:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Vous souhaitez collaborer ou former votre entreprise ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Nous intervenons auprès des écoles, universités, ministères et entreprises à Conakry et dans toute la sous-région.
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center text-emerald-400 font-semibold">
              <PhoneCall className="w-3.5 h-3.5 mr-1" />
              WhatsApp : 611 55 44 71
            </span>
            <span className="flex items-center text-cyan-300">
              <Mail className="w-3.5 h-3.5 mr-1" />
              amadoudiallodm70@gmail.com
            </span>
            <span className="flex items-center text-slate-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-rose-400" />
              Conakry, Guinée
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={onExploreCourses}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:opacity-90 transition flex items-center justify-center space-x-2"
          >
            <span>Explorer le Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenContact}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition flex items-center justify-center"
          >
            Contactez la Direction
          </button>
        </div>
      </div>

    </div>
  );
};
