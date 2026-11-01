import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Star, 
  Zap, 
  Info, 
  BookOpen, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Course, CategoryFormation } from '../types';
import { apiGetCourses, formatGNF } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CourseDetailModal } from './CourseDetailModal';
import { CoursePlayerModal } from './CoursePlayerModal';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Toutes les catégories' },
  { id: 'Intelligence artificielle', label: 'Intelligence artificielle' },
  { id: "Création de vidéos avec l'IA", label: "Vidéos avec l'IA" },
  { id: "Création de musique avec l'IA", label: "Musique avec l'IA" },
  { id: "Informatique et bureautique", label: "Informatique & Bureautique" },
  { id: "Photoshop et design graphique", label: "Photoshop & Design" },
  { id: "Montage vidéo", label: "Montage Vidéo" },
  { id: "Excel et Word", label: "Excel & Word" },
  { id: "E-commerce", label: "E-commerce" },
  { id: "Marketing digital", label: "Marketing Digital" },
  { id: "Publicité Facebook et TikTok", label: "Facebook & TikTok Ads" },
  { id: "Création de contenu", label: "Création de Contenu" },
  { id: "Développement web", label: "Développement Web" },
];

export const FormationsSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [playingCourse, setPlayingCourse] = useState<Course | null>(null);

  const { requireAuth } = useAuth();
  const { openCheckoutWithItem, addItem } = useCart();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGetCourses(selectedCategory, searchQuery);
        setCourses(data);
      } catch (err) {
        console.error('Erreur chargement formations', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory, searchQuery]);

  const handleViewCourse = (course: Course) => {
    if (!requireAuth({ targetTab: 'courses', actionType: 'view_course', payload: course })) return;
    setSelectedCourse(course);
  };

  const handleBuyNow = (course: Course) => {
    if (!requireAuth({ targetTab: 'courses', actionType: 'buy_course', payload: course })) return;
    openCheckoutWithItem({
      id: course.id,
      title: course.title,
      type: 'course',
      priceGNF: course.priceGNF,
      coverImage: course.coverImage,
    });
  };

  return (
    <section id="formations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catalogue Professionnel</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Nos Formations Certifiantes & Pratiques
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Des programmes complets pas-à-pas pour maîtriser l'intelligence artificielle, le graphisme, le code et le business en ligne avec paiement par Orange Money et PayCard.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="relative max-w-md mx-auto sm:max-w-none flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: IA, Photoshop, Excel, TikTok...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 focus:border-cyan-500 text-white placeholder-slate-500 text-sm focus:outline-none transition"
            />
          </div>
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-3">
          <Info className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aucune formation trouvée</h3>
          <p className="text-sm text-slate-400">Essayez une autre recherche ou une catégorie différente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#0c1126] to-[#070a17] border border-blue-900/20 hover:border-cyan-500/40 transition duration-300 overflow-hidden shadow-xl hover:shadow-cyan-950/30"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1126] via-transparent to-black/30" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {course.category}
                  </span>

                  {/* Level pill */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {course.level}
                  </span>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-xs font-bold text-white">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{course.rating}</span>
                    <span className="text-slate-400 font-normal">({course.studentsCount})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                      {course.durationHours}h de vidéo
                    </span>
                    <span>•</span>
                    <span className="text-purple-300 truncate">
                      {course.instructor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-5 pt-0 space-y-3">
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-800/80">
                  <div>
                    <span className="text-xs text-slate-500 block">Prix spécial</span>
                    <span className="text-lg font-extrabold text-cyan-400">
                      {formatGNF(course.priceGNF)}
                    </span>
                  </div>
                  {course.originalPriceGNF && (
                    <span className="text-xs text-slate-500 line-through">
                      {formatGNF(course.originalPriceGNF)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleViewCourse(course)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center space-x-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Détails</span>
                  </button>

                  <button
                    onClick={() => handleBuyNow(course)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center justify-center space-x-1"
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

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onBuyNow={(course) => handleBuyNow(course)}
        onOpenClassroom={(course) => setPlayingCourse(course)}
      />

      {/* Interactive Classroom & Video Lesson Player */}
      <CoursePlayerModal
        course={playingCourse}
        onClose={() => setPlayingCourse(null)}
      />

    </section>
  );
};
