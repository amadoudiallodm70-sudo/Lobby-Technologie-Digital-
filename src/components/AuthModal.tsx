import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon,
  Globe,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
  'Guinée',
  'Sénégal',
  'Côte d\'Ivoire',
  'Mali',
  'Burkina Faso',
  'Cameroun',
  'Bénin',
  'Togo',
  'France',
  'Autre pays'
];

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalView, 
    setAuthModalView,
    login, 
    register, 
    forgotPassword, 
    resetPassword,
    intendedAction,
    setIntendedAction
  } = useAuth();

  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Guinée');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot / Reset Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Reset errors when view changes
  useEffect(() => {
    setError('');
    setSuccessNotice('');
  }, [authModalView]);

  if (!isAuthModalOpen) return null;

  // Handle successful auth completion and trigger intended navigation
  const handleAuthComplete = () => {
    closeAuthModal();
    if (onSuccess) onSuccess();
  };

  // 1. Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères pour votre sécurité.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions générales d\'utilisation et la politique de confidentialité.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name,
        email,
        phone,
        country,
        password,
        confirmPassword,
        acceptTerms,
      });

      setSuccessNotice('Compte créé avec succès ! Bienvenue chez Lobby Technologie Digital.');
      setTimeout(() => {
        handleAuthComplete();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginPassword) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      setLoading(true);
      await login(loginEmail, loginPassword, rememberMe);
      setSuccessNotice('Connexion réussie ! Redirection en cours...');
      setTimeout(() => {
        handleAuthComplete();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Forgot Password Request
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(forgotEmail);
      if (res.resetCode) {
        setResetCode(res.resetCode); // Pre-fill for instant demo testing
      }
      setSuccessNotice(res.message);
      setResetStep(2);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande de réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Password Reset
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetCode.trim()) {
      setError('Veuillez saisir le code reçu.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(forgotEmail, resetCode, newPassword, confirmNewPassword);
      setSuccessNotice('Mot de passe réinitialisé ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        setAuthModalView('login');
        setResetStep(1);
        setLoginEmail(forgotEmail);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick triggers
  const handleDemoClient = async () => {
    try {
      setLoading(true);
      await login('client@lobbytech.gn', 'client123', true);
      handleAuthComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    try {
      setLoading(true);
      await login('amadoudiallodm70@gmail.com', 'admin123', true);
      handleAuthComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#090d22] border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden my-6">
        
        {/* Header with Brand Logo */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#060814]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#090d22] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white">
                  LOBBY <span className="text-cyan-400">TECHNOLOGIE</span>
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  DIGITAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Espace Sécurisé d'Authentification</p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Intended Action Banner (Shows what feature they were trying to access) */}
        {intendedAction && (
          <div className="bg-gradient-to-r from-blue-950/80 via-purple-950/60 to-blue-950/80 px-5 py-2.5 border-b border-blue-500/20 flex items-center space-x-2 text-xs text-cyan-300">
            <Lock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>
              Accès réservé : Connectez-vous ou créez votre compte pour continuer.
            </span>
          </div>
        )}

        {/* Error / Success Notices */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 1 : GATEWAY / ACCUEIL DES VISITEURS AVEC 2 CHOIX       */}
        {/* ----------------------------------------------------------- */}
        {authModalView === 'gateway' && (
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/40">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Bienvenue chez LOBBY TECHNOLOGIE DIGITAL !
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                « Découvrez un univers de formations numériques, d'intelligence artificielle et de ressources professionnelles. Créez votre compte pour accéder à notre plateforme et développer vos compétences. »
              </p>
            </div>

            {/* Benefits Checklist */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                Vos avantages en créant un compte :
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Accès illimité aux 12 catégories de formations certifiantes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Utilisation directe de Mon Laboratoire IA (prompts, vidéos, voix)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Téléchargement immédiat après paiement Orange Money & PayCard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Tableau de bord personnalisé avec factures acquittées en GNF</span>
                </div>
              </div>
            </div>

            {/* TWO PRIMARY CHOICES AS REQUESTED */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setAuthModalView('register')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm tracking-wide shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>CRÉER MON COMPTE</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>J'AI DÉJÀ UN COMPTE (SE CONNECTER)</span>
              </button>
            </div>

            {/* Fast Demo Access */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-3 text-xs">
              <span className="text-slate-500">Test rapide :</span>
              <button
                type="button"
                onClick={handleDemoClient}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Connexion Client Démo
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="text-purple-400 hover:underline font-semibold"
              >
                Connexion Directeur Admin
              </button>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 2 : FORMULAIRE DE CRÉATION DE COMPTE                   */}
        {/* ----------------------------------------------------------- */}
        {authModalView === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-black text-white">Créer mon Compte</h4>
                <p className="text-[11px] text-slate-400">Rejoignez la communauté d'apprenants Lobby Tech</p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-cyan-400 hover:underline text-xs font-semibold"
              >
                Déjà inscrit ?
              </button>
            </div>

            {/* Nom et Prénom */}
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Nom et Prénom <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Mamadou Diallo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Adresse Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="votre.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                />
              </div>
            </div>

            {/* Téléphone WhatsApp & Pays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Numéro WhatsApp <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="611 55 44 71"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Pays de résidence <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white text-sm focus:outline-none transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mot de passe & Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Mot de passe (min 6 car.) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Confirmer le mot de passe <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Checkbox CGU */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-cyan-600 bg-slate-950 border-slate-700 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300 leading-snug">
                  J'accepte les <strong className="text-cyan-400">Conditions Générales d'Utilisation</strong> et la <strong className="text-cyan-400">Politique de Confidentialité</strong> de Lobby Technologie Digital.
                </span>
              </label>
            </div>

            {/* Bouton Créer mon compte */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Création de votre compte sécurisé...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>CRÉER MON COMPTE</span>
                </>
              )}
            </button>

            <div className="text-center pt-1 text-[11px] text-slate-500">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-cyan-400 hover:underline font-bold"
              >
                Se connecter
              </button>
            </div>

          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 3 : CONNEXION DES UTILISATEURS                         */}
        {/* ----------------------------------------------------------- */}
        {authModalView === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-black text-white">Connexion</h4>
                <p className="text-[11px] text-slate-400">Accédez à votre espace apprenant</p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalView('register')}
                className="text-cyan-400 hover:underline text-xs font-semibold"
              >
                Créer un compte
              </button>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Adresse Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="votre.email@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-bold block">
                  Mot de passe <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalView('forgot_password');
                    setForgotEmail(loginEmail);
                  }}
                  className="text-cyan-400 hover:underline text-[11px]"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Rester connecté */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">Rester connecté sur cet appareil</span>
              </label>
            </div>

            {/* Bouton Se connecter */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Vérification des identifiants...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>SE CONNECTER</span>
                </>
              )}
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block text-center">
                Connexion Rapide Démo :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDemoClient}
                  className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 font-semibold transition"
                >
                  Compte Client Démo
                </button>
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  className="py-2 px-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-950/70 border border-purple-500/40 text-[11px] text-purple-300 font-semibold transition"
                >
                  Compte Directeur Admin
                </button>
              </div>
            </div>

          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 4 : RÉCUPÉRATION DE MOT DE PASSE OUBLIÉ                */}
        {/* ----------------------------------------------------------- */}
        {authModalView === 'forgot_password' && (
          <div className="p-6 sm:p-8 space-y-4 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-lg font-black text-white">Récupération de Compte</h4>
                <p className="text-[11px] text-slate-400">Réinitialisez votre mot de passe en toute sécurité</p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-cyan-400 hover:underline text-xs"
              >
                Retour
              </button>
            </div>

            {resetStep === 1 ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-slate-300 text-xs">
                  Entrez l'adresse email associée à votre compte. Nous allons vous transmettre un code de sécurité à 6 chiffres.
                </p>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Votre Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="votre.email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Envoyer le code de réinitialisation</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-cyan-300">
                  Un code à 6 chiffres a été généré pour <strong>{forgotEmail}</strong>.
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Code de sécurité à 6 chiffres
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center py-2.5 rounded-xl bg-slate-950 border border-cyan-500/60 text-cyan-400 font-mono font-bold text-lg tracking-widest focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Nouveau mot de passe (min 6 car.)
                  </label>
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
                  <label className="text-slate-300 font-bold block mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Enregistrer mon nouveau mot de passe</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
