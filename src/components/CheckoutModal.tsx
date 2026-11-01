import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiInitiateOrder, apiConfirmPayment, formatGNF } from '../services/api';
import { OrderItem } from '../types';

interface CheckoutModalProps {
  onSuccessNavigate?: (tab: 'client-dashboard' | 'courses' | 'products') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccessNavigate }) => {
  const { isCheckoutOpen, closeCheckout, checkoutItem, items, clearCart } = useCart();
  const { user } = useAuth();

  // Selected items to buy
  const itemsToBuy: OrderItem[] = checkoutItem ? [checkoutItem] : items;
  const totalAmountGNF = itemsToBuy.reduce((sum, it) => sum + (it.priceGNF || 0), 0);

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'paycard'>('orange_money');

  // Checkout Step: 1 = Form, 2 = Processing / USSD Auth, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [otpCode, setOtpCode] = useState('1234');
  const [downloadToken, setDownloadToken] = useState('');

  if (!isCheckoutOpen || itemsToBuy.length === 0) return null;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone (Orange Money ou PayCard)');
      return;
    }

    try {
      setLoading(true);
      const res = await apiInitiateOrder({
        items: itemsToBuy,
        customerName,
        customerEmail: customerEmail || 'client@lobbytech.gn',
        customerPhone,
        paymentMethod,
      });

      setOrderData(res.order);
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async () => {
    if (!orderData) return;

    try {
      setLoading(true);
      setErrorMessage('');

      const res = await apiConfirmPayment({
        orderId: orderData.id,
        otp: otpCode,
        isTestMode: true,
      });

      setDownloadToken(res.downloadToken);
      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Ignore confetti if blocked
      }

      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec lors de la validation du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrorMessage('');
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-[#090d20] border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-purple-600 to-blue-600 flex items-center justify-center p-0.5 shadow-md">
              <div className="w-full h-full bg-[#090d20] rounded-[6px] flex items-center justify-center">
                <Lock className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Paiement Sécurisé Chariow-Style</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GUINÉE (GNF)
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Orange Money & PayCard • Validation Automatique</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: ORDER RECAP & PAYMENT METHOD SELECTION */}
        {step === 1 && (
          <form onSubmit={handleInitiatePayment} className="p-6 sm:p-8 space-y-6">
            
            {/* Order Items Preview */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Articles commandés ({itemsToBuy.length}) :
              </span>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {itemsToBuy.map((it) => (
                  <div key={it.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/40 last:border-b-0">
                    <div className="flex items-center space-x-2.5 max-w-[70%]">
                      {it.coverImage ? (
                        <img src={it.coverImage} alt={it.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-blue-900/50 flex items-center justify-center text-cyan-400 shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-white font-medium truncate">{it.title}</span>
                    </div>
                    <span className="font-bold text-cyan-400 font-mono">
                      {formatGNF(it.priceGNF)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase">Montant Total à Payer :</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-300">
                  {formatGNF(totalAmountGNF)}
                </span>
              </div>
            </div>

            {/* Error notice */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nom et Prénom <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mamadou Diallo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Numéro de Téléphone (Guinée) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +224
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="622 00 00 00"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Adresse Email (pour recevoir la facture)
                  </label>
                  <input
                    type="email"
                    placeholder="amadou@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600 text-sm focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTOR (ORANGE MONEY & PAYCARD) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Choisissez votre moyen de paiement en Guinée :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Option 1: ORANGE MONEY */}
                <div
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === 'orange_money'
                      ? 'bg-orange-950/25 border-orange-500 shadow-lg shadow-orange-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black text-sm flex items-center justify-center shadow-md">
                        OM
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">ORANGE MONEY</h4>
                        <p className="text-[11px] text-orange-400 font-medium">Guinée (*144#)</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'orange_money' ? 'border-orange-500 bg-orange-500' : 'border-slate-600'
                    }`}>
                      {paymentMethod === 'orange_money' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Débit direct via invite USSD Push sur votre téléphone Orange.
                  </p>
                </div>

                {/* Option 2: PAYCARD */}
                <div
                  onClick={() => setPaymentMethod('paycard')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === 'paycard'
                      ? 'bg-purple-950/25 border-purple-500 shadow-lg shadow-purple-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                        CARD
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white">PAYCARD</h4>
                        <p className="text-[11px] text-purple-400 font-medium">Carte & Portefeuille GN</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'paycard' ? 'border-purple-500 bg-purple-500' : 'border-slate-600'
                    }`}>
                      {paymentMethod === 'paycard' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Paiement instantané par carte bancaire ou compte PayCard Guinée.
                  </p>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connexion à la passerelle de paiement...</span>
                </>
              ) : (
                <>
                  <span>Payer {formatGNF(totalAmountGNF)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chiffrement bancaire 256-bit • Transaction officielle certifiée</span>
            </div>

          </form>
        )}

        {/* STEP 2: USSD / PIN SIMULATION OR CONFIRMATION */}
        {step === 2 && orderData && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/40">
                <Smartphone className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {paymentMethod === 'orange_money' ? 'Validation Orange Money Guinée' : 'Validation PayCard Guinée'}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {paymentMethod === 'orange_money'
                  ? `Une invite de paiement a été envoyée au +224 ${customerPhone}. Entrez votre code secret Orange Money ou utilisez le code de test ci-dessous pour confirmer.`
                  : `Entrez le code de sécurité PayCard reçu par SMS au +224 ${customerPhone}.`}
              </p>
            </div>

            {/* Transaction Recap Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Référence commande :</span>
                <span className="font-mono text-cyan-300 font-bold">{orderData.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Montant exact :</span>
                <span className="font-mono text-white font-bold">{formatGNF(orderData.totalGNF)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Passerelle :</span>
                <span className="font-bold text-slate-200 uppercase">{paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Code / OTP input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Code de confirmation / PIN test :
                </label>
                <span className="text-[11px] text-cyan-400 font-medium">Code par défaut : 1234</span>
              </div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-full text-center py-3 rounded-xl bg-slate-950 border border-cyan-500/50 text-xl font-bold tracking-widest text-cyan-400 focus:outline-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleConfirmTransaction}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Vérification de la transaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmer le paiement et débloquer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white"
              >
                Modifier le moyen de paiement ou le numéro
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-cyan-300">💡 Déblocage automatique en temps réel</p>
              <p>Dès la confirmation, le serveur génère votre jeton d'accès sécurisé et vos contenus apparaissent dans votre Espace Client.</p>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & INSTANT UNLOCK */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Paiement Confirmé avec Succès !
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Votre transaction <strong className="text-cyan-400">{orderData?.reference}</strong> est validée. Vos produits et formations sont désormais débloqués pour vous.
              </p>
            </div>

            {/* Direct download / access actions */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 text-left">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Vos contenus prêts à l'emploi :
              </span>
              <div className="space-y-2">
                {itemsToBuy.map((it) => (
                  <div key={it.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-white font-medium truncate max-w-[65%]">{it.title}</span>
                    <a
                      href={`/api/downloads/${downloadToken || 'token-demo-101'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1 shadow-sm transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  if (onSuccessNavigate) {
                    onSuccessNavigate('client-dashboard');
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg transition"
              >
                Accéder à mon Espace Client (Mes Achats)
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white"
              >
                Continuer mes achats sur la boutique
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Une assistance ? Contactez notre support WhatsApp officiel au <strong className="text-emerald-400">611 55 44 71</strong>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
