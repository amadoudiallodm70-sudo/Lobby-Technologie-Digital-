import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const phoneNumber = '224611554471'; // Official WhatsApp Guinea: 611 55 44 71
  const message = encodeURIComponent('Bonjour Lobby Technologie Digital ! Je souhaite obtenir des informations sur vos formations et produits digitaux.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {showTooltip && (
        <div className="relative bg-[#0d1326] border border-emerald-500/40 text-slate-200 text-xs py-2.5 px-3.5 rounded-2xl shadow-xl shadow-black/60 max-w-xs animate-bounce flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <p className="font-bold text-emerald-400">Besoin d'aide ?</p>
            <p className="text-[11px] text-slate-300">Écrivez-nous sur WhatsApp au <span className="font-semibold text-white">611 55 44 71</span></p>
          </div>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full transition"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/60 hover:scale-105 active:scale-95 transition-all duration-300"
        title="Contacter Lobby Technologie sur WhatsApp (611 55 44 71)"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>
      </a>
    </div>
  );
};
