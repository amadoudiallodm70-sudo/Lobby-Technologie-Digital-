import React, { useState, useEffect } from 'react';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Award, 
  TrendingUp, 
  Users,
  ShieldCheck
} from 'lucide-react';
import { apiGetReviews, apiSubmitReview } from '../services/api';
import { Review } from '../types';
import { useAuth } from '../context/AuthContext';

export const TestimonialsSection: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalReviews: 4, averageRating: 4.9, verifiedLearnersRate: '100%' });
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [serviceCategory, setServiceCategory] = useState("Intelligence artificielle");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await apiGetReviews();
      setReviews(data.reviews || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Erreur chargement avis', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    try {
      setSubmitting(true);
      await apiSubmitReview({
        customerName,
        serviceCategory,
        rating,
        comment,
      });

      setSuccessMessage('Merci ! Votre avis a été enregistré et publié avec le badge vérifié.');
      setComment('');
      setIsFormOpen(false);
      loadReviews();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'enregistrement de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="temoignages" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Retours d'Expérience Réels</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ce que disent nos apprenants et clients
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Des témoignages 100% authentiques laissés par les étudiants et entrepreneurs ayant suivi nos formations en République de Guinée.
        </p>
      </div>

      {/* Dynamic Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-yellow-400" />
            ))}
          </div>
          <span className="text-2xl font-black text-white">{stats.averageRating} / 5</span>
          <p className="text-xs text-slate-400">Note moyenne certifiée</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <span className="text-2xl font-black text-cyan-400">{reviews.length} Avis</span>
          <p className="text-xs text-slate-400">Témoignages enregistrés</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <span className="text-2xl font-black text-emerald-400">100%</span>
          <p className="text-xs text-slate-400">Apprenants Vérifiés</p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Review Trigger */}
      <div className="text-center">
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition shadow-lg inline-flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Laisser un avis d'apprenant</span>
          </button>
        ) : (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#0a0e24] border border-cyan-500/30 text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white">Partagez votre avis sur Lobby Tech</h4>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white text-xs">
                Fermer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Votre Nom complet :</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Ibrahima Diallo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Catégorie suivie :</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="Intelligence artificielle">Intelligence artificielle</option>
                  <option value="Création de vidéos avec l'IA">Création de vidéos avec l'IA</option>
                  <option value="Photoshop et design graphique">Photoshop et design graphique</option>
                  <option value="Excel et Word">Excel et Word</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Documents professionnels">Documents professionnels</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Votre Note :</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Votre commentaire :</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Expliquez ce que cette formation ou ressource vous a apporté..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publier mon avis</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#0c1024] to-[#070914] border border-slate-800/80 hover:border-blue-500/30 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Rating stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-0.5 text-yellow-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
              </div>

              {/* Service target pill */}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-cyan-400 border border-blue-500/20 inline-block">
                {rev.serviceCategory}
              </span>

              {/* Comment text */}
              <p className="text-xs text-slate-300 leading-relaxed italic">
                « {rev.comment} »
              </p>
            </div>

            {/* Author info & Verified Badge */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={rev.customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={rev.customerName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs font-bold text-white truncate max-w-[110px]">
                  {rev.customerName}
                </span>
              </div>

              {rev.isVerifiedLearner && (
                <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Apprenant vérifié</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
