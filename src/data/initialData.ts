import { Course, DigitalProduct, Review } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: "Maîtrise Complète de l'IA Générative & ChatGPT Pro",
    category: "Intelligence artificielle",
    description: "Apprenez à maîtriser les outils d'IA les plus puissants : ChatGPT, Claude, Midjourney et Gemini pour automatiser votre travail, rédiger des contenus d'élite et créer des flux d'automatisation.",
    detailedProgram: [
      { id: 'm1', title: "Module 1 : Fondamentaux de l'IA Générative et Prompt Engineering Avancé", duration: "1h 45m" },
      { id: 'm2', title: "Module 2 : Automatisation de Tâches Professionnelles et Business", duration: "2h 15m" },
      { id: 'm3', title: "Module 3 : Intégration d'Agents IA et Workflow Multimodal", duration: "2h 30m" },
      { id: 'm4', title: "Module 4 : Monétisation des compétences IA en Guinée et à l'International", duration: "1h 30m" }
    ],
    priceGNF: 350000,
    originalPriceGNF: 500000,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    previewText: "Découvrez en 10 minutes comment générer un chiffre d'affaires grâce aux agents conversationnels et aux workflows automatisés.",
    durationHours: 8,
    level: "Tous niveaux",
    instructor: "Amadou Diallo",
    isPublished: true,
    attachedFiles: [
      { id: 'f1', name: "Guide_Secret_Prompts_IA_2026.pdf", size: 4500000, type: "pdf", url: "/uploads/Guide_Secret_Prompts_IA_2026.pdf", uploadedAt: "2026-01-15" }
    ],
    studentsCount: 248,
    rating: 4.9,
    createdAt: "2026-01-10"
  },
  {
    id: 'course-2',
    title: "Création de Vidéos Virales avec l'IA (TikTok, Reels & YouTube)",
    category: "Création de vidéos avec l'IA",
    description: "Créez des vidéos sans montrer votre visage grâce aux avatars IA, voix synthétiques ultra-réalistes et générateurs vidéo (HeyGen, Runway, ElevenLabs, CapCut).",
    detailedProgram: [
      { id: 'm21', title: "Module 1 : Écriture de scripts captivants et accroches hypnotiques", duration: "1h 30m" },
      { id: 'm22', title: "Module 2 : Génération d'avatars et voix clones francophones", duration: "2h 00m" },
      { id: 'm23', title: "Module 3 : Montage automatique et habillage visuel sur CapCut", duration: "2h 15m" },
      { id: 'm24', title: "Module 4 : Stratégies de viralité et monétisation TikTok Creator", duration: "1h 45m" }
    ],
    priceGNF: 280000,
    originalPriceGNF: 400000,
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    previewText: "Apprenez à produire 10 vidéos courtes par jour en moins de 45 minutes avec les outils IA.",
    durationHours: 7.5,
    level: "Débutant",
    instructor: "Amadou Diallo & Team Lobby Tech",
    isPublished: true,
    attachedFiles: [
      { id: 'f2', name: "Pack_50_Scripts_Viraux.pdf", size: 3200000, type: "pdf", url: "/uploads/Pack_50_Scripts_Viraux.pdf", uploadedAt: "2026-01-20" }
    ],
    studentsCount: 312,
    rating: 4.95,
    createdAt: "2026-01-12"
  },
  {
    id: 'course-3',
    title: "Composition Musicale & Beatmaking avec l'IA (Suno & Udio)",
    category: "Création de musique avec l'IA",
    description: "Créez des musiques professionnelles, jingles publicitaires, génériques podcast et chansons complètes sans solfège ni instruments physiques.",
    detailedProgram: [
      { id: 'm31', title: "Module 1 : Comprendre Suno AI et Udio pour générer des hits", duration: "1h 15m" },
      { id: 'm32', title: "Module 2 : Structuration des paroles, refrains et styles musicaux (Afrobeats, Rap, Amapiano)", duration: "1h 45m" },
      { id: 'm33', title: "Module 3 : Mixage, export haute fidélité et droits d'auteur", duration: "1h 30m" }
    ],
    priceGNF: 200000,
    originalPriceGNF: 300000,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    durationHours: 4.5,
    level: "Tous niveaux",
    instructor: "Lobby AI Audio Lab",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 145,
    rating: 4.85,
    createdAt: "2026-01-18"
  },
  {
    id: 'course-4',
    title: "Informatique Fondamentale, Maintenance & Sécurité Numérique",
    category: "Informatique et bureautique",
    description: "Devenez autonome en informatique : architecture PC, installation d'OS, résolution des pannes courantes, optimisation Windows et protection cybersécurité.",
    detailedProgram: [
      { id: 'm41', title: "Module 1 : Anatomie matérielle et logicielle des ordinateurs", duration: "2h 00m" },
      { id: 'm42', title: "Module 2 : Formatage, réinstallation propre et pilotes", duration: "2h 30m" },
      { id: 'm43', title: "Module 3 : Sauvegarde cloud, antivirus et hygiène cybernétique", duration: "1h 30m" }
    ],
    priceGNF: 150000,
    originalPriceGNF: 250000,
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    durationHours: 6,
    level: "Débutant",
    instructor: "Équipe Technique Lobby",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 198,
    rating: 4.8,
    createdAt: "2026-01-05"
  },
  {
    id: 'course-5',
    title: "Photoshop & Design Graphique Professionnel pour Créateurs",
    category: "Photoshop et design graphique",
    description: "Concevez des affiches percutantes, visuels publicitaires pour réseaux sociaux, logos et identités visuelles avec Adobe Photoshop et l'IA générative Firefly.",
    detailedProgram: [
      { id: 'm51', title: "Module 1 : Prise en main de Photoshop et composition visuelle", duration: "2h 15m" },
      { id: 'm52', title: "Module 2 : Détourage parfait, retouche photo et intégration IA", duration: "2h 45m" },
      { id: 'm53', title: "Module 3 : Création d'affiches commerciales et flyers prêts à l'impression", duration: "3h 00m" }
    ],
    priceGNF: 250000,
    originalPriceGNF: 350000,
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    durationHours: 8,
    level: "Intermédiaire",
    instructor: "Sékou Touré (Lead Designer)",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 184,
    rating: 4.9,
    createdAt: "2026-01-22"
  },
  {
    id: 'course-6',
    title: "Montage Vidéo Professionnel sur Premiere Pro & CapCut PC",
    category: "Montage vidéo",
    description: "Apprenez le découpage dynamique, le sound design, l'étalonnage colorimétrique et les effets de transitions pour produire des vidéos captivantes de niveau cinéma.",
    detailedProgram: [
      { id: 'm61', title: "Module 1 : Interface et flux de production ultra-rapide", duration: "2h 00m" },
      { id: 'm62', title: "Module 2 : Rythme de montage, musique et mixage sonore immersif", duration: "2h 30m" },
      { id: 'm63', title: "Module 3 : Titrages animés, sous-titres dynamiques et colorimétrie", duration: "2h 30m" }
    ],
    priceGNF: 250000,
    originalPriceGNF: 350000,
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    durationHours: 7,
    level: "Tous niveaux",
    instructor: "Amadou Diallo",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 167,
    rating: 4.9,
    createdAt: "2026-01-14"
  },
  {
    id: 'course-7',
    title: "Pack Excel & Word Professionnel : De Débutant à Expert",
    category: "Excel et Word",
    description: "Maîtrisez les formules avancées (RECHERCHEX, INDEX-EQUIV), tableaux croisés dynamiques, tableaux de bord interactifs et la mise en page de rapports sous Word.",
    detailedProgram: [
      { id: 'm71', title: "Module 1 : Tableaux de gestion automatisés sous Excel", duration: "2h 00m" },
      { id: 'm72', title: "Module 2 : Fonctions avancées et tableaux de bord financiers", duration: "3h 00m" },
      { id: 'm73', title: "Module 3 : Rédaction de contrats, rapports et publipostage Word", duration: "2h 00m" }
    ],
    priceGNF: 150000,
    originalPriceGNF: 250000,
    coverImage: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=800&q=80",
    durationHours: 7,
    level: "Tous niveaux",
    instructor: "Fatoumata Binta",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 220,
    rating: 4.85,
    createdAt: "2026-01-08"
  },
  {
    id: 'course-8',
    title: "E-commerce & Vente de Produits en Afrique de l'Ouest",
    category: "E-commerce",
    description: "Créez votre boutique en ligne rentable : sourcing de produits, intégration Orange Money / PayCard, gestion des stocks et logistique de livraison à Conakry et en région.",
    detailedProgram: [
      { id: 'm81', title: "Module 1 : Trouver des produits gagnants et négocier avec les fournisseurs", duration: "2h 15m" },
      { id: 'm82', title: "Module 2 : Création de la boutique en ligne et tunnels de vente", duration: "2h 45m" },
      { id: 'm83', title: "Module 3 : Logistique, livraisons et encaissement Mobile Money", duration: "2h 00m" }
    ],
    priceGNF: 300000,
    originalPriceGNF: 450000,
    coverImage: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    durationHours: 7,
    level: "Intermédiaire",
    instructor: "Amadou Diallo",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 195,
    rating: 4.95,
    createdAt: "2026-01-25"
  },
  {
    id: 'course-9',
    title: "Marketing Digital Stratégique & Acquisition Client",
    category: "Marketing digital",
    description: "Développez une stratégie d'acquisition omnicanale : tunnels de conversion, emailing, WhatsApp Marketing et fidélisation client pour booster votre chiffre d'affaires.",
    detailedProgram: [
      { id: 'm91', title: "Module 1 : Positionnement de marque et persona client précis", duration: "1h 45m" },
      { id: 'm92', title: "Module 2 : Tunnels de conversion et WhatsApp Business automatisé", duration: "2h 30m" },
      { id: 'm93', title: "Module 3 : Analyse des indicateurs clés et ROI", duration: "1h 45m" }
    ],
    priceGNF: 220000,
    originalPriceGNF: 350000,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    durationHours: 6,
    level: "Tous niveaux",
    instructor: "Équipe Lobby Marketing",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 140,
    rating: 4.8,
    createdAt: "2026-01-19"
  },
  {
    id: 'course-10',
    title: "Publicité Facebook Ads & TikTok Ads Rentable en Guinée",
    category: "Publicité Facebook et TikTok",
    description: "Lancez des campagnes publicitaires rentables : ciblage géographique précis en Guinée, créatifs publicitaires percutants, pixel de suivi et optimisation du coût par message.",
    detailedProgram: [
      { id: 'm101', title: "Module 1 : Configuration du Business Manager et politique publicitaire", duration: "2h 00m" },
      { id: 'm102', title: "Module 2 : Création de campagnes à fort retour sur investissement", duration: "2h 30m" },
      { id: 'm103', title: "Module 3 : Stratégies publicitaires TikTok Ads pour le marché guinéen", duration: "2h 00m" }
    ],
    priceGNF: 320000,
    originalPriceGNF: 480000,
    coverImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    durationHours: 6.5,
    level: "Intermédiaire",
    instructor: "Amadou Diallo",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 280,
    rating: 4.9,
    createdAt: "2026-01-21"
  },
  {
    id: 'course-11',
    title: "Création de Contenu Haute Performance & Personal Branding",
    category: "Création de contenu",
    description: "Construisez une audience engagée sur LinkedIn, YouTube, TikTok et Facebook pour transformer votre visibilité en opportunités de business rémunératrices.",
    detailedProgram: [
      { id: 'm111', title: "Module 1 : Trouver sa niche et son angle d'autorité", duration: "1h 30m" },
      { id: 'm112', title: "Module 2 : Écriture engageante (Copywriting & Storytelling)", duration: "2h 15m" },
      { id: 'm113', title: "Module 3 : Organisation éditoriale et production de contenu en masse", duration: "2h 15m" }
    ],
    priceGNF: 200000,
    originalPriceGNF: 300000,
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    durationHours: 6,
    level: "Tous niveaux",
    instructor: "Amadou Diallo",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 160,
    rating: 4.85,
    createdAt: "2026-01-16"
  },
  {
    id: 'course-12',
    title: "Développement Web Moderne : HTML, CSS, JavaScript & React",
    category: "Développement web",
    description: "Apprenez à coder des sites web et applications interactives, réactives et performantes de zéro jusqu'au déploiement en ligne avec nom de domaine personnalisé.",
    detailedProgram: [
      { id: 'm121', title: "Module 1 : Bases solides HTML5 sémantique et CSS3 moderne", duration: "3h 00m" },
      { id: 'm122', title: "Module 2 : Programmation JavaScript interactive et API REST", duration: "4h 00m" },
      { id: 'm123', title: "Module 3 : Création d'une application React complète et déploiement", duration: "5h 00m" }
    ],
    priceGNF: 400000,
    originalPriceGNF: 600000,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    durationHours: 12,
    level: "Tous niveaux",
    instructor: "Ingénieur Tech Lobby",
    isPublished: true,
    attachedFiles: [],
    studentsCount: 175,
    rating: 4.95,
    createdAt: "2026-01-02"
  }
];

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod-1',
    name: "Ebook : Le Guide Ultime de la Monétisation IA en Afrique",
    category: "Ebooks & Livres",
    productType: "ebook",
    description: "Plus de 120 pages pratiques détaillant 15 modèles d'affaires rentables exploitant l'intelligence artificielle pour générer des revenus en Guinée et en Afrique francophone.",
    priceGNF: 75000,
    originalPriceGNF: 120000,
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    previewExcerpt: "Chapitre 1 : Comment les créateurs de contenu en Guinée multiplient leur productivité par 10 sans investir dans du matériel coûteux...",
    features: [
      "Livre au format PDF haute résolution",
      "15 études de cas réelles et chiffres concrets",
      "Liste des 50 outils IA gratuits et sans carte bancaire",
      "Modèles de messages prêts pour clients WhatsApp"
    ],
    attachedFiles: [
      { id: 'f_eb1', name: "Ebook_Monetisation_IA_Afrique.pdf", size: 8500000, type: "pdf", url: "/uploads/Ebook_Monetisation_IA_Afrique.pdf", uploadedAt: "2026-01-10" }
    ],
    isPublished: true,
    downloadsCount: 382,
    createdAt: "2026-01-11"
  },
  {
    id: 'prod-2',
    name: "Pack 150+ Modèles de Documents & Contrats Professionnels Guinée",
    category: "Documents professionnels",
    productType: "template",
    description: "Une bibliothèque complète de modèles Word et Excel prêts à l'emploi : contrats de prestation, devis types, factures conformes, statuts SARL, contrats de travail et baux commerciaux.",
    priceGNF: 120000,
    originalPriceGNF: 200000,
    coverImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
    previewExcerpt: "Contient tous les formats juridiques et commerciaux adaptés au droit OHADA en vigueur en République de Guinée.",
    features: [
      "150+ fichiers modifiables au format Word et Excel",
      "Conformes aux normes commerciales OHADA / Guinée",
      "Calcul automatique des taxes et montants en GNF",
      "Mise à jour gratuite pendant 1 an"
    ],
    attachedFiles: [
      { id: 'f_mod1', name: "Pack_Contrats_OHADA_Guinee.zip", size: 18200000, type: "zip", url: "/uploads/Pack_Contrats_OHADA_Guinee.zip", uploadedAt: "2026-01-14" }
    ],
    isPublished: true,
    downloadsCount: 295,
    createdAt: "2026-01-15"
  },
  {
    id: 'prod-3',
    name: "Pack Vidéo : Maîtrise des Outils Bureautiques (Word, Excel & PowerPoint)",
    category: "Vidéos éducatives",
    productType: "video_pack",
    description: "30 vidéos courtes et pratiques pour maîtriser la bureautique d'entreprise : gestion des budgets, publipostage, présentations percutantes pour soutenances et réunions.",
    priceGNF: 95000,
    originalPriceGNF: 160000,
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    previewExcerpt: "Accessible hors-ligne après téléchargement. Parfait pour les étudiants, secrétaires et chefs d'entreprise.",
    features: [
      "30 vidéos tutoriels HD au format MP4",
      "Fichiers d'exercices pratiques inclus",
      "Visionnage direct sur téléphone ou PC",
      "Certificat numérique d'attestation"
    ],
    attachedFiles: [
      { id: 'f_vid1', name: "Tutoriels_Bureautique_LobbyTech.zip", size: 94000000, type: "zip", url: "/uploads/Tutoriels_Bureautique_LobbyTech.zip", uploadedAt: "2026-01-16" }
    ],
    isPublished: true,
    downloadsCount: 184,
    createdAt: "2026-01-18"
  },
  {
    id: 'prod-4',
    name: "Pack Ultime 500+ Templates Canva & Photoshop pour Commerçants",
    category: "Modèles graphiques",
    productType: "template",
    description: "Boostez vos ventes sur WhatsApp, Instagram et Facebook : 500 affiches prêtes à modifier en 2 clics pour la mode, la restauration, l'électronique et l'immobilier.",
    priceGNF: 85000,
    originalPriceGNF: 140000,
    coverImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
    features: [
      "Liens directs modifiables avec Canva Gratuit",
      "Fichiers sources Photoshop PSD inclus",
      "Dimensions idéales pour Statut WhatsApp et Stories",
      "Palettes de couleurs tendances et typographies incluses"
    ],
    attachedFiles: [
      { id: 'f_canva1', name: "Canva_Templates_500_Business.pdf", size: 4100000, type: "pdf", url: "/uploads/Canva_Templates_500_Business.pdf", uploadedAt: "2026-01-20" }
    ],
    isPublished: true,
    downloadsCount: 420,
    createdAt: "2026-01-22"
  },
  {
    id: 'prod-5',
    name: "Logiciel Assistant WhatsApp Business & Envoi Groupé Légal",
    category: "Logiciels et ressources",
    productType: "software",
    description: "Outil informatique pour Windows permettant de notifier automatiquement vos clients par WhatsApp, envoyer les confirmations de commande et exporter les contacts.",
    priceGNF: 190000,
    originalPriceGNF: 300000,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    features: [
      "Logiciel exécutable autonome pour Windows 10/11",
      "Guide complet d'installation en vidéo",
      "Respect des limites anti-blocage WhatsApp",
      "Support technique par WhatsApp inclus"
    ],
    attachedFiles: [
      { id: 'f_soft1', name: "LobbyTech_WhatsApp_Tool_v2.zip", size: 28000000, type: "zip", url: "/uploads/LobbyTech_WhatsApp_Tool_v2.zip", uploadedAt: "2026-01-24" }
    ],
    isPublished: true,
    downloadsCount: 167,
    createdAt: "2026-01-25"
  },
  {
    id: 'prod-6',
    name: "Bible des 1000 Prompts IA Rentables (Midjourney, ChatGPT & Claude)",
    category: "Guides pratiques",
    productType: "guide",
    description: "La collection secrète de prompts testés et optimisés pour le commerce, la rédaction juridique, la création de visuels réalistes et le marketing digital.",
    priceGNF: 50000,
    originalPriceGNF: 90000,
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    features: [
      "1000 prompts classés par catégorie professionnelle",
      "Formules de prompts Midjourney photoréalistes",
      "Instructions système pour ChatGPT et Gemini",
      "Format PDF interactif et feuille Excel"
    ],
    attachedFiles: [
      { id: 'f_prompts1', name: "1000_Prompts_IA_Lobby_Technologie.pdf", size: 6200000, type: "pdf", url: "/uploads/1000_Prompts_IA_Lobby_Technologie.pdf", uploadedAt: "2026-01-28" }
    ],
    isPublished: true,
    downloadsCount: 510,
    createdAt: "2026-01-28"
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Mamadou Bhoye Diallo',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    serviceCategory: 'Intelligence artificielle',
    targetName: "Maîtrise Complète de l'IA Générative",
    rating: 5,
    comment: "La formation a transformé ma façon de travailler à Conakry. J'ai payé par Orange Money en 30 secondes et j'ai eu accès immédiat aux vidéos et au guide de prompts !",
    isVerifiedLearner: true,
    createdAt: '2026-01-25'
  },
  {
    id: 'rev-2',
    customerName: 'Aissatou Barry',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    serviceCategory: 'Création de vidéos avec l\'IA',
    targetName: "Création de Vidéos Virales avec l'IA",
    rating: 5,
    comment: "Incroyable ! En une semaine, ma page TikTok est passée de 200 à 18 000 abonnés grâce aux techniques d'avatars et de scripts viraux de Lobby Tech.",
    isVerifiedLearner: true,
    createdAt: '2026-01-28'
  },
  {
    id: 'rev-3',
    customerName: 'Ousmane Camara',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    serviceCategory: 'Documents professionnels',
    targetName: "Pack 150+ Modèles de Contrats Guinée",
    rating: 5,
    comment: "Les modèles de contrats OHADA m'ont fait économiser des honoraires d'avocat. Téléchargement instantané sur PayCard sans aucun problème.",
    isVerifiedLearner: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'rev-4',
    customerName: 'Mariama Soumah',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    serviceCategory: 'Publicité Facebook et TikTok',
    targetName: "Publicité Facebook & TikTok Ads Rentable",
    rating: 5,
    comment: "La meilleure académie numérique de Guinée ! Le support par WhatsApp au 611 55 44 71 est super réactif quand on a une question.",
    isVerifiedLearner: true,
    createdAt: '2026-02-05'
  }
];
