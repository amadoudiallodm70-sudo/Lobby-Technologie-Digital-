import React, { useState } from 'react';
import { 
  X, 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  Download, 
  Clock, 
  BookOpen, 
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Course } from '../types';

interface CourseViewerModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseViewerModal: React.FC<CourseViewerModalProps> = ({ course, onClose }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  if (!course) return null;

  const activeModule = course.detailedProgram?.[activeModuleIndex] || {
    id: 'm-default',
    title: course.title,
    duration: '2h 00m',
    description: course.description,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#080c1d] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Espace Apprenant
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player & Modules layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Main Video & Content Column */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Player Container */}
            <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video shadow-2xl relative flex items-center justify-center">
              {course.previewVideo ? (
                <video
                  key={activeModule.id}
                  src={course.previewVideo}
                  controls
                  autoPlay={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <PlayCircle className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-sm font-bold text-white">Vidéo de cours en direct</p>
                  <p className="text-xs text-slate-400">{activeModule.title}</p>
                </div>
              )}
            </div>

            {/* Active Module Title & Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-xs text-cyan-400">
                <span className="font-bold">Module {activeModuleIndex + 1}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {activeModule.duration}
                </span>
                <span>•</span>
                <span className="text-purple-300">Formateur : {course.instructor}</span>
              </div>

              <h4 className="text-xl font-extrabold text-white">
                {activeModule.title}
              </h4>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeModule.description || course.description}
              </p>
            </div>

            {/* Attached Resources */}
            {course.attachedFiles && course.attachedFiles.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Ressources et fichiers du cours à télécharger :</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {course.attachedFiles.map((file) => (
                    <a
                      key={file.id}
                      href={`/api/downloads/token-demo-101?file=${encodeURIComponent(file.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Download className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Curriculum Column */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#060914] p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Modules de la formation
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  {activeModuleIndex + 1} / {course.detailedProgram?.length || 1}
                </span>
              </div>

              {/* Module list */}
              <div className="space-y-2">
                {course.detailedProgram?.map((mod, idx) => {
                  const isActive = idx === activeModuleIndex;
                  return (
                    <button
                      key={mod.id || idx}
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-950/60 border border-cyan-500/50 text-white font-semibold'
                          : 'bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate pr-2">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                          isActive ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs truncate">{mod.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {mod.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Certificate Guarantee */}
            <div className="mt-6 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-center space-x-2.5">
              <Award className="w-5 h-5 text-purple-400 shrink-0" />
              <span>Attestation de formation délivrée par LOBBY TECHNOLOGIE DIGITAL à la complétion.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
