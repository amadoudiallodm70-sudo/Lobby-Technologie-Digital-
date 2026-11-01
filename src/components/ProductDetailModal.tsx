import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  FileText, 
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { formatGNF } from '../services/api';

interface ProductDetailModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onBuyNow: (product: DigitalProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-[#090d20] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden my-8">
        
        {/* Cover image header */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <img
            src={product.coverImage}
            alt={product.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d20] via-[#090d20]/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition border border-white/10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
              {product.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key info bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center">
              <Layers className="w-4 h-4 mr-1 text-cyan-400" />
              Type : <strong className="text-white ml-1 uppercase">{product.productType}</strong>
            </span>
            <span className="text-slate-400 flex items-center">
              <Download className="w-4 h-4 mr-1 text-purple-400" />
              Téléchargements : <strong className="text-white ml-1">{product.downloadsCount}</strong>
            </span>
            <span className="text-emerald-400 flex items-center font-semibold">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Vérifié Lobby Tech
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Description du Produit</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Preview / Excerpt */}
          {product.previewExcerpt && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extrait & Aperçu</span>
              </h4>
              <p className="text-xs text-slate-300 italic">
                « {product.previewExcerpt} »
              </p>
            </div>
          )}

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-base font-bold text-white">Ce qui est inclus dans votre achat :</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-900/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached files protection badge */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-purple-200">
              <Lock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Les fichiers haute résolution et archives ZIP sont protégés et débloqués automatiquement après confirmation du paiement.</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Prix direct en Francs Guinéens</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                  {formatGNF(product.priceGNF)}
                </span>
                {product.originalPriceGNF && (
                  <span className="text-base text-slate-500 line-through">
                    {formatGNF(product.originalPriceGNF)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBuyNow(product);
                }}
                className="w-1/2 sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Acheter maintenant</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
            <span className="text-orange-400">Orange Money Guinée</span>
            <span>•</span>
            <span className="text-purple-400">PayCard Guinée</span>
            <span>•</span>
            <span className="text-emerald-400">Téléchargement instantané</span>
          </div>

        </div>

      </div>
    </div>
  );
};
