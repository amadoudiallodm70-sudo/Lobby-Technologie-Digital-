import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  ShoppingBag, 
  BookOpen, 
  Download, 
  Receipt, 
  Settings, 
  PlayCircle, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  CheckCircle2,
  AlertCircle,
  Bell,
  KeyRound,
  LogOut,
  Globe,
  Phone,
  Mail,
  Calendar,
  Layers,
  CreditCard,
  Edit3,
  Loader2,
  Check,
  Video,
  Image as ImageIcon,
  Crown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetClientPurchases, apiGetClientAICreations, formatGNF } from '../services/api';
import { Course, DigitalProduct, Order, AICreation } from '../types';
import { CoursePlayerModal } from './CoursePlayerModal';

interface ClientDashboardProps {
  onNavigateHome: () => void;
  onExploreCourses: () => void;
  onExploreProducts: () => void;
  onNavigatePricing?: () => void;
}

type DashboardSection = 
  | 'dashboard'
  | 'formations'
  | 'purchases'
  | 'downloads'
  | 'orders'
  | 'payments'
  | 'subscriptions'
  | 'generated_videos'
  | 'generated_images'
  | 'notifications'
  | 'edit_profile'
  | 'edit_password';

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onNavigateHome,
  onExploreCourses,
  onExploreProducts,
  onNavigatePricing,
}) => {
  const { 
    user, 
    logout, 
    updateProfile, 
    changePassword, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationsAsRead 
  } = useAuth();
  
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const [loading, setLoading] = useState(true);
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<DigitalProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [aiCreations, setAiCreations] = useState<AICreation[]>([]);

  // Selected course for player modal
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCountry, setEditCountry] = useState(user?.country || 'Guinée');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [purchasesData, creationsData] = await Promise.all([
          apiGetClientPurchases(user?.id),
          apiGetClientAICreations().catch(() => [])
        ]);
        setPurchasedCourses(purchasesData.courses || []);
        setPurchasedProducts(purchasesData.products || []);
        setOrders(purchasesData.orders || []);
        setAiCreations(creationsData || []);
      } catch (err) {
        console.error('Erreur chargement données client', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Handle profile submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      setProfileSaving(true);
      await updateProfile({
        name: editName,
        phone: editPhone,
        country: editCountry,
      });
      setProfileSuccess('Vos informations de profil ont été mises à jour avec succès.');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle password submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword(oldPassword, newPassword, confirmPassword);
      setPasswordSuccess('Votre mot de passe a été modifié avec succès.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setPasswordSaving(false);
    }
  };

  const navMenuItems = [
    { id: 'dashboard', label: '1. Mon tableau de bord', icon: Layers },
    { id: 'formations', label: '2. Mes formations', icon: BookOpen, count: purchasedCourses.length },
    { id: 'purchases', label: '3. Mes achats', icon: ShoppingBag, count: purchasedProducts.length + purchasedCourses.length },
    { id: 'downloads', label: '4. Mes téléchargements', icon: Download },
    { id: 'subscriptions', label: '5. Mon Abonnement VIP', icon: Crown },
    { id: 'generated_videos', label: '6. Mes Vidéos IA Générées', icon: Video, count: aiCreations.filter(c => c.type === 'video').length },
    { id: 'generated_images', label: '7. Mes Images & Affiches IA', icon: ImageIcon, count: aiCreations.filter(c => c.type === 'image' || c.type === 'canvas').length },
    { id: 'orders', label: '8. Mon historique de commandes', icon: Receipt, count: orders.length },
    { id: 'payments', label: '9. Mes paiements Orange Money & PayCard', icon: CreditCard },
    { id: 'notifications', label: '10. Mes notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'edit_profile', label: '11. Modifier mon profil', icon: Edit3 },
    { id: 'edit_password', label: '12. Modifier mon mot de passe', icon: KeyRound },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER PROFILE BANNER AS REQUESTED                        */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b1028] via-[#101438] to-[#0c0f2b] border border-blue-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/30">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                user?.name ? user.name[0].toUpperCase() : 'U'
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0b1028]" title="Statut : Actif" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {user?.name || 'Client Apprenant'}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                user?.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                Statut : {user?.status === 'active' ? 'Compte Actif' : 'Suspendu'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center text-slate-300">
                <Mail className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                {user?.email}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                +224 {user?.phone || '611 55 44 71'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1 text-purple-400" />
                {user?.country || 'Guinée'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-yellow-400" />
                Inscrit le {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '2026-01-15'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick logout & Home navigation */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Accueil Site
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>10. Se Déconnecter</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT                             */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Navigation Menu (10 rubriques) */}
        <div className="lg:col-span-4 space-y-2 bg-[#080c1d] p-4 rounded-3xl border border-slate-800 h-fit">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
            Navigation Personnelle
          </span>

          <div className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as DashboardSection)}
                  className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px]">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && !item.badge && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="w-full text-left px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition flex items-center space-x-3"
            >
              <LogOut className="w-4 h-4" />
              <span>10. Se déconnecter</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. MON TABLEAU DE BORD (DASHBOARD) */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Formations suivies</span>
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black text-cyan-300">{purchasedCourses.length}</p>
                  <p className="text-[11px] text-slate-500">Accès aux vidéos & modules</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Produits & Livres</span>
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black text-purple-300">{purchasedProducts.length}</p>
                  <p className="text-[11px] text-slate-500">Documents débloqués</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Commandes validées</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black text-emerald-400">{orders.filter(o => o.status === 'PAID').length}</p>
                  <p className="text-[11px] text-slate-500">Transactions conformes GNF</p>
                </div>
              </div>

              {/* Quick Resume Learning Card */}
              {purchasedCourses.length > 0 ? (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Reprendre ma formation
                    </span>
                    <span className="text-xs text-slate-400">Dernier module en cours</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={purchasedCourses[0].coverImage}
                      alt={purchasedCourses[0].title}
                      className="w-full sm:w-36 h-24 rounded-2xl object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-base font-extrabold text-white">{purchasedCourses[0].title}</h4>
                      <p className="text-xs text-slate-300">{purchasedCourses[0].instructor} • {purchasedCourses[0].durationHours} Heures</p>
                      <button
                        onClick={() => setLearningCourse(purchasedCourses[0])}
                        className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-md"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continuer la lecture vidéo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">Vous n'avez pas encore de formation active</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Explorez notre catalogue de formations certifiantes pour développer vos compétences en IA, montage et bureautique.
                  </p>
                  <button
                    onClick={onExploreCourses}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    Découvrir les formations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. MES FORMATIONS */}
          {activeSection === 'formations' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>2. Mes Formations Numériques ({purchasedCourses.length})</span>
                </h3>
                <button onClick={onExploreCourses} className="text-xs text-cyan-400 hover:underline">
                  + Ajouter une formation
                </button>
              </div>

              {purchasedCourses.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Aucune formation débloquée.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purchasedCourses.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <img src={c.coverImage} alt={c.title} className="w-full h-32 rounded-xl object-cover" />
                      <div className="space-y-1">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">{c.category}</span>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{c.title}</h4>
                        <p className="text-xs text-slate-400">{c.durationHours}h • {c.instructor}</p>
                      </div>
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          onClick={() => setLearningCourse(c)}
                          className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Visionner le cours</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. MES ACHATS */}
          {activeSection === 'purchases' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <span>3. Tous Mes Achats Débloqués</span>
              </h3>

              <div className="space-y-3">
                {purchasedCourses.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 font-bold uppercase text-[10px]">Formation</span>
                      <span className="text-white font-bold">{c.title}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Payé ({formatGNF(c.priceGNF)})</span>
                  </div>
                ))}

                {purchasedProducts.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold uppercase text-[10px]">Produit Digital</span>
                      <span className="text-white font-bold">{p.name}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Payé ({formatGNF(p.priceGNF)})</span>
                  </div>
                ))}

                {purchasedCourses.length === 0 && purchasedProducts.length === 0 && (
                  <p className="text-xs text-slate-500 py-6 text-center">Aucun achat confirmé pour l'instant.</p>
                )}
              </div>
            </div>
          )}

          {/* 4. MES TÉLÉCHARGEMENTS */}
          {activeSection === 'downloads' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <span>4. Mes Téléchargements & Fichiers Sécurisés</span>
              </h3>
              <p className="text-xs text-slate-400">
                Vos fichiers restent disponibles 24h/24 pour un téléchargement immédiat.
              </p>

              <div className="space-y-2">
                {purchasedProducts.concat(purchasedCourses as any).map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-white font-bold">{item.name || (item as any).title}</span>
                    <a
                      href={`/api/downloads/${(item as any).downloadToken || 'token-demo-101'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. MON ABONNEMENT VIP */}
          {activeSection === 'subscriptions' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>5. Mon Abonnement & Statut VIP</span>
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.currentPlan === 'expert'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : user?.currentPlan === 'premium'
                    ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  Pass Actuel : {user?.currentPlan?.toUpperCase() || 'GRATUIT'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-slate-950 border border-blue-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span>Formule {user?.currentPlan === 'expert' ? 'Expert & VIP Entreprise' : user?.currentPlan === 'premium' ? 'Premium Pro Mensuel' : 'Gratuit Découverte'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {user?.currentPlan === 'expert'
                        ? 'Accès illimité à tous les cours, toutes les bibles de prompts, génération vidéo IA prioritaire et support direct WhatsApp.'
                        : user?.currentPlan === 'premium'
                        ? 'Accès prioritaire aux cours, remises de 50% sur la boutique et génération illimitée d\'images.'
                        : 'Accès aux formations et ressources de découverte. Passez au niveau supérieur pour débloquer tout le potentiel.'}
                    </p>
                  </div>

                  {onNavigatePricing && (
                    <button
                      onClick={onNavigatePricing}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 whitespace-nowrap transition"
                    >
                      Mettre à niveau mon pass
                    </button>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap gap-4">
                  <span>Paiements supportés : <strong>Orange Money (*144#) & PayCard</strong></span>
                  <span>Statut : <strong className="text-emerald-400">Actif</strong></span>
                  {user?.planExpiresAt && (
                    <span>Expire le : <strong>{new Date(user.planExpiresAt).toLocaleDateString('fr-FR')}</strong></span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. MES VIDÉOS GÉNÉRÉES IA */}
          {activeSection === 'generated_videos' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <span>6. Mes Vidéos Générées IA ({aiCreations.filter(c => c.type === 'video').length})</span>
                </h3>
              </div>

              {aiCreations.filter(c => c.type === 'video').length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Video className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Vous n'avez pas encore généré de vidéo avec notre moteur IA Veo 3.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiCreations.filter(c => c.type === 'video').map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                        {item.mediaUrl?.endsWith('.mp4') || item.mediaUrl?.includes('video') ? (
                          <video src={item.mediaUrl} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.prompt}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString('fr-FR')}</span>
                        {item.mediaUrl && (
                          <a
                            href={item.mediaUrl}
                            download={`${item.title || 'video'}.mp4`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Télécharger</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. MES IMAGES ET AFFICHES IA */}
          {activeSection === 'generated_images' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-cyan-400" />
                  <span>7. Mes Images & Affiches IA ({aiCreations.filter(c => c.type === 'image' || c.type === 'canvas').length})</span>
                </h3>
              </div>

              {aiCreations.filter(c => c.type === 'image' || c.type === 'canvas').length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Aucune image ou affiche générée pour l'instant.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {aiCreations.filter(c => c.type === 'image' || c.type === 'canvas').map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden">
                        <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-[11px] font-bold text-white truncate">{item.title}</h4>
                      {item.mediaUrl && (
                        <a
                          href={item.mediaUrl}
                          download={`${item.title || 'image'}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center justify-center space-x-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Télécharger</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 8. MON HISTORIQUE DE COMMANDES */}
          {activeSection === 'orders' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-yellow-400" />
                <span>8. Historique de vos Commandes</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2 px-3">Référence</th>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Articles</th>
                      <th className="py-2 px-3">Montant</th>
                      <th className="py-2 px-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{ord.reference}</td>
                        <td className="py-3 px-3 text-slate-400">{new Date(ord.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-3 text-slate-200">{ord.items?.map(i => i.title).join(', ')}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white">{formatGNF(ord.totalGNF)}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. MES PAIEMENTS */}
          {activeSection === 'payments' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>6. Mes Paiements Orange Money & PayCard</span>
                </h3>
                <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer un reçu</span>
                </button>
              </div>

              <div className="space-y-3">
                {orders.filter(o => o.status === 'PAID').map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-cyan-300 font-bold block">{ord.reference}</span>
                      <span className="text-slate-400 uppercase text-[11px]">{ord.paymentMethod?.replace('_', ' ')} GUINÉE • Réf Tx: {ord.transactionRef || 'OM-VERIFIED'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-base text-white block">{formatGNF(ord.totalGNF)}</span>
                      <span className="text-emerald-400 font-semibold text-[11px]">Validé le {new Date(ord.paidAt || ord.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. MES NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <span>7. Mes Notifications ({notifications.length})</span>
                </h3>
                <button
                  onClick={markNotificationsAsRead}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Tout marquer comme lu
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                      notif.read ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-blue-950/40 border-cyan-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500">{new Date(notif.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-xs">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MODIFIER MON PROFIL */}
          {activeSection === 'edit_profile' && (
            <form onSubmit={handleProfileSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <span>8. Modifier Mes Informations de Profil</span>
              </h3>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
                  {profileError}
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Téléphone WhatsApp</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Pays</label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm flex items-center space-x-2"
              >
                {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Enregistrer les modifications</span>
              </button>
            </form>
          )}

          {/* 9. MODIFIER MON MOT DE PASSE */}
          {activeSection === 'edit_password' && (
            <form onSubmit={handlePasswordSubmit} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <span>9. Modifier Mon Mot de Passe</span>
              </h3>

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="text-slate-300 font-bold block mb-1">Ancien mot de passe</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Nouveau mot de passe (min 6 car.)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center space-x-2"
              >
                {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Mettre à jour le mot de passe</span>
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Interactive Classroom Course Player Modal */}
      <CoursePlayerModal
        course={learningCourse}
        onClose={() => setLearningCourse(null)}
      />

    </div>
  );
};
