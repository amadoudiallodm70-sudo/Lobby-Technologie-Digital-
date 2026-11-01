import React, { useState, useEffect } from 'react';
import { 
  Library, 
  Search, 
  Download, 
  FileText, 
  Layers, 
  Zap, 
  CheckCircle, 
  Tag, 
  Sparkles,
  Lock,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { apiGetProducts, formatGNF } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';

const CATEGORIES = [
  { id: 'all', label: 'Toutes les ressources' },
  { id: 'Ebooks & Livres', label: 'E-books & Livres' },
  { id: 'Documents professionnels', label: 'Contrats & Juridique OHADA' },
  { id: 'Modèles graphiques', label: 'Templates Canva & PSD' },
  { id: 'Guides pratiques', label: 'Bibles de Prompts IA' },
  { id: 'Logiciels et ressources', label: 'Logiciels & Assistants' },
  { id: 'Vidéos éducatives', label: 'Vidéos & Tutoriels' }
];

export const ResourcesPage: React.FC = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  const { requireAuth } = useAuth();
  const { openCheckoutWithItem } = useCart();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGetProducts(selectedCategory, searchQuery);
        setProducts(data);
      } catch (err) {
        console.error('Erreur chargement bibliothèque', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products.filter((p) => {
    if (filterType === 'free') return p.priceGNF === 0 || p.isFree;
    if (filterType === 'premium') return p.priceGNF > 0 && !p.isFree;
    return true;
  });

  const handleDownloadFree = (product: DigitalProduct) => {
    if (!requireAuth({ targetTab: 'resources', actionType: 'download', payload: product })) return;
    const file = product.attachedFiles && product.attachedFiles[0];
    if (file && file.url) {
      window.open(file.url, '_blank');
    } else {
      window.open(`/uploads/Guide_Secret_Prompts_IA_2026.pdf`, '_blank');
    }
  };

  const handleBuyNow = (product: DigitalProduct) => {
    if (!requireAuth({ targetTab: 'resources', actionType: 'buy_product', payload: product })) return;
    openCheckoutWithItem({
      id: product.id,
      title: product.name,
      type: 'digital_product',
      priceGNF: product.priceGNF,
      coverImage: product.coverImage,
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Library className="w-4 h-4 text-purple-400" />
          <span>BIBLIOTHÈQUE NUMÉRIQUE LOBBY TECH</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Ressources, Ebooks, Modèles & Bibles de Prompts
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Accédez à des centaines de ressources professionnelles : contrats OHADA, templates Canva prêts à l'emploi, guides de monétisation et packs téléchargeables immédiatement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un ebook, contrat OHADA, prompt, template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>

          {/* Free vs Premium Toggle */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setFilterType('free')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                filterType === 'free'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Ressources Gratuites
            </button>
            <button
              onClick={() => setFilterType('premium')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                filterType === 'premium'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-purple-400'
              }`}
            >
              Packs Premium
            </button>
          </div>

        </div>

        {/* Categories Scrollable Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-800/80">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Chargement des ressources numériques...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-3xl bg-slate-900/30 border border-slate-800 space-y-2">
          <p className="text-base font-semibold text-slate-300">Aucune ressource trouvée pour cette recherche</p>
          <p className="text-xs">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isFree = product.priceGNF === 0 || product.isFree;

            return (
              <div
                key={product.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 overflow-hidden flex flex-col justify-between transition duration-300 group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 uppercase">
                      {product.category}
                    </span>

                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isFree 
                        ? 'bg-emerald-500/80 text-white' 
                        : 'bg-purple-600/80 text-white'
                    }`}>
                      {isFree ? 'GRATUIT' : 'PREMIUM'}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {product.features && product.features.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        {product.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Tarif</span>
                      <span className="text-lg font-black text-cyan-400">
                        {isFree ? 'Téléchargement Libre' : formatGNF(product.priceGNF)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
                    >
                      Aperçu
                    </button>

                    {isFree ? (
                      <button
                        onClick={() => handleDownloadFree(product)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition flex items-center justify-center space-x-1"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Acheter</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod) => handleBuyNow(prod)}
      />

    </div>
  );
};
