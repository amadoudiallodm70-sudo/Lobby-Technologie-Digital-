import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  MapPin, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: "Comment fonctionne le paiement par Orange Money en Guinée ?",
      a: "C'est extrêmement simple : cliquez sur « Acheter maintenant », sélectionnez Orange Money et renseignez votre numéro guinéen. Vous recevrez instantanément une notification USSD push sur votre mobile. Validez avec votre code PIN secret Orange Money (*144#), et vos fichiers sont débloqués sur votre écran en quelques secondes."
    },
    {
      q: "Mes achats sont-ils accessibles immédiatement après le paiement ?",
      a: "Oui, à 100%. Notre système vérifie la transaction côté serveur et génère automatiquement un jeton de téléchargement crypté. Vous retrouvez immédiatement tous vos cours et produits dans la rubrique « Mes Achats » de votre Espace Client."
    },
    {
      q: "Puis-je suivre les formations sur mon téléphone portable Android ou iPhone ?",
      a: "Absolument. La plateforme LOBBY TECHNOLOGIE DIGITAL est entièrement responsive et optimisée pour les smartphones, tablettes et ordinateurs. Les vidéos et fichiers PDF se lisent fluidement sans application supplémentaire."
    },
    {
      q: "Comment utiliser le Laboratoire d'Intelligence Artificielle ?",
      a: "Rendez-vous dans la rubrique « Laboratoire IA ». Sélectionnez l'outil souhaité (générateur de prompts Midjourney, scripts vidéo TikTok, paroles de musique, voix off, publicités), entrez votre idée ou choisissez un exemple pré-configuré, puis cliquez sur « Générer ». Vous pouvez copier ou écouter le résultat directement."
    },
    {
      q: "Comment contacter l'assistance en cas de besoin ?",
      a: "Notre service client officiel est joignable 7j/7 directement sur WhatsApp au 611 55 44 71 ou par email à amadoudiallodm70@gmail.com."
    }
  ];

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Contact Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Contact & Assistance Directe</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Besoin d'aide ? Contactez notre Équipe
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Nous sommes à votre écoute pour vous accompagner dans le choix de vos formations et l'utilisation de nos ressources numériques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Official Contact Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0b1026] to-[#070a18] border border-blue-900/30 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">Coordonnées Officielles</h3>
            
            <div className="space-y-4">
              <a
                href="https://wa.me/224611554471?text=Bonjour%20Lobby%20Technologie%20Digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                    WhatsApp Officiel Guinée
                  </span>
                  <span className="text-sm font-extrabold text-white">611 55 44 71</span>
                  <p className="text-[11px] text-slate-400">Cliquez pour démarrer une conversation WhatsApp</p>
                </div>
              </a>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block">
                    Adresse Email Officielle
                  </span>
                  <span className="text-sm font-extrabold text-white">amadoudiallodm70@gmail.com</span>
                  <p className="text-[11px] text-slate-400">Réponse garantie sous 24 heures ouvrées</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider block">
                    Siège de l'entreprise
                  </span>
                  <span className="text-sm font-extrabold text-white">Conakry, République de Guinée</span>
                  <p className="text-[11px] text-slate-400">Services disponibles partout en Afrique et à l'International</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center space-x-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Assistance en ligne disponible 7j/7 de 08h à 22h</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090d20] border border-blue-500/20 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white">Envoyez-nous un Message</h3>

            {sent ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Message envoyé avec succès !</h4>
                <p className="text-xs text-slate-300">
                  Notre équipe va traiter votre demande et vous recontacter par WhatsApp ou email dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Votre Nom complet <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Thierno Bah"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Téléphone WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+224 622 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nom@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Sujet de votre demande
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ex: Question sur la formation IA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Votre Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez votre message ici..."
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-8 border-t border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>Foire Aux Questions (FAQ)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Trouvez les réponses immédiates aux questions les plus fréquentes sur notre fonctionnement.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-white hover:text-cyan-300 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
