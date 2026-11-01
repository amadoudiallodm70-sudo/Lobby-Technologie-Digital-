import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { WelcomeVisitorBanner } from './components/WelcomeVisitorBanner';
import { HeroBanner } from './components/HeroBanner';
import { FormationsSection } from './components/FormationsSection';
import { AILabSection } from './components/AILabSection';
import { ProductsSection } from './components/ProductsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { AboutPage } from './components/AboutPage';
import { ServicesPage } from './components/ServicesPage';
import { ResourcesPage } from './components/ResourcesPage';
import { PricingPage } from './components/PricingPage';
import { ContactPage } from './components/ContactPage';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { user, isAdmin, openAuthModal, intendedAction, setIntendedAction, requireAuth } = useAuth();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Protected tab navigation handler
  const handleSelectTab = (tab: string) => {
    // If accessing core private features and not logged in, enforce Auth Gateway
    if (['courses', 'ai-lab', 'resources', 'products', 'client-dashboard'].includes(tab) && !user) {
      requireAuth({ targetTab: tab });
      return;
    }
    if (tab === 'admin-dashboard' && !isAdmin) {
      requireAuth({ targetTab: 'admin-dashboard' });
      return;
    }
    setCurrentTab(tab);
  };

  // When auth succeeds, resume intended navigation if set
  const handleAuthSuccess = () => {
    if (intendedAction?.targetTab) {
      setCurrentTab(intendedAction.targetTab);
      setIntendedAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => openAuthModal('gateway')}
        onOpenClientDashboard={() => {
          if (!user) {
            requireAuth({ targetTab: 'client-dashboard' });
          } else {
            setCurrentTab('client-dashboard');
          }
        }}
        onOpenAdminDashboard={() => {
          if (!isAdmin) {
            requireAuth({ targetTab: 'admin-dashboard' });
          } else {
            setCurrentTab('admin-dashboard');
          }
        }}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            {/* First-Time Welcome Visitor Interface */}
            <WelcomeVisitorBanner />

            {/* Official Hero Banner */}
            <HeroBanner
              onExploreCourses={() => handleSelectTab('courses')}
              onOpenAILab={() => handleSelectTab('ai-lab')}
              onExploreProducts={() => handleSelectTab('resources')}
            />
            <ServicesSection />
            <FormationsSection />
            <AILabSection />
            <div className="py-6 border-t border-slate-900">
              <PricingPage onNavigateCourses={() => handleSelectTab('courses')} />
            </div>
            <ProductsSection />
            <TestimonialsSection />
            <ContactSection />
          </>
        )}

        {currentTab === 'about' && (
          <AboutPage
            onExploreCourses={() => handleSelectTab('courses')}
            onOpenAILab={() => handleSelectTab('ai-lab')}
            onOpenContact={() => handleSelectTab('contact')}
          />
        )}

        {currentTab === 'courses' && (
          <div className="py-6">
            <FormationsSection />
          </div>
        )}

        {currentTab === 'ai-lab' && (
          <div className="py-6">
            <AILabSection />
          </div>
        )}

        {currentTab === 'services' && (
          <div className="py-6">
            <ServicesPage />
          </div>
        )}

        {(currentTab === 'resources' || currentTab === 'products') && (
          <div className="py-6">
            <ResourcesPage />
          </div>
        )}

        {currentTab === 'pricing' && (
          <div className="py-6">
            <PricingPage onNavigateCourses={() => handleSelectTab('courses')} />
          </div>
        )}

        {currentTab === 'testimonials' && (
          <div className="py-6">
            <TestimonialsSection />
          </div>
        )}

        {currentTab === 'contact' && (
          <div className="py-6">
            <ContactPage />
          </div>
        )}

        {currentTab === 'client-dashboard' && (
          <ClientDashboard
            onNavigateHome={() => setCurrentTab('home')}
            onExploreCourses={() => handleSelectTab('courses')}
            onExploreProducts={() => handleSelectTab('resources')}
            onNavigatePricing={() => setCurrentTab('pricing')}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboard
            onClose={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Persistent Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Chariow-Style Orange Money & PayCard Checkout Modal */}
      <CheckoutModal
        onSuccessNavigate={(tab) => setCurrentTab(tab)}
      />

      {/* Authentication Gateway & Modals */}
      <AuthModal
        onSuccess={handleAuthSuccess}
      />

      {/* Official Footer */}
      <Footer onSelectTab={handleSelectTab} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

