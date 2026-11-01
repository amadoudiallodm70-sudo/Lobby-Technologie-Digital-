import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle, 
  ArrowRight, 
  Loader2,
  Crown,
  Star,
  CheckCircle2
} from 'lucide-react';
import { SubscriptionPlan, PlanTier } from '../types';
import { apiGetPricingPlans, apiSubscribePlan, formatGNF } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const PricingPage: React.FC<{ onNavigateCourses?: () => void }> = ({ onNavigateCourses }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [subscribingTier, setSubscribingTier] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string>('');

  const { user, requireAuth, refreshUser } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGetPricingPlans();
        setPlans(data);
      } catch (err) {
        console.error('Erreur chargement plans', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!requireAuth({ targetTab: 'pricing' })) return;

    setErrorNotice('');
    setSuccessNotice('');
    setSubscribingTier(plan.id);

    try {
      const res = await apiSubscribePlan({
        planId: plan.id,
        paymentMethod: 'orange_money',
        customerPhone: user?.phone || '611554471',
      });
      setSuccessNotice(`Félicitations ! Votre formule ${plan.name} a été activée avec succès.`);
      await refreshUser();
    } catch (err: any) {
      setErrorNotice(err.message || 'Erreur lors de la souscription.');
    } finally {
      setSubscribingTier(null);
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    if (plan.priceGNF === 0) return '0 GNF';
    if (billingPeriod === 'year') {
      // 20% discount on yearly
      const yearlyMonthly = Math.round(plan.priceGNF * 0.8 * 12);
      return `${formatGNF(yearlyMonthly)} / an`;
    }
    return `${formatGNF(plan.priceGNF)} / mois`;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span>FORMULES D'ABONNEMENT OFFICIELLES</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Investissez dans vos compétences & accélérez avec l'IA
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Choisissez la formule adaptée à votre ambition. Paiement direct et sécurisé en République de Guinée par Orange Money (*144#) et PayCard.
        </p>

        {/* Billing period switcher */}
        <div className="pt-4 flex items-center justify-center space-x-3">
          <span className={`text-xs font-semibold ${billingPeriod === 'month' ? 'text-white' : 'text-slate-400'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
            className="w-14 h-8 rounded-full bg-slate-900 border border-slate-700 p-1 relative transition"
          >
            <div 
              className={`w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform ${
                billingPeriod === 'year' ? 'translate-x-6' : 'translate-x-0'
              }`} 
            />
          </button>
          <div className="flex items-center space-x-1.5">
            <span className={`text-xs font-semibold ${billingPeriod === 'year' ? 'text-white' : 'text-slate-400'}`}>
              Annuel
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              -20% Réduction
            </span>
          </div>
        </div>

      </div>

      {/* Notices */}
      {successNotice && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm text-center flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs sm:text-sm text-center">
          {errorNotice}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const isCurrent = user?.currentPlan === plan.id;
          const isHighlighted = plan.highlighted;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition duration-300 ${
                isHighlighted
                  ? 'bg-gradient-to-b from-[#0f173d] to-[#070b1e] border-2 border-cyan-400/60 shadow-2xl shadow-cyan-950/50 transform md:-translate-y-2'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  Formule Recommandée
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Votre Formule Actuelle
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {getPrice(plan)}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {plan.priceGNF === 0 ? 'Sans carte ni paiement requis' : 'Paiement Orange Money Guinée & PayCard'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                    Avantages inclus :
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-slate-800">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={subscribingTier === plan.id || isCurrent}
                  className={`w-full py-4 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-lg ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isHighlighted
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-blue-600/30 transform hover:-translate-y-0.5'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {subscribingTier === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activation en cours...</span>
                    </>
                  ) : isCurrent ? (
                    <span>Formule Active</span>
                  ) : (
                    <>
                      <span>{plan.priceGNF === 0 ? 'Commencer Gratuitement' : 'Choisir cette Formule'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="p-8 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-6">
        <h3 className="text-xl font-black text-white text-center">
          Tableau comparatif détaillé des fonctionnalités
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-900/80 text-cyan-400 border-b border-slate-800 font-bold">
              <tr>
                <th className="py-3 px-4">Fonctionnalité</th>
                <th className="py-3 px-4 text-center">Gratuit</th>
                <th className="py-3 px-4 text-center text-cyan-300">Premium</th>
                <th className="py-3 px-4 text-center text-purple-300">Expert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Générations d'images IA</td>
                <td className="py-3.5 px-4 text-center">5 / jour</td>
                <td className="py-3.5 px-4 text-center text-cyan-300 font-bold">100 / mois</td>
                <td className="py-3.5 px-4 text-center text-purple-300 font-bold">Illimité</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Génération Vidéo (Google Veo 3)</td>
                <td className="py-3.5 px-4 text-center text-slate-500">—</td>
                <td className="py-3.5 px-4 text-center text-cyan-300 font-bold">25 vidéos / mois</td>
                <td className="py-3.5 px-4 text-center text-purple-300 font-bold">Illimité</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Accès aux Formations Vidéo</td>
                <td className="py-3.5 px-4 text-center">Modules d'intro</td>
                <td className="py-3.5 px-4 text-center">Catalogue standard</td>
                <td className="py-3.5 px-4 text-center text-purple-300 font-bold">100% + Masterclasses VIP</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Studio Graphique Canvas</td>
                <td className="py-3.5 px-4 text-center">Basique</td>
                <td className="py-3.5 px-4 text-center">Avancé (Export HD)</td>
                <td className="py-3.5 px-4 text-center text-purple-300 font-bold">Pro (4K & Templates)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Certificat de Réussite</td>
                <td className="py-3.5 px-4 text-center text-slate-500">—</td>
                <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">Inclus</td>
                <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">Inclus + Vérification QR</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-white">Support & Assistance</td>
                <td className="py-3.5 px-4 text-center">Communauté</td>
                <td className="py-3.5 px-4 text-center">WhatsApp 7j/7</td>
                <td className="py-3.5 px-4 text-center text-purple-300 font-bold">Ligne directe & 2h coaching</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
