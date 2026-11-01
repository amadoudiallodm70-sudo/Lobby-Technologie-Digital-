import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  FileText, 
  Layers, 
  Zap, 
  Eye, 
  CheckCircle, 
  Tag
} from 'lucide-react';
import { DigitalProduct } from '../types';
import { apiGetProducts, formatGNF } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';

const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Tous les produits' },
  { id: 'Ebooks & Livres', label: 'Ebooks & Livres' },
  { id: 'Documents professionnels', label: 'Documents & Contrats' },
  { id: 'Vidéos éducatives', label: 'Vidéos Éducatives' },
  { id: 'Modèles graphiques', label: 'Templates Canva & PSD' },
  { id: 'Logiciels et ressources', label: 'Logiciels & Outils' },
  { id: 'Guides pratiques', label: 'Guides & Prompts' }
];

export const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
        console.error('Erreur chargement produits', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, searchQuery]);

  const handleViewProduct = (product: DigitalProduct) => {
    if (!requireAuth({ targetTab: 'products', actionType: 'download', payload: product })) return;
    setSelectedProduct(product);
  };

  const handleBuyNow = (product: DigitalProduct) => {
    if (!requireAuth({ targetTab: 'products', actionType: 'buy_product', payload: product })) return;
    openCheckoutWithItem({
      id: product.id,
      title: product.name,
      type: 'digital_product',
      priceGNF: product.priceGNF,
      coverImage: product.coverImage,
    });
  };

  return (
    <section id="produits" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Boutique Digitale Type Chariow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Ressources & Produits Numériques Prêts à l'Emploi
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Téléchargez immédiatement vos ebooks, packs de contrats OHADA, templates Canva, logiciels bureautiques et bibles de prompts IA après validation de paiement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="relative max-w-md mx-auto sm:max-w-none flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un ebook, contrat, pack Canva, logiciel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-purple-500 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aucun produit trouvé</h3>
          <p className="text-sm text-slate-400">Essayez une autre recherche ou filtre de catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0e122b] to-[#070917] border border-purple-900/20 hover:border-purple-500/40 transition duration-300 overflow-hidden shadow-xl hover:shadow-purple-950/30"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={product.coverImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e122b] via-transparent to-black/40" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                    {product.category}
                  </span>

                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950/80 text-cyan-300 border border-cyan-500/30">
                    {product.productType}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-xs text-slate-300">
                    <Download className="w-3 h-3 text-purple-400" />
                    <span>{product.downloadsCount} téléchargements</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-purple-300 transition">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Features snapshot */}
                  {product.features && product.features.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      {product.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-xs text-slate-500 block">Tarif en GNF</span>
                    <span className="text-lg font-extrabold text-cyan-400">
                      {formatGNF(product.priceGNF)}
                    </span>
                  </div>
                  {product.originalPriceGNF && (
                    <span className="text-xs text-slate-500 line-through">
                      {formatGNF(product.originalPriceGNF)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>

                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition flex items-center justify-center space-x-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Acheter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(prod) => handleBuyNow(prod)}
      />

    </section>
  );
};
