import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { apiSendContactMessage } from '../services/api';

const FAQS = [
  {
    question: "Comment effectuer un paiement par Orange Money ou PayCard en Guinée ?",
    answer: "Sur Lobby Technologie Digital, les paiements sont 100% automatisés. Sélectionnez votre formation ou produit, cliquez sur 'Acheter maintenant' ou 'Payer', renseignez votre numéro Orange Money (ex: 611 55 44 71). Vous recevez un push USSD sur votre téléphone avec le code *144# pour valider votre code secret. Dès validation, vos cours et téléchargements sont débloqués instantanément."
  },
  {
    question: "Puis-je suivre les formations sur mon téléphone Android ou iPhone ?",
    answer: "Oui, absolument ! La plateforme Lobby Technologie Digital a été spécialement développée et optimisée pour tous les smartphones Android, iPhone, tablettes et ordinateurs. Vous pouvez regarder les vidéos de cours, télécharger vos PDF et utiliser notre Laboratoire IA directement depuis votre navigateur mobile."
  },
  {
    question: "Comment fonctionne le Laboratoire d'Intelligence Artificielle ?",
    answer: "Notre Laboratoire IA est directement intégré sur la plateforme. Il vous permet de générer des vidéos avec Google Veo 3 et Vidogrip, de créer des images avec Gemini, de retoucher vos affiches dans notre Studio Canvas, et de générer des scripts TikTok ou des voix off sans quitter votre compte."
  },
  {
    question: "Obtient-on une attestation ou un certificat de réussite ?",
    answer: "Oui ! Chaque formation certifiante terminée à 100% vous délivre automatiquement une attestation officielle avec un numéro d'identification unique vérifiable délivré par Lobby Technologie Digital."
  },
  {
    question: "Où se trouvent vos bureaux et comment joindre l'équipe ?",
    answer: "Notre siège est situé à Conakry en République de Guinée. Notre support client est joignable 24h/24 et 7j/7 directement sur WhatsApp au 611 55 44 71 et par e-mail à amadoudiallodm70@gmail.com."
  }
];

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Veuillez renseigner les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      const res = await apiSendContactMessage({
        name,
        email,
        phone,
        subject: subject || 'Contact général',
        message
      });
      setSuccessMsg(res.message || 'Votre message a bien été transmis à notre équipe !');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l\'envoi du message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Headphones className="w-4 h-4 text-cyan-400" />
          <span>SUPPORT CLIENT & DIRECTION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Contactez l'Équipe Lobby Technologie Digital
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Une question sur une formation ? Besoin d'assistance pour un paiement Orange Money ou PayCard ? Notre équipe basée à Conakry vous répond rapidement.
        </p>
      </div>

      {/* Grid: Coordinates & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Contact Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-8 rounded-3xl bg-[#070b1e] border border-blue-500/30 space-y-6">
            <h3 className="text-xl font-black text-white">
              Coordonnées Officielles
            </h3>

            <div className="space-y-4 text-sm">
              <a
                href="https://wa.me/224611554471?text=Bonjour%20Lobby%20Technologie%20Digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    WhatsApp Direct & Assistance
                  </span>
                  <span className="text-white font-mono font-bold text-base">
                    611 55 44 71
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    +224 611 55 44 71 • Disponible 7j/7
                  </p>
                </div>
              </a>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Adresse E-mail Officielle
                  </span>
                  <span className="text-white font-medium text-sm break-all">
                    amadoudiallodm70@gmail.com
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Réponse sous 24h ouvrées
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                    Localisation & Siège
                  </span>
                  <span className="text-white font-semibold text-sm">
                    Conakry, République de Guinée
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Commune de Ratoma / Dixinn • Hub Technologique
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider block">
                    Heures d'Ouverture du Support
                  </span>
                  <span className="text-white font-medium text-sm">
                    Lundi – Samedi : 08h00 – 21h00
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Permanence WhatsApp assurée le dimanche
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 block">
                Suivez nos actualités numériques :
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition"
                >
                  Facebook
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition"
                >
                  TikTok
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition"
                >
                  YouTube
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition"
                >
                  LinkedIn
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Right column: Interactive Message Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-[#090d22] border border-slate-800 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-white">
                Envoyez-nous un Message
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Remplissez ce formulaire et notre équipe vous recontactera sous peu.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Nom & Prénom <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mamadou Diallo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Numéro WhatsApp / Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="611 55 44 71"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Objet de votre Message
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Question sur la formation IA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Votre Message <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez-nous votre demande, vos besoins ou vos questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Envoi du message en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ENVOYER LE MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            FOIRE AUX QUESTIONS (FAQ)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Questions Fréquentes de nos Apprenants
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Tout ce qu'il faut savoir sur nos formations, paiements et outils IA en Guinée.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left space-x-4 hover:bg-slate-800/50 transition"
                >
                  <span className="text-sm font-bold text-white">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
