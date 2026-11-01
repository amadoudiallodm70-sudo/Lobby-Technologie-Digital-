import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  CheckCircle, 
  FileText, 
  Download, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  ShieldCheck,
  Check,
  Printer
} from 'lucide-react';
import { Course, CourseModule, CourseProgress } from '../types';
import { apiGetCourseProgress, apiUpdateCourseProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CoursePlayerModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({ course, onClose }) => {
  const { user } = useAuth();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (!course || !user) return;
    const currentCourseId = course.id;
    async function loadProgress() {
      try {
        const progresses: CourseProgress[] = await apiGetCourseProgress();
        const p = progresses.find((pr) => pr.courseId === currentCourseId);
        if (p) {
          setCompletedModules(p.completedModules || []);
          setProgressPercent(p.percent || 0);
          if (p.certificateId) setCertificateId(p.certificateId);
        }
      } catch (err) {
        console.error('Erreur chargement progression', err);
      }
    }
    loadProgress();
  }, [course, user]);

  if (!course) return null;

  const modules: CourseModule[] = course.detailedProgram && course.detailedProgram.length > 0
    ? course.detailedProgram
    : [
        { id: 'mod-1', title: 'Introduction & Fondations du Numérique', duration: '25 min', description: 'Comprendre les concepts clés et installer votre espace de travail.' },
        { id: 'mod-2', title: 'Outils d\'IA & Prompt Engineering Avancé', duration: '40 min', description: 'Formuler des requêtes d\'élite pour obtenir des résultats professionnels.' },
        { id: 'mod-3', title: 'Création Pratique : Vidéos, Graphismes & Code', duration: '55 min', description: 'Étude de cas guidée et production concrète étape par étape.' },
        { id: 'mod-4', title: 'Monétisation & Vente sur le Marché Africain', duration: '35 min', description: 'Encaissement Orange Money, prospection WhatsApp et closing commercial.' }
      ];

  const currentModule = modules[currentModuleIndex] || modules[0];
  const isCurrentModuleCompleted = completedModules.includes(currentModule.id);

  const handleToggleModuleComplete = async (modId: string) => {
    try {
      const res = await apiUpdateCourseProgress(course.id, modId);
      if (res.progress) {
        setCompletedModules(res.progress.completedModules || []);
        setProgressPercent(res.progress.percent || 0);
        if (res.progress.certificateId) {
          setCertificateId(res.progress.certificateId);
        }
      }
    } catch (err) {
      console.error('Erreur mise à jour module', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-6xl bg-[#080c20] border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#060815] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {course.title}
              </h3>
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>Formateur : <strong className="text-cyan-400">{course.instructor}</strong></span>
                <span>•</span>
                <span>Progression : <strong className="text-emerald-400">{progressPercent}%</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {progressPercent >= 100 && (
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-yellow-950/40"
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Voir mon Certificat</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5">
          <div 
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Classroom Main Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Video Lesson & Content Area */}
          <div className="lg:col-span-8 p-4 sm:p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-800">
            
            {/* Embedded Interactive Video Player */}
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
              <video
                src={currentModule.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-circuit-lines-animation-43555-large.mp4"}
                controls
                className="w-full h-full object-cover"
                poster={course.coverImage}
              />
            </div>

            {/* Lesson Info */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                    Chapitre {currentModuleIndex + 1} sur {modules.length}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {currentModule.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleToggleModuleComplete(currentModule.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition ${
                    isCurrentModuleCompleted
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCurrentModuleCompleted ? 'Chapitre Validé' : 'Marquer comme Terminé'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentModule.description || course.description}
              </p>

              {/* Course resources & attachments */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Support de cours téléchargeable :
                </span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/uploads/Guide_Secret_Prompts_IA_2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-cyan-400 transition"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Fiche_Pedagogique_Chapitre_{currentModuleIndex + 1}.pdf</span>
                    <Download className="w-3.5 h-3.5 text-slate-500 ml-1" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Syllabus / Module List Sidebar */}
          <div className="lg:col-span-4 p-4 sm:p-6 bg-[#060919] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Programme du Cours
                </span>
                <span className="text-[11px] text-slate-400">
                  {completedModules.length} / {modules.length} terminés
                </span>
              </div>

              <div className="space-y-2">
                {modules.map((mod, idx) => {
                  const isCompleted = completedModules.includes(mod.id);
                  const isCurrent = idx === currentModuleIndex;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => setCurrentModuleIndex(idx)}
                      className={`w-full p-3 rounded-2xl text-left transition flex items-start space-x-3 border ${
                        isCurrent
                          ? 'bg-blue-950/60 border-cyan-500/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isCurrent ? 'border-cyan-400 text-cyan-400' : 'border-slate-600 text-slate-500'
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrent ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {mod.title}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{mod.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Certificate Status Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/50 via-purple-950/40 to-blue-950/50 border border-blue-500/20 text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">Certification Officielle</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Complétez tous les chapitres pour débloquer votre attestation avec code d'authentification vérifiable.
              </p>
              {progressPercent >= 100 && (
                <button
                  onClick={() => setShowCertificate(true)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold text-xs shadow-md"
                >
                  Télécharger mon Attestation
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-[#090d24] border-2 border-yellow-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center text-white">
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-yellow-400 flex items-center justify-center mx-auto border border-yellow-500/40 shadow-lg">
                <Award className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                RÉPUBLIQUE DE GUINÉE • LOBBY TECHNOLOGIE DIGITAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                ATTESTATION OFFICIELLE DE RÉUSSITE
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Il est certifié par la présente que l'apprenant(e)
            </p>

            <div className="py-2">
              <span className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 border-b-2 border-yellow-500/50 pb-1 inline-block">
                {user ? user.name : 'Mamadou Bhoye Diallo'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              a validé avec succès l'ensemble du programme d'apprentissage professionnel et d'évaluation pratique pour la formation :
            </p>

            <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-cyan-500/30 text-base sm:text-lg font-bold text-cyan-300">
              « {course.title} »
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800 text-slate-400">
              <div>
                <span>Identifiant de vérification :</span>
                <p className="font-mono font-bold text-white">{certificateId || 'CERT-LOBBY-2026-8819'}</p>
              </div>
              <div>
                <span>Délivré à Conakry le :</span>
                <p className="font-bold text-white">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center space-x-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold text-xs flex items-center space-x-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer / Télécharger en PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
