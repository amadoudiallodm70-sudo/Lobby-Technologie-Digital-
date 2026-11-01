import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  DollarSign, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Settings, 
  ShieldCheck, 
  Key,
  FileText,
  Video,
  FileCode,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  X,
  Crown,
  MessageSquare,
  Database,
  Send
} from 'lucide-react';
import { 
  apiGetAdminStats, 
  apiGetAdminOrders, 
  apiManualValidateOrder, 
  apiGetGatewayConfig, 
  apiUpdateGatewayConfig, 
  apiGetCourses, 
  apiGetProducts, 
  apiCreateCourse, 
  apiUpdateCourse, 
  apiDeleteCourse, 
  apiCreateProduct, 
  apiUpdateProduct, 
  apiDeleteProduct, 
  apiUploadFiles, 
  apiGetAdminUsers,
  apiGetAdminUserStats,
  apiSuspendUser,
  apiReactivateUser,
  apiGetPricingPlans,
  apiUpdatePricingPlans,
  apiGetAdminContactMessages,
  apiReplyContactMessage,
  apiGetAdminServiceRequests,
  apiUpdateServiceRequestStatus,
  apiGetDatabaseBackup,
  apiRestoreDatabaseBackup,
  formatGNF 
} from '../services/api';
import { 
  Course, 
  DigitalProduct, 
  Order, 
  DashboardStats, 
  PaymentGatewayConfig, 
  CategoryFormation, 
  AdminUserListItem, 
  AdminUserStats,
  SubscriptionPlan,
  ContactMessage,
  ServiceRequest
} from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'contents' | 'orders' | 'users' | 'plans' | 'messages' | 'gateways' | 'backup'>('stats');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [gateways, setGateways] = useState<PaymentGatewayConfig | null>(null);
  const [usersList, setUsersList] = useState<AdminUserListItem[]>([]);
  const [userStats, setUserStats] = useState<AdminUserStats | null>(null);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [selectedUserForModal, setSelectedUserForModal] = useState<AdminUserListItem | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<AdminUserListItem | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isSuspending, setIsSuspending] = useState(false);
  const [loading, setLoading] = useState(true);

  // Content Upload & Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'course' | 'product'>('course');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Intelligence artificielle');
  const [description, setDescription] = useState('');
  const [priceGNF, setPriceGNF] = useState<number>(200000);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [durationHours, setDurationHours] = useState(6);
  const [instructor, setInstructor] = useState('Amadou Diallo');
  const [isPublished, setIsPublished] = useState(true);
  const [productType, setProductType] = useState('ebook');

  // File Upload State with REAL progress bar
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFilesList, setUploadedFilesList] = useState<any[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Plans, Messages & Devis State
  const [plansList, setPlansList] = useState<SubscriptionPlan[]>([]);
  const [contactMsgs, setContactMsgs] = useState<ContactMessage[]>([]);
  const [serviceReqs, setServiceReqs] = useState<ServiceRequest[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [plansSaving, setPlansSaving] = useState(false);
  const [backupRestoreNotice, setBackupRestoreNotice] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      const [s, o, c, p, g, u, us, pl, ms, sr] = await Promise.all([
        apiGetAdminStats(),
        apiGetAdminOrders(),
        apiGetCourses(undefined, undefined, true),
        apiGetProducts(undefined, undefined, true),
        apiGetGatewayConfig(),
        apiGetAdminUsers(),
        apiGetAdminUserStats(),
        apiGetPricingPlans(),
        apiGetAdminContactMessages(),
        apiGetAdminServiceRequests()
      ]);
      setStats(s);
      setOrders(o);
      setCourses(c);
      setProducts(p);
      setGateways(g);
      setUsersList(u);
      setUserStats(us);
      setPlansList(pl);
      setContactMsgs(ms);
      setServiceReqs(sr);
    } catch (err) {
      console.error('Erreur chargement admin', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSuspendUserConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToSuspend || !suspensionReason.trim()) return;
    try {
      setIsSuspending(true);
      await apiSuspendUser(userToSuspend.id, suspensionReason);
      setSuccessNotice(`Le compte de ${userToSuspend.name} a été suspendu.`);
      setUserToSuspend(null);
      setSuspensionReason('');
      loadAll();
      setTimeout(() => setSuccessNotice(''), 3500);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suspension');
    } finally {
      setIsSuspending(false);
    }
  };

  const handleReactivateUserClick = async (u: AdminUserListItem) => {
    if (!window.confirm(`Confirmez-vous la réactivation du compte de ${u.name} ?`)) return;
    try {
      await apiReactivateUser(u.id);
      setSuccessNotice(`Le compte de ${u.name} a été réactivé avec succès.`);
      loadAll();
      setTimeout(() => setSuccessNotice(''), 3500);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la réactivation');
    }
  };

  const handleManualValidate = async (orderId: string) => {
    try {
      await apiManualValidateOrder(orderId);
      setSuccessNotice('Commande validée manuellement avec succès !');
      loadAll();
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la validation');
    }
  };

  const handleTogglePublishCourse = async (course: Course) => {
    try {
      await apiUpdateCourse(course.id, { isPublished: !course.isPublished });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublishProduct = async (product: DigitalProduct) => {
    try {
      await apiUpdateProduct(product.id, { isPublished: !product.isPublished });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (type: 'course' | 'product', id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce contenu ?")) return;
    try {
      if (type === 'course') await apiDeleteCourse(id);
      else await apiDeleteProduct(id);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Upload files handling with REAL progress bar
  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    setUploadProgress(0);

    const fileArray = Array.from(files);
    try {
      const res = await apiUploadFiles(fileArray, (percent) => {
        setUploadProgress(percent);
      });
      setUploadedFilesList(prev => [...prev, ...res.files]);
      setUploadProgress(null);
      setSuccessNotice(`${res.files.length} fichier(s) importé(s) avec succès !`);
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err: any) {
      setUploadError(err.message || "Erreur lors de l'importation");
      setUploadProgress(null);
    }
  };

  // Save Course or Product
  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formType === 'course') {
        const payload: Partial<Course> = {
          title,
          category: category as CategoryFormation,
          description,
          priceGNF: Number(priceGNF),
          coverImage,
          durationHours: Number(durationHours),
          instructor,
          isPublished,
          attachedFiles: uploadedFilesList,
          detailedProgram: [
            { id: 'm1', title: 'Module 1 : Fondations et méthodologie pratique', duration: '2h 00m' },
            { id: 'm2', title: 'Module 2 : Mise en œuvre et automatisation IA', duration: '3h 30m' },
          ]
        };

        if (editingItemId) {
          await apiUpdateCourse(editingItemId, payload);
        } else {
          await apiCreateCourse(payload);
        }
      } else {
        const payload: Partial<DigitalProduct> = {
          name: title,
          category,
          productType: productType as any,
          description,
          priceGNF: Number(priceGNF),
          coverImage,
          isPublished,
          attachedFiles: uploadedFilesList,
          features: [
            'Fichier original sans filigrane',
            'Accès direct en téléchargement 24/7',
            'Support par WhatsApp inclus'
          ]
        };

        if (editingItemId) {
          await apiUpdateProduct(editingItemId, payload);
        } else {
          await apiCreateProduct(payload);
        }
      }

      setIsFormOpen(false);
      setEditingItemId(null);
      setUploadedFilesList([]);
      loadAll();
      setSuccessNotice('Contenu enregistré et publié avec succès !');
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement");
    }
  };

  const openNewForm = (type: 'course' | 'product') => {
    setFormType(type);
    setEditingItemId(null);
    setTitle('');
    setDescription('');
    setPriceGNF(type === 'course' ? 250000 : 75000);
    setCategory(type === 'course' ? 'Intelligence artificielle' : 'Documents professionnels');
    setUploadedFilesList([]);
    setIsFormOpen(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <span>TABLEAU DE BORD ADMINISTRATEUR</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-200">
                LOBBY TECH
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Gestion centralisée des formations, produits digitaux, commandes et passerelles Orange Money / PayCard.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          Retour au site public
        </button>
      </div>

      {/* Notifications */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'stats', label: 'Vue d\'ensemble & Statistiques', icon: BarChart3 },
          { id: 'contents', label: 'Formations & Produits', icon: Layers, highlight: true },
          { id: 'orders', label: 'Commandes & Paiements', icon: ShoppingBag },
          { id: 'users', label: 'Gestion des Clients', icon: Users, highlight: true },
          { id: 'plans', label: 'Tarifs & Abonnements', icon: Crown },
          { id: 'messages', label: 'Messages & Devis', icon: MessageSquare },
          { id: 'gateways', label: 'Passerelles Orange Money', icon: Key },
          { id: 'backup', label: 'Sauvegarde & Système', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.highlight && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500 text-black">
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: REAL-TIME DYNAMIC STATS */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Chiffre d'Affaires</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {formatGNF(stats.totalRevenueGNF)}
              </p>
              <p className="text-[10px] text-slate-500">Paiements confirmés encaissés</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Paiements Confirmés</span>
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-cyan-400">
                {stats.confirmedPaymentsCount} <span className="text-xs text-slate-400 font-normal">/ {stats.totalOrders} cmd</span>
              </p>
              <p className="text-[10px] text-slate-500">En attente : {stats.pendingPaymentsCount}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Formations & Produits</span>
                <BookOpen className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-purple-400">
                {stats.totalCourses + stats.totalDigitalProducts}
              </p>
              <p className="text-[10px] text-slate-500">{stats.totalCourses} formations • {stats.totalDigitalProducts} produits</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Téléchargements Réalisés</span>
                <Download className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-yellow-400">
                {stats.totalDownloads}
              </p>
              <p className="text-[10px] text-slate-500">Documents & ZIPs débloqués</p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: GESTION DES CONTENUS NUMÉRIQUES */}
      {activeTab === 'contents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>GESTION DES CONTENUS NUMÉRIQUES</span>
              </h3>
              <p className="text-xs text-slate-400">
                Importez des vidéos HD, PDF, documents Word, archives ZIP et logiciels. Vos fichiers sont stockés durablement sur le serveur cloud.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => openNewForm('course')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Formation</span>
              </button>
              <button
                onClick={() => openNewForm('product')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouveau Produit Digital</span>
              </button>
            </div>
          </div>

          {/* Form Modal for Creating/Editing */}
          {isFormOpen && (
            <div className="p-6 rounded-2xl bg-[#090d22] border-2 border-purple-500/40 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-black text-white">
                  {editingItemId ? 'Modifier le contenu' : `Ajouter : ${formType === 'course' ? 'Formation Vidéo' : 'Produit Numérique (Ebook, ZIP, Modèle)'}`}
                </h4>
                <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white">
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSubmitContent} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Nom / Titre du contenu <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Formation Complète Montage CapCut & IA"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Catégorie <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex: Intelligence artificielle, E-commerce, Documents"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Prix en Francs Guinéens (GNF) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={priceGNF}
                      onChange={(e) => setPriceGNF(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Image de couverture (URL ou CDN)
                    </label>
                    <input
                      type="url"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600"
                      />
                      <span className="text-slate-300 font-semibold">Publier immédiatement sur le site</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Description détaillée <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Présentez les objectifs pédagogiques, le contenu et les avantages pour l'apprenant..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none resize-none"
                  />
                </div>

                {/* FILE UPLOAD SECTION WITH REAL PROGRESS BAR */}
                <div className="p-4 rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Téléversement de Fichiers (Vidéos, PDF, Word, ZIP, Logiciels)
                      </span>
                      <span className="text-slate-400 text-xs">
                        Fonctionne depuis Android et ordinateur • Taille max 250 Mo
                      </span>
                    </div>

                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Sélectionner des fichiers</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUploadFiles(e.target.files)}
                      />
                    </label>
                  </div>

                  {/* REAL PROGRESS BAR */}
                  {uploadProgress !== null && (
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs text-cyan-400 font-bold">
                        <span>Importation en cours...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Uploaded files list */}
                  {uploadedFilesList.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-slate-400 text-[11px] block font-semibold">
                        Fichiers attachés à ce contenu ({uploadedFilesList.length}) :
                      </span>
                      {uploadedFilesList.map((f, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                          <span className="text-slate-200 truncate">{f.name}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{(f.size / (1024 * 1024)).toFixed(2)} Mo</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold shadow-lg"
                  >
                    Publier le Contenu
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* List of Courses */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Formations Enregistrées ({courses.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {courses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 truncate">
                    <img src={c.coverImage} alt={c.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-cyan-400 font-bold block">{c.category}</span>
                      <span className="text-white font-bold truncate block">{c.title}</span>
                      <span className="text-slate-400 font-mono">{formatGNF(c.priceGNF)} • {c.attachedFiles?.length || 0} fichier(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublishCourse(c)}
                      className={`p-2 rounded-lg ${c.isPublished ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500 bg-slate-800'}`}
                      title={c.isPublished ? 'Dépublier' : 'Publier'}
                    >
                      {c.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteItem('course', c.id)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* List of Digital Products */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Produits Numériques Enregistrés ({products.length})</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 truncate">
                    <img src={p.coverImage} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-purple-400 font-bold block uppercase">{p.productType}</span>
                      <span className="text-white font-bold truncate block">{p.name}</span>
                      <span className="text-slate-400 font-mono">{formatGNF(p.priceGNF)} • {p.downloadsCount} dl</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublishProduct(p)}
                      className={`p-2 rounded-lg ${p.isPublished ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500 bg-slate-800'}`}
                    >
                      {p.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteItem('product', p.id)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: GESTION DES COMMANDES */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <span>Commandes Clients & Validation</span>
            </h3>
            <span className="text-xs text-slate-400">Total : {orders.length} commandes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Référence</th>
                  <th className="py-2.5 px-3">Client & Contact</th>
                  <th className="py-2.5 px-3">Articles</th>
                  <th className="py-2.5 px-3">Montant</th>
                  <th className="py-2.5 px-3">Passerelle</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{ord.reference}</td>
                    <td className="py-3 px-3">
                      <p className="text-white font-bold">{ord.customerName}</p>
                      <p className="text-slate-400 text-[11px]">+224 {ord.customerPhone}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                      {ord.items?.map(i => i.title).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-bold text-white font-mono">{formatGNF(ord.totalGNF)}</td>
                    <td className="py-3 px-3 uppercase text-slate-300 font-semibold">{ord.paymentMethod?.replace('_', ' ')}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ord.status !== 'PAID' ? (
                        <button
                          onClick={() => handleManualValidate(ord.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                        >
                          Valider paiement
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] font-medium flex items-center justify-end">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Validé
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: GESTION DES CLIENTS */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          {/* Top User Statistics */}
          {userStats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Total Utilisateurs Inscrits</span>
                <p className="text-2xl font-black text-white">{userStats.totalUsers}</p>
                <p className="text-[10px] text-slate-500">Comptes enregistrés</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-cyan-400">Nouveaux Utilisateurs</span>
                <p className="text-2xl font-black text-cyan-400">{userStats.newUsers}</p>
                <p className="text-[10px] text-slate-500">Inscrits ces 30 derniers jours</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-emerald-400">Utilisateurs Actifs</span>
                <p className="text-2xl font-black text-emerald-400">{userStats.activeUsers}</p>
                <p className="text-[10px] text-slate-500">Accès normal autorisé</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-xs font-semibold text-rose-400">Comptes Suspendus</span>
                <p className="text-2xl font-black text-rose-400">{userStats.suspendedUsers}</p>
                <p className="text-[10px] text-slate-500">Accès temporairement bloqué</p>
              </div>
            </div>
          )}

          {/* Search & Header Bar */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>GESTION DES CLIENTS & COMPTES UTILISATEURS</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Consultez les profils, achats, formations suivies et modérez les accès en cas de fraude ou litige.
                </p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Email & WhatsApp</th>
                    <th className="py-2.5 px-3">Pays</th>
                    <th className="py-2.5 px-3">Inscription</th>
                    <th className="py-2.5 px-3">Formations / Achats</th>
                    <th className="py-2.5 px-3">Total Dépensé</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList
                    .filter((u) => {
                      const q = searchUserQuery.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        (u.phone && u.phone.includes(q)) ||
                        (u.country && u.country.toLowerCase().includes(q))
                      );
                    })
                    .map((client) => {
                      const isSuspended = client.status === 'suspended';
                      return (
                        <tr key={client.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {client.name ? client.name[0].toUpperCase() : 'U'}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{client.name}</span>
                                {client.role === 'admin' && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    Directeur Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className="text-slate-200 block font-mono text-[11px]">{client.email}</span>
                            <span className="text-slate-400 text-[11px]">+224 {client.phone || '611 55 44 71'}</span>
                          </td>

                          <td className="py-3 px-3 text-slate-300">
                            {client.country || 'Guinée'}
                          </td>

                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                            {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                          </td>

                          <td className="py-3 px-3">
                            <span className="font-semibold text-cyan-300">
                              {client.coursesCount} cours • {client.productsCount} prod
                            </span>
                          </td>

                          <td className="py-3 px-3 font-bold font-mono text-emerald-400">
                            {formatGNF(client.totalSpentGNF)}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isSuspended
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {isSuspended ? 'SUSPENDU' : 'ACTIF'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => setSelectedUserForModal(client)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
                                title="Consulter le profil et l'historique complet"
                              >
                                Profil
                              </button>

                              {client.role !== 'admin' && (
                                <>
                                  {isSuspended ? (
                                    <button
                                      onClick={() => handleReactivateUserClick(client)}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                                    >
                                      Réactiver
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setUserToSuspend(client);
                                        setSuspensionReason('');
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-bold text-[11px] transition"
                                    >
                                      Suspendre
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-slate-500">
                        Aucun utilisateur enregistré.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: CONSULTATION DU PROFIL ET DES ACHATS CLIENT */}
      {selectedUserForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-[#090d20] border border-cyan-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 font-black text-lg flex items-center justify-center border border-cyan-500/30">
                  {selectedUserForModal.name ? selectedUserForModal.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{selectedUserForModal.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedUserForModal.email} • +224 {selectedUserForModal.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Pays :</span>
                <span className="font-bold text-white">{selectedUserForModal.country || 'Guinée'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Statut :</span>
                <span className={`font-bold ${selectedUserForModal.status === 'suspended' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedUserForModal.status === 'suspended' ? 'Suspendu' : 'Actif'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Total Dépensé :</span>
                <span className="font-bold text-cyan-300 font-mono">{formatGNF(selectedUserForModal.totalSpentGNF)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Date d'inscription :</span>
                <span className="font-bold text-white font-mono">{new Date(selectedUserForModal.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {selectedUserForModal.suspensionReason && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                <strong>Motif de suspension :</strong> {selectedUserForModal.suspensionReason}
              </div>
            )}

            {/* Orders & Purchases history */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                Commandes & Paiements de ce client ({selectedUserForModal.orders?.length || 0}) :
              </h5>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {selectedUserForModal.orders && selectedUserForModal.orders.length > 0 ? (
                  selectedUserForModal.orders.map((ord) => (
                    <div key={ord.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-cyan-400 font-bold block">{ord.reference}</span>
                        <span className="text-slate-300">{ord.items?.map(i => i.title).join(', ')}</span>
                        <span className="text-slate-500 block text-[10px] uppercase font-mono">{ord.paymentMethod?.replace('_', ' ')} • {new Date(ord.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{formatGNF(ord.totalGNF)}</span>
                        <span className={`text-[10px] font-bold ${ord.status === 'PAID' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs py-3 text-center">Aucune commande enregistrée pour cet utilisateur.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedUserForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: SUSPENDRE UN COMPTE AVEC MOTIF OBLIGATOIRE */}
      {userToSuspend && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <form onSubmit={handleSuspendUserConfirm} className="relative w-full max-w-md bg-[#090d20] border border-rose-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-black text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Suspendre le Compte Client</span>
              </h4>
              <button
                type="button"
                onClick={() => setUserToSuspend(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300">
              Vous êtes sur le point de suspendre le compte de <strong className="text-white">{userToSuspend.name}</strong> ({userToSuspend.email}). L'utilisateur ne pourra plus se connecter.
            </p>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Motif de la suspension <span className="text-rose-400">*</span> :
              </label>
              <textarea
                rows={3}
                required
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Ex: Tentative de transaction non autorisée, litige de paiement Orange Money, ou violation des conditions d'utilisation..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToSuspend(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSuspending}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-rose-950/40"
              >
                {isSuspending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                <span>Confirmer la suspension</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 4: PASSERELLES ORANGE MONEY & PAYCARD */}
      {activeTab === 'gateways' && gateways && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Key className="w-5 h-5 text-yellow-400" />
              <span>Paramètres des Passerelles de Paiement Guinée</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configuration officielle pour les encaissements en Francs Guinéens (GNF) via Orange Money, PayCard et Chap Chap Pay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Orange Money Guinea */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-500 text-black font-black text-xs flex items-center justify-center">
                    OM
                  </span>
                  <h4 className="text-sm font-extrabold text-white">ORANGE MONEY GUINÉE</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-300">
                  Actif (Mode Test & Direct)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Paiement par Push USSD direct (*144#) sur le numéro du client.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-400 space-y-1">
                <p><strong>Code Marchand :</strong> {gateways.orangeMoney.merchantCode}</p>
                <p><strong>Environnement :</strong> {gateways.orangeMoney.environment}</p>
                <p><strong>Variable serveur :</strong> <code className="text-cyan-400">ORANGE_MONEY_MERCHANT_KEY</code></p>
              </div>
              <p className="text-[11px] text-slate-500">
                Pour obtenir un code marchand officiel en production : rendez-vous à la Direction Orange Guinée ou via leur portail partenaires Orange Money.
              </p>
            </div>

            {/* PayCard Guinea */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-[10px] flex items-center justify-center">
                    CARD
                  </span>
                  <h4 className="text-sm font-extrabold text-white">PAYCARD GUINÉE</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                  Actif (Carte & Wallet)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Intégration API PayCard Guinea pour cartes bancaires et portefeuilles électroniques.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 text-xs text-slate-400 space-y-1">
                <p><strong>ID Marchand :</strong> {gateways.payCard.merchantId}</p>
                <p><strong>Environnement :</strong> {gateways.payCard.environment}</p>
                <p><strong>Variable serveur :</strong> <code className="text-cyan-400">PAYCARD_API_KEY</code></p>
              </div>
              <p className="text-[11px] text-slate-500">
                Pour obtenir vos clés API PayCard : inscrivez-vous sur le portail marchand paycard.co / paycard.gn.
              </p>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 space-y-1">
            <h5 className="font-bold text-cyan-300">Documentation Intégrateur Chap Chap Pay</h5>
            <p className="text-slate-400">
              Chap Chap Pay fournit un agrégateur unique en Guinée combinant Orange Money, MTN et PayCard avec notification webhook serveur à l'adresse <code className="text-cyan-300">/api/payments/webhook</code>.
            </p>
          </div>

        </div>
      )}

      {/* TAB 5: TARIFS & ABONNEMENTS */}
      {activeTab === 'plans' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>Gestion des Formules & Tarifs (Gratuit, Premium, Expert)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Modifiez les tarifs en Francs Guinéens (GNF), les avantages et les limites de chaque abonnement.
              </p>
            </div>

            <button
              onClick={async () => {
                try {
                  setPlansSaving(true);
                  await apiUpdatePricingPlans(plansList);
                  setSuccessNotice('Tarifs et caractéristiques enregistrés avec succès !');
                  setTimeout(() => setSuccessNotice(''), 3000);
                } catch (err: any) {
                  alert(err.message || 'Erreur mise à jour tarifs');
                } finally {
                  setPlansSaving(false);
                }
              }}
              disabled={plansSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center space-x-2 shrink-0 disabled:opacity-50"
            >
              {plansSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>ENREGISTRER LES TARIFS</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansList.map((plan, pIdx) => (
              <div key={plan.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white">{plan.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-cyan-300">
                    {plan.id.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Prix Mensuel en GNF
                  </label>
                  <input
                    type="number"
                    value={plan.priceGNF}
                    onChange={(e) => {
                      const updated = [...plansList];
                      updated[pIdx].priceGNF = Number(e.target.value) || 0;
                      setPlansList(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Slogan / Description courte
                  </label>
                  <input
                    type="text"
                    value={plan.tagline}
                    onChange={(e) => {
                      const updated = [...plansList];
                      updated[pIdx].tagline = e.target.value;
                      setPlansList(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Avantages (un par ligne)
                  </label>
                  <textarea
                    rows={4}
                    value={plan.features.join('\n')}
                    onChange={(e) => {
                      const updated = [...plansList];
                      updated[pIdx].features = e.target.value.split('\n').filter(Boolean);
                      setPlansList(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MESSAGES & DEMANDES DE DEVIS */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Section 1: Contact Messages */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Boîte de Réception des Messages ({contactMsgs.length})</span>
            </h3>

            {contactMsgs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Aucun message reçu pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {contactMsgs.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{msg.name}</span>
                        <span className="text-slate-400">({msg.email} • {msg.phone || 'Sans tel'})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleString('fr-FR')}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 text-slate-300 whitespace-pre-line">
                      <strong className="text-cyan-300 block mb-1">Objet : {msg.subject}</strong>
                      {msg.message}
                    </div>

                    {msg.replyText && (
                      <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                        <strong>Votre réponse :</strong> {msg.replyText}
                      </div>
                    )}

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        placeholder="Rédiger une réponse officielle..."
                        value={replyTextMap[msg.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [msg.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                      <button
                        onClick={async () => {
                          const reply = replyTextMap[msg.id];
                          if (!reply) return;
                          try {
                            setReplyingId(msg.id);
                            await apiReplyContactMessage(msg.id, reply);
                            setSuccessNotice('Réponse enregistrée avec succès !');
                            loadAll();
                            setTimeout(() => setSuccessNotice(''), 2500);
                          } catch (err: any) {
                            alert(err.message);
                          } finally {
                            setReplyingId(null);
                          }
                        }}
                        disabled={replyingId === msg.id}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Répondre</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Service Requests */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Demandes de Devis & Prestations ({serviceReqs.length})</span>
            </h3>

            {serviceReqs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Aucune demande de devis en attente.</p>
            ) : (
              <div className="space-y-3">
                {serviceReqs.map((req) => (
                  <div key={req.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{req.name}</span>
                        <span className="text-cyan-300 font-semibold">• {req.serviceType}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(req.createdAt).toLocaleString('fr-FR')}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-slate-400 text-[11px]">
                      <span>WhatsApp : <strong className="text-white">{req.phone}</strong></span>
                      <span>Email : <strong className="text-white">{req.email}</strong></span>
                      <span>Budget : <strong className="text-emerald-400">{req.budgetGNF}</strong></span>
                      <span>Délai : <strong className="text-purple-300">{req.deadline}</strong></span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900 text-slate-300">
                      {req.description}
                    </div>

                    <div className="flex items-center space-x-3 pt-1">
                      <span className="text-slate-500 font-bold">Statut :</span>
                      {['pending', 'in_progress', 'completed'].map((st) => (
                        <button
                          key={st}
                          onClick={async () => {
                            await apiUpdateServiceRequestStatus(req.id, st);
                            loadAll();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${
                            req.status === st
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st === 'pending' ? 'En attente' : (st === 'in_progress' ? 'En cours' : 'Terminé')}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: SAUVEGARDE DU SYSTÈME */}
      {activeTab === 'backup' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Sauvegarde & Sécurité de la Plateforme</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Exportez l'intégralité des utilisateurs, formations, commandes et créations IA en format JSON sécurisé.
            </p>
          </div>

          {backupRestoreNotice && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs">
              {backupRestoreNotice}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Exporter la Base de Données</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Téléchargez un instantané complet de votre base de données pour archivage ou migration.
              </p>
              <button
                onClick={async () => {
                  try {
                    const backup = await apiGetDatabaseBackup();
                    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `LobbyTech_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  } catch (err: any) {
                    alert('Erreur export : ' + err.message);
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>TÉLÉCHARGER LE FICHIER DE SAUVEGARDE (.JSON)</span>
              </button>
            </div>

            {/* Restore Card */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Restaurer une Sauvegarde</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restaurez les données à partir d'un fichier JSON de sauvegarde précédemment exporté.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async (evt) => {
                    try {
                      const parsed = JSON.parse(evt.target?.result as string);
                      const backupData = parsed.data || parsed;
                      await apiRestoreDatabaseBackup(backupData);
                      setBackupRestoreNotice('Base de données restaurée avec succès !');
                      loadAll();
                      setTimeout(() => setBackupRestoreNotice(''), 3500);
                    } catch (err: any) {
                      alert('Fichier de sauvegarde invalide : ' + err.message);
                    }
                  };
                  reader.readAsText(file);
                }}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-300 hover:file:bg-purple-900/60"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
