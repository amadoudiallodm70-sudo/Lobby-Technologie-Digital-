import React, { useState } from 'react';
import { 
  Cpu, 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  User as UserIcon, 
  ShieldAlert, 
  Menu, 
  X, 
  ShoppingCart,
  LogOut,
  LogIn,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenClientDashboard: () => void;
  onOpenAdminDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenClientDashboard,
  onOpenAdminDashboard,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { items, openCartCheckout } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'courses', label: 'Formations', icon: BookOpen },
    { id: 'ai-lab', label: 'Laboratoire IA', icon: Sparkles, badge: 'PRO' },
    { id: 'services', label: 'Services' },
    { id: 'resources', label: 'Ressources', icon: ShoppingBag },
    { id: 'pricing', label: 'Tarifs' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-900/30 bg-[#070a17]/90 backdrop-blur-md">
      {/* Top micro bar with Official Guinea contact & announcement */}
      <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-1.5 text-xs border-b border-white/5 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-blue-950/40 text-slate-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-cyan-400 font-bold tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2"></span>
            APPRENDRE • CRÉER • INNOVER • GAGNER
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Paiements Orange Money & PayCard 100% Automatisés (Guinée)</span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/224611554471?text=Bonjour%20Lobby%20Technologie%20Digital,%20je%20souhaite%20des%20informations"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            <PhoneCall className="w-3.5 h-3.5 mr-1" />
            WhatsApp : 611 55 44 71
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">amadoudiallodm70@gmail.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-3 text-left group transition focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-[#090d1f] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-wider text-white">
                  LOBBY <span className="text-cyan-400">TECHNOLOGIE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  DIGITAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight font-medium">
                Apprenez, Créez, Innovez & Gagnez
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition duration-150 flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-cyan-300 bg-blue-950/60 shadow-sm border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 opacity-80" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Cart Button */}
            <button
              onClick={openCartCheckout}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-500/50 transition"
              title="Panier d'achats"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#090d1f] shadow-md">
                  {items.length}
                </span>
              )}
            </button>

            {/* User Session / Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenClientDashboard}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={onOpenAdminDashboard}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-500/40 text-purple-200 text-sm font-semibold transition shadow-md shadow-purple-950/40"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>Admin</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Mon Espace / Connexion</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={openCartCheckout}
              className="relative p-2 rounded-lg bg-slate-900 text-slate-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#090d1f] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-blue-900/40 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    onOpenClientDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm"
                >
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span>Mon Espace Client ({user.name})</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      onOpenAdminDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-purple-900/50 border border-purple-500/40 text-purple-200 font-medium text-sm"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>Tableau de Bord Administrateur</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm text-rose-400"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm shadow-md"
              >
                Connexion / Créer un compte
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
