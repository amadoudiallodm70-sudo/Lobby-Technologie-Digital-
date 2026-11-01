import React, { useState } from 'react';
import { 
  Globe, 
  Palette, 
  Video, 
  Bot, 
  GraduationCap, 
  UserCheck, 
  Share2, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  X, 
  Loader2, 
  Sparkles,
  PhoneCall,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { apiSendServiceRequest, formatGNF } from '../services/api';

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  description: string;
  deliverables: string[];
  startingPriceGNF: number;
  deliveryTime: string;
  badge?: string;
}

const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Création de Sites Web & E-commerce',
    category: 'Développement Web',
    icon: Globe,
    description: 'Conception de sites vitrines modernes, plateformes e-commerce à fort taux de conversion, et applications web connectées à Orange Money et PayCard.',
    deliverables: [
      'Site 100% responsive (Mobile, Tablette, PC)',
      'Intégration passerelle Orange Money *144# & PayCard',
      'Tableau de bord administrateur & gestion des stocks',
      'Optimisation SEO Google & hébergement sécurisé SSL'
    ],
    startingPriceGNF: 3500000,
    deliveryTime: '7 à 14 jours',
    badge: 'Populaire'
  },
  {
    id: 'graphic-design',
    title: 'Création Graphique & Identité de Marque',
    category: 'Design & Image de Marque',
    icon: Palette,
    description: 'Création de logos professionnels, chartes graphiques complètes, affiches publicitaires percutantes et supports de communication pour entreprises.',
    deliverables: [
      'Logo vectoriel haute définition (AI, EPS, PNG, PDF)',
      'Charte graphique (Palette, typographies, règles)',
      '10 Affiches publicitaires prêtes pour Facebook/TikTok',
      'Cartes de visite & papier en-tête d\'entreprise'
    ],
    startingPriceGNF: 1200000,
    deliveryTime: '3 à 5 jours'
  },
  {
    id: 'video-editing',
    title: 'Montage Vidéo & Spots Publicitaires',
    category: 'Audiovisuel',
    icon: Video,
    description: 'Montage vidéo dynamique pour YouTube, TikTok et Facebook, spot publicitaire d\'entreprise, et habillage sonore professionnel.',
    deliverables: [
      'Montage rythmé avec sous-titres animés viraux',
      'Effets sonores (SFX) et musiques libres de droits',
      'Formats adaptés (9:16 Shorts/Reels & 16:9 YouTube)',
      'Exportation Full HD 1080p ou 4K Ultra HD'
    ],
    startingPriceGNF: 800000,
    deliveryTime: '2 à 4 jours'
  },
  {
    id: 'ai-automation',
    title: 'Automatisation avec l\'IA & Chatbots',
    category: 'Intelligence Artificielle',
    icon: Bot,
    description: 'Automatisation de vos réponses clients WhatsApp, qualification des prospects par IA, génération automatique de devis et factures.',
    deliverables: [
      'Chatbot WhatsApp Business intelligent 24h/24',
      'Automatisation de relance des paniers abandonnés',
      'Génération instantanée de documents personnalisés',
      'Intégration CRM pour suivi des opportunités'
    ],
    startingPriceGNF: 2500000,
    deliveryTime: '5 à 10 jours',
    badge: 'IA Innovation'
  },
  {
    id: 'enterprise-training',
    title: 'Formation Numérique en Entreprise',
    category: 'Pédagogie & RH',
    icon: GraduationCap,
    description: 'Programmes de montée en compétences sur mesure pour vos équipes à Conakry : maîtrise de l\'IA générative, bureautique avancée et marketing digital.',
    deliverables: [
      'Ateliers pratiques en présentiel à Conakry ou en ligne',
      'Supports de formation personnalisés & cas concrets',
      'Évaluation des compétences & attestations certifiées',
      'Suivi post-formation pendant 30 jours'
    ],
    startingPriceGNF: 5000000,
    deliveryTime: 'Sur calendrier'
  },
  {
    id: 'coaching-1on1',
    title: 'Accompagnement Digital & Coaching VIP',
    category: 'Mentorat Privé',
    icon: UserCheck,
    description: 'Sessions individuelles 1-sur-1 avec un ingénieur senior pour structurer votre business en ligne, lancer vos offres ou maîtriser les outils IA.',
    deliverables: [
      'Audit complet de votre modèle économique et outils',
      'Feuille de route stratégique personnalisée',
      'Séances de travail en direct avec partage d\'écran',
      'Accès prioritaire à notre réseau et bibles secrètes'
    ],
    startingPriceGNF: 1500000,
    deliveryTime: 'Hebdomadaire'
  },
  {
    id: 'content-creation',
    title: 'Création de Contenus Réseaux Sociaux',
    category: 'Social Media Management',
    icon: Share2,
    description: 'Production mensuelle de contenus visuels, carrousels éducatifs et vidéos pour développer l\'autorité et les ventes de votre page.',
    deliverables: [
      'Calendrier éditorial mensuel stratégique',
      '20 Publications et carrousels graphiques',
      '8 Vidéos courtes TikTok & Reels tournées/montées',
      'Rédaction des textes avec accroches et hashtags'
    ],
    startingPriceGNF: 2800000,
    deliveryTime: 'Abonnement Mensuel'
  },
  {
    id: 'marketing-ads',
    title: 'Conseils en Marketing Digital & Campagnes Ads',
    category: 'Publicité en Ligne',
    icon: TrendingUp,
    description: 'Configuration et optimisation de vos campagnes publicitaires Facebook Ads et TikTok Ads pour générer des prospects qualifiés en Guinée.',
    deliverables: [
      'Ciblage précis des clients à Conakry et en région',
      'Création des visuels et vidéos publicitaires A/B test',
      'Optimisation du coût par clic (CPC) et par message',
      'Rapport hebdomadaire des conversions et ventes'
    ],
    startingPriceGNF: 1800000,
    deliveryTime: 'Sous 48h'
  }
];

export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [budgetGNF, setBudgetGNF] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenQuoteModal = (service?: ServiceItem) => {
    if (service) {
      setSelectedService(service);
      setServiceType(service.title);
    } else {
      setSelectedService(null);
      setServiceType(SERVICES_LIST[0].title);
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMsg('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiSendServiceRequest({
        name,
        email,
        phone,
        serviceType: serviceType || 'Service général',
        budgetGNF,
        deadline,
        description
      });
      setSuccessMsg(res.message || 'Votre demande de devis a été enregistrée avec succès !');
      setName('');
      setEmail('');
      setPhone('');
      setDescription('');
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la soumission de la demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SOLUTIONS DIGITALES SUR MESURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Nos Services Professionnels pour Entreprises & Créateurs
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Propulsez votre visibilité, automatisez vos opérations et développez votre chiffre d'affaires grâce à notre expertise technique et créative en République de Guinée.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => handleOpenQuoteModal()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center space-x-2 transform hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            <span>Demander un Devis Gratuit</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES_LIST.map((service) => {
          const Icon = service.icon;
          return (
            <div 
              key={service.id}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between space-y-5 transition duration-300 hover:shadow-xl hover:shadow-cyan-950/20 group relative overflow-hidden"
            >
              {service.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {service.badge}
                </span>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                    {service.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {service.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Livrables inclus :
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-500">À partir de</span>
                  <span className="text-base font-extrabold text-cyan-400">
                    {formatGNF(service.startingPriceGNF)}
                  </span>
                </div>

                <div className="flex items-center text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <span>Délai moyen : {service.deliveryTime}</span>
                </div>

                <button
                  onClick={() => handleOpenQuoteModal(service)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-center space-x-1.5"
                >
                  <span>Demander un devis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp Callout Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#090d26] via-[#0f1742] to-[#090d26] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-black text-white">
            Un projet urgent ou besoin d'un conseil immédiat ?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Échangez directement avec notre équipe technique sur WhatsApp au <strong>611 55 44 71</strong>.
          </p>
        </div>

        <a
          href="https://wa.me/224611554471?text=Bonjour%20Lobby%20Technologie%20Digital,%20je%20souhaite%20un%20devis%20pour%20un%20service"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/40 transition flex items-center justify-center space-x-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Discuter sur WhatsApp</span>
        </a>
      </div>

      {/* Interactive Modal : Demande de Devis */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-[#090d22] border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#060814]/80 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  Demande de Devis Personnalisé
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedService ? selectedService.title : 'Services Lobby Technologie Digital'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitQuote} className="p-6 sm:p-8 space-y-4 text-xs">
              
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Votre Nom ou Entreprise <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mamadou Diallo (Cabinet SARL)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Numéro WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="611 55 44 71"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Adresse Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Type de Service <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {SERVICES_LIST.map((s) => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Autre demande spécifique">Autre demande spécifique</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Budget Estimé en GNF
                  </label>
                  <input
                    type="text"
                    value={budgetGNF}
                    onChange={(e) => setBudgetGNF(e.target.value)}
                    placeholder="Ex: 2 500 000 GNF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Description détaillée de votre besoin <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Précisez vos objectifs, le public ciblé, les fonctionnalités souhaitées, et toute référence utile..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmission de votre demande...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ENVOYER MA DEMANDE DE DEVIS</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
