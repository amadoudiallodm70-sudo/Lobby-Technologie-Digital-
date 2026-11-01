import React from 'react';
import { 
  X, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Star, 
  Zap, 
  Download, 
  ShieldCheck, 
  PlayCircle,
  FileText
} from 'lucide-react';
import { Course } from '../types';
import { formatGNF } from '../services/api';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onBuyNow: (course: Course) => void;
  onOpenClassroom?: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onBuyNow,
  onOpenClassroom,
}) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#090d1f] border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden my-8">
        
        {/* Header Cover Banner */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d1f] via-[#090d1f]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition border border-white/10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
              {course.category}
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Key metadata pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400">Durée</p>
              <p className="text-sm font-bold text-white">{course.durationHours} Heures</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <BookOpen className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400">Niveau</p>
              <p className="text-sm font-bold text-white">{course.level}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1 fill-yellow-400" />
              <p className="text-[11px] text-slate-400">Note & Avis</p>
              <p className="text-sm font-bold text-white">{course.rating} / 5 ({course.studentsCount} élèves)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400">Formateur</p>
              <p className="text-sm font-bold text-white truncate">{course.instructor}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Présentation de la Formation</h3>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Preview demo video if available */}
          {course.previewVideo && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-cyan-400" />
                <span>Extrait vidéo & Aperçu du contenu</span>
              </h3>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video max-h-72">
                <video
                  src={course.previewVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              {course.previewText && (
                <p className="text-xs text-slate-400 italic">
                  💡 {course.previewText}
                </p>
              )}
            </div>
          )}

          {/* Programme détaillé (Curriculum Modules) */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>Programme détaillé ({course.detailedProgram?.length || 0} Modules)</span>
            </h3>
            <div className="space-y-2">
              {course.detailedProgram?.map((mod, idx) => (
                <div
                  key={mod.id || idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-950 text-cyan-400 font-bold text-xs flex items-center justify-center border border-blue-500/20">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-200">{mod.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2.5 py-1 rounded-md">
                    {mod.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attached files preview */}
          {course.attachedFiles && course.attachedFiles.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Ressources incluses à télécharger après achat ({course.attachedFiles.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.attachedFiles.map((f) => (
                  <div key={f.id} className="flex items-center space-x-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price & Purchase Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Tarif officiel en Francs Guinéens</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300">
                  {formatGNF(course.priceGNF)}
                </span>
                {course.originalPriceGNF && (
                  <span className="text-base text-slate-500 line-through">
                    {formatGNF(course.originalPriceGNF)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {onOpenClassroom && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenClassroom(course);
                  }}
                  className="px-4 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 text-xs sm:text-sm font-bold transition flex items-center space-x-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Accéder aux Cours & Vidéos</span>
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  onBuyNow(course);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Acheter maintenant</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center text-orange-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Orange Money Guinée
            </span>
            <span>•</span>
            <span className="flex items-center text-purple-400">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              PayCard Guinée
            </span>
            <span>•</span>
            <span className="text-emerald-400">Accès à vie</span>
          </div>

        </div>

      </div>
    </div>
  );
};
