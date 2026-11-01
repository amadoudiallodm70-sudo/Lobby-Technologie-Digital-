import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Palette, 
  FileText, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Copy, 
  Check, 
  Sliders, 
  Upload, 
  Trash2, 
  Loader2, 
  Layers, 
  Eye, 
  Share2, 
  Film, 
  Mic, 
  Megaphone,
  Smartphone,
  Monitor,
  Square,
  Zap,
  Volume2
} from 'lucide-react';
import { AICreation } from '../types';
import { 
  apiGenerateVideo, 
  apiGenerateImage, 
  apiGetClientAICreations, 
  apiSaveClientAICreation, 
  apiDeleteClientAICreation,
  apiGenerateAI 
} from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AILabSection: React.FC = () => {
  const { user, requireAuth } = useAuth();
  
  // Navigation within the AI Lab
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'canvas' | 'scripts' | 'gallery'>('video');

  // -------------------------------------------------------------
  // 1. VIDEO GENERATION STATE
  // -------------------------------------------------------------
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoModel, setVideoModel] = useState('Google Veo 3');
  const [videoRatio, setVideoRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [videoMotion, setVideoMotion] = useState('Travelling drone');
  const [videoDuration, setVideoDuration] = useState(5);
  const [videoStyle, setVideoStyle] = useState('Photoréaliste Cinématique');
  const [videoImageInput, setVideoImageInput] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoResult, setVideoResult] = useState<AICreation | null>(null);
  const [videoError, setVideoError] = useState('');

  // -------------------------------------------------------------
  // 2. IMAGE GENERATION STATE
  // -------------------------------------------------------------
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageModel, setImageModel] = useState('gemini-3.1-flash-lite-image');
  const [imageRatio, setImageRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [imageStyle, setImageStyle] = useState('Photoréalisme 8K');
  const [inputImageFile, setInputImageFile] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResult, setImageResult] = useState<AICreation | null>(null);
  const [imageError, setImageError] = useState('');

  // -------------------------------------------------------------
  // 3. CANVAS STUDIO STATE (ÉDITEUR D'AFFICHES & MINIATURES)
  // -------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasBgImage, setCanvasBgImage] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&h=720&q=80');
  const [canvasTitle, setCanvasTitle] = useState('CRÉER AVEC L\'IA EN 2026');
  const [canvasSubtitle, setCanvasSubtitle] = useState('Formation Complète Lobby Technologie Digital');
  const [canvasBadgeText, setCanvasBadgeText] = useState('NOUVEAU • CONAKRY');
  const [canvasTextColor, setCanvasTextColor] = useState('#ffffff');
  const [canvasGlowColor, setCanvasGlowColor] = useState('#06b6d4');
  const [canvasSaving, setCanvasSaving] = useState(false);
  const [canvasSavedNotice, setCanvasSavedNotice] = useState('');

  // -------------------------------------------------------------
  // 4. PROMPTS & SCRIPTS STATE
  // -------------------------------------------------------------
  const [scriptTool, setScriptTool] = useState('video_script');
  const [scriptPrompt, setScriptPrompt] = useState('');
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptOutput, setScriptOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------
  // 5. SAVED GALLERY STATE
  // -------------------------------------------------------------
  const [savedCreations, setSavedCreations] = useState<AICreation[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'video' | 'image' | 'canvas'>('all');

  // Load user's gallery
  const loadGallery = async () => {
    try {
      const items = await apiGetClientAICreations();
      setSavedCreations(items);
    } catch (err) {
      console.error('Erreur chargement créations', err);
    }
  };

  useEffect(() => {
    loadGallery();
  }, [activeTab]);

  // Handle Video Generation
  const handleGenerateVideo = async () => {
    if (!requireAuth({ targetTab: 'ai-lab', actionType: 'ai_tool' })) return;
    if (!videoPrompt.trim()) {
      setVideoError('Veuillez décrire la vidéo que vous souhaitez générer.');
      return;
    }

    try {
      setVideoLoading(true);
      setVideoError('');
      const res = await apiGenerateVideo({
        prompt: videoPrompt,
        model: videoModel,
        aspectRatio: videoRatio,
        cameraMotion: videoMotion,
        durationSeconds: videoDuration,
        style: videoStyle,
        imageUrl: videoImageInput || undefined,
      });
      setVideoResult(res.creation);
      loadGallery();
    } catch (err: any) {
      setVideoError(err.message || 'Erreur lors de la génération vidéo.');
    } finally {
      setVideoLoading(false);
    }
  };

  // Handle Image Generation
  const handleGenerateImage = async () => {
    if (!requireAuth({ targetTab: 'ai-lab', actionType: 'ai_tool' })) return;
    if (!imagePrompt.trim()) {
      setImageError('Veuillez décrire l\'image à créer.');
      return;
    }

    try {
      setImageLoading(true);
      setImageError('');
      const res = await apiGenerateImage({
        prompt: imagePrompt,
        model: imageModel,
        aspectRatio: imageRatio,
        style: imageStyle,
        inputImage: inputImageFile || undefined,
      });
      setImageResult(res.creation);
      loadGallery();
    } catch (err: any) {
      setImageError(err.message || 'Erreur lors de la génération d\'image.');
    } finally {
      setImageLoading(false);
    }
  };

  // Redraw Studio Canvas
  useEffect(() => {
    if (activeTab !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = canvasBgImage;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw background cover
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Dark gradient overlay for readability
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(5, 7, 17, 0.2)');
      grad.addColorStop(0.5, 'rgba(5, 7, 17, 0.4)');
      grad.addColorStop(1, 'rgba(5, 7, 17, 0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Badge top left
      if (canvasBadgeText.trim()) {
        ctx.fillStyle = canvasGlowColor;
        ctx.beginPath();
        ctx.roundRect(50, 45, ctx.measureText(canvasBadgeText).width + 40, 38, 19);
        ctx.fill();

        ctx.fillStyle = '#050711';
        ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
        ctx.fillText(canvasBadgeText, 70, 70);
      }

      // Main Title
      ctx.fillStyle = canvasTextColor;
      ctx.font = '900 48px Space Grotesk, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 15;
      ctx.fillText(canvasTitle, 50, canvas.height - 130);

      // Subtitle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 22px Plus Jakarta Sans, sans-serif';
      ctx.shadowBlur = 8;
      ctx.fillText(canvasSubtitle, 50, canvas.height - 85);

      // Watermark brand
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 16px Space Grotesk, sans-serif';
      ctx.fillText('LOBBY TECHNOLOGIE DIGITAL • CONAKRY', canvas.width - 340, canvas.height - 40);
    };
  }, [activeTab, canvasBgImage, canvasTitle, canvasSubtitle, canvasBadgeText, canvasTextColor, canvasGlowColor]);

  // Export Canvas as PNG
  const handleExportCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    
    // Save to user creations
    try {
      setCanvasSaving(true);
      await apiSaveClientAICreation({
        type: 'canvas',
        title: canvasTitle || 'Affiche Studio Canvas',
        prompt: `Miniature / Affiche : ${canvasTitle}`,
        model: 'Studio Graphique Canvas',
        mediaUrl: dataUrl,
        aspectRatio: '16:9'
      });
      setCanvasSavedNotice('Affiche enregistrée avec succès dans votre espace personnel !');
      loadGallery();
      setTimeout(() => setCanvasSavedNotice(''), 3000);
    } catch (err) {
      console.error('Erreur sauvegarde canvas', err);
    } finally {
      setCanvasSaving(false);
    }

    // Trigger direct download
    const link = document.createElement('a');
    link.download = `LobbyTech_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Handle Scripts generation
  const handleGenerateScript = async () => {
    if (!requireAuth({ targetTab: 'ai-lab', actionType: 'ai_tool' })) return;
    if (!scriptPrompt.trim()) return;

    try {
      setScriptLoading(true);
      const res = await apiGenerateAI(scriptTool, scriptPrompt);
      setScriptOutput(res.result || '');
    } catch (err: any) {
      setScriptOutput('Erreur lors de la génération : ' + err.message);
    } finally {
      setScriptLoading(false);
    }
  };

  const handleDeleteCreation = async (id: string) => {
    try {
      await apiDeleteClientAICreation(id);
      loadGallery();
    } catch (err) {
      console.error('Erreur suppression', err);
    }
  };

  return (
    <section id="ai-lab" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/70 to-purple-950/70 text-cyan-300 border border-cyan-500/40 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>MON LABORATOIRE D'INTELLIGENCE ARTIFICIELLE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Générez vos Vidéos, Images & Affiches en direct
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Un espace de création professionnelle sans quitter Lobby Technologie Digital : modèles Google Veo 3, Vidogrip, studio d'affiches YouTube et bibles de prompts.
        </p>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'video'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-cyan-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-400" />
          <span>Création Vidéo IA (Veo 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span>Création Images IA</span>
        </button>

        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'canvas'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Palette className="w-4 h-4 text-teal-400" />
          <span>Studio Canvas (Affiches & YouTube)</span>
        </button>

        <button
          onClick={() => setActiveTab('scripts')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'scripts'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg border border-yellow-400/40'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Prompts & Voix Off</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'bg-slate-800 text-cyan-300 border border-cyan-400/60 shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Mes Créations ({savedCreations.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1 : CRÉATION VIDÉO IA (Google Veo 3, Vidogrip, etc.)      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090d22] border border-blue-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <span>Paramètres du Moteur Vidéo</span>
                </h3>
                <p className="text-xs text-slate-400">Générez à partir d'un texte ou d'une image</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Veo 3 Ready
              </span>
            </div>

            {videoError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {videoError}
              </div>
            )}

            {/* Prompt input */}
            <div>
              <label className="text-slate-300 font-bold block mb-1 text-xs">
                Description de la scène vidéo (Prompt) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Ex: Travelling cinématique aérien au-dessus de Conakry la nuit, gratte-ciels illuminés de bleu néon et violet, trafic fluide, ultra-réaliste 4K..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Model & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Modèle d'IA Vidéo
                </label>
                <select
                  value={videoModel}
                  onChange={(e) => setVideoModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Google Veo 3">Google Veo 3 (Ultra-Réaliste)</option>
                  <option value="Google Veo 2">Google Veo 2 (Haute Fidélité)</option>
                  <option value="Vidogrip AI Pro">Vidogrip AI (Spécial TikTok)</option>
                  <option value="Fast Diffusion Video">Fast Diffusion (Rendu Rapide)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Format / Réseau Cible
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setVideoRatio('9:16')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      videoRatio === '9:16'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>9:16</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoRatio('16:9')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      videoRatio === '16:9'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>16:9</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoRatio('1:1')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      videoRatio === '1:1'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>1:1</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Camera Motion & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Mouvement de Caméra
                </label>
                <select
                  value={videoMotion}
                  onChange={(e) => setVideoMotion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Travelling drone">Travelling drone aérien</option>
                  <option value="Zoom avant dynamique">Zoom avant dynamique</option>
                  <option value="Panoramique horizontal">Panoramique fluide</option>
                  <option value="Orbite 360">Orbite circulaire 360°</option>
                  <option value="Caméra fixe stable">Caméra fixe stable</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Style Visuel
                </label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Photoréaliste Cinématique">Photoréaliste Cinématique</option>
                  <option value="Publicitaire Commercial">Publicitaire Commercial</option>
                  <option value="Animation 3D Futuriste">Animation 3D Futuriste</option>
                  <option value="Documentaire Éducatif">Documentaire Éducatif</option>
                </select>
              </div>
            </div>

            {/* Image to Video Upload (Optional) */}
            <div>
              <label className="text-slate-300 font-bold block mb-1 text-xs">
                Image de départ (Option Image-to-Video)
              </label>
              <input
                type="text"
                value={videoImageInput || ''}
                onChange={(e) => setVideoImageInput(e.target.value)}
                placeholder="URL d'image ou laissez vide pour Text-to-Video"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={videoLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {videoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Rendu vidéo avec {videoModel} en cours...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span>GÉNÉRER MA VIDÉO IA DIRECTEMENT</span>
                </>
              )}
            </button>
          </div>

          {/* Video Preview & Output Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-5">
            <h3 className="text-lg font-black text-white flex items-center justify-between">
              <span>Lecteur de Rendu Vidéo</span>
              {videoResult && (
                <span className="text-xs font-bold text-emerald-400">
                  Prête au téléchargement
                </span>
              )}
            </h3>

            {videoResult ? (
              <div className="space-y-4">
                <div className={`relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl mx-auto flex items-center justify-center ${
                  videoResult.aspectRatio === '9:16' ? 'max-w-[320px] aspect-[9/16]' : 'aspect-video w-full'
                }`}>
                  <video
                    src={videoResult.mediaUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{videoResult.title}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 text-[10px] font-bold">
                      {videoResult.model}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    « {videoResult.prompt} »
                  </p>
                  {videoResult.parameters?.storyboard && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <strong className="text-cyan-400">Scénario & Mouvements :</strong>
                      <p className="mt-1 whitespace-pre-line text-slate-300">{videoResult.parameters.storyboard}</p>
                    </div>
                  )}
                </div>

                <a
                  href={videoResult.mediaUrl}
                  download={`LobbyTech_Video_${videoResult.id}.mp4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger la Vidéo (.MP4)</span>
                </a>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Film className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-bold text-slate-400">
                  Votre vidéo générée apparaîtra ici
                </p>
                <p className="text-xs text-slate-600 max-w-sm">
                  Sélectionnez vos paramètres à gauche et cliquez sur Générer pour lancer le moteur cinématique.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2 : CRÉATION IMAGES IA (Gemini & Diffusion)              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090d22] border border-purple-500/30 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                  <span>Générateur d'Images IA</span>
                </h3>
                <p className="text-xs text-slate-400">Création photoréaliste, logos, portraits & affiches</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                8K Ready
              </span>
            </div>

            {imageError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                {imageError}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-bold block mb-1 text-xs">
                Description de l'image (Prompt) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Ex: Portrait cinématographique d'une jeune entrepreneure guinéenne souriante, éclairage néon bleu et violet, fond futuriste de Conakry 8K..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-xs sm:text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Style Artistique
                </label>
                <select
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Photoréalisme 8K">Photoréalisme 8K Ultra-Détaillé</option>
                  <option value="Affiche Publicitaire">Affiche Publicitaire Commerciale</option>
                  <option value="Logo Minimaliste">Logo Minimaliste & Marque</option>
                  <option value="Portrait Professionnel">Portrait Professionnel Studio</option>
                  <option value="Illustration 3D">Illustration 3D & Isométrique</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Format / Ratio
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setImageRatio('1:1')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      imageRatio === '1:1'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>1:1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageRatio('16:9')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      imageRatio === '16:9'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>16:9</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageRatio('9:16')}
                    className={`py-2 rounded-xl flex items-center justify-center space-x-1 border font-semibold ${
                      imageRatio === '9:16'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>9:16</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={imageLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {imageLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération de l'image haute définition...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>CRÉER MON IMAGE IA MAINTENANT</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-5">
            <h3 className="text-lg font-black text-white flex items-center justify-between">
              <span>Résultat Image Générée</span>
              {imageResult && (
                <button
                  onClick={() => {
                    setCanvasBgImage(imageResult.mediaUrl);
                    setActiveTab('canvas');
                  }}
                  className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Ouvrir dans Studio Canvas</span>
                </button>
              )}
            </h3>

            {imageResult ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  <img
                    src={imageResult.mediaUrl}
                    alt={imageResult.title}
                    className="w-full max-h-[420px] object-contain mx-auto"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <span className="font-bold text-white block">{imageResult.title}</span>
                  <p className="text-slate-400 text-[11px]">« {imageResult.prompt} »</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={imageResult.mediaUrl}
                    download={`LobbyTech_Image_${imageResult.id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </a>

                  <button
                    onClick={() => {
                      setCanvasBgImage(imageResult.mediaUrl);
                      setActiveTab('canvas');
                    }}
                    className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2"
                  >
                    <Palette className="w-4 h-4 text-cyan-400" />
                    <span>Éditer dans Canvas</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-square max-h-[400px] w-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-bold text-slate-400">
                  Votre image haute définition apparaîtra ici
                </p>
                <p className="text-xs text-slate-600 max-w-sm">
                  Entrez votre description à gauche pour générer des affiches, des logos ou des visuels professionnels.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3 : STUDIO CANVAS (ÉDITEUR D'AFFICHES & MINIATURES)       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#090d22] border border-cyan-500/30 space-y-4 text-xs">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <span>Éditeur Graphique Canvas</span>
              </h3>
              <p className="text-xs text-slate-400">Préparez vos miniatures YouTube et affiches publicitaires</p>
            </div>

            {canvasSavedNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs">
                {canvasSavedNotice}
              </div>
            )}

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Titre Principal de l'Affiche
              </label>
              <input
                type="text"
                value={canvasTitle}
                onChange={(e) => setCanvasTitle(e.target.value)}
                placeholder="Ex: CRÉER AVEC L'IA EN 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Sous-titre / Accroche
              </label>
              <input
                type="text"
                value={canvasSubtitle}
                onChange={(e) => setCanvasSubtitle(e.target.value)}
                placeholder="Ex: Formation Complète Lobby Technologie"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Badge / Pastille
              </label>
              <input
                type="text"
                value={canvasBadgeText}
                onChange={(e) => setCanvasBadgeText(e.target.value)}
                placeholder="Ex: NOUVEAU • GUINÉE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Couleur du Titre
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={canvasTextColor}
                    onChange={(e) => setCanvasTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-slate-400">{canvasTextColor}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Couleur Badge / Néon
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={canvasGlowColor}
                    onChange={(e) => setCanvasGlowColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-slate-400">{canvasGlowColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Image de Fond
              </label>
              <input
                type="text"
                value={canvasBgImage}
                onChange={(e) => setCanvasBgImage(e.target.value)}
                placeholder="URL de l'image de fond"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              onClick={handleExportCanvas}
              disabled={canvasSaving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>ENREGISTRER & TÉLÉCHARGER L'AFFICHE (PNG)</span>
            </button>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Aperçu de la Miniature / Affiche 1280x720</span>
              <span className="text-xs text-cyan-400 font-mono">Format YouTube 16:9</span>
            </h3>

            <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-auto block"
              />
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4 : PROMPTS, VOIX OFF & SCRIPTS VIRAUX                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090d22] border border-amber-500/30 space-y-4 text-xs">
            <h3 className="text-lg font-black text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Générateur de Prompts & Scripts</span>
            </h3>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Type d'Outil IA
              </label>
              <select
                value={scriptTool}
                onChange={(e) => setScriptTool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="video_script">Script Vidéo Viral TikTok & Reels</option>
                <option value="image_prompt">Prompt Photoréaliste Midjourney & Flux</option>
                <option value="voice_script">Texte de Voix Off Publicitaire</option>
                <option value="music_lyrics">Paroles de Chanson & Prompt Suno AI</option>
                <option value="master_prompt">Master-Prompt ChatGPT & Gemini</option>
                <option value="ad_copy">Publicité Facebook Ads & WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">
                Votre Sujet / Idée Brute
              </label>
              <textarea
                rows={4}
                value={scriptPrompt}
                onChange={(e) => setScriptPrompt(e.target.value)}
                placeholder="Ex: Comment monétiser une page Facebook en Guinée avec Orange Money..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={scriptLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {scriptLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              <span>GÉNÉRER LE SCRIPT / PROMPT IA</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#070b1e] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Résultat Généré</h3>
              {scriptOutput && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scriptOutput);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 min-h-[300px] text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed overflow-y-auto max-h-[480px]">
              {scriptOutput || "Le texte, le prompt ou le script généré par l'IA s'affichera ici."}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5 : MES CRÉATIONS SAUVEGARDÉES (GALLERY)                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">
              Historique de vos Créations Vidéos, Images & Affiches
            </h3>

            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setGalleryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold ${galleryFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Tous
              </button>
              <button
                onClick={() => setGalleryFilter('video')}
                className={`px-3 py-1.5 rounded-xl font-bold ${galleryFilter === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Vidéos
              </button>
              <button
                onClick={() => setGalleryFilter('image')}
                className={`px-3 py-1.5 rounded-xl font-bold ${galleryFilter === 'image' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Images
              </button>
              <button
                onClick={() => setGalleryFilter('canvas')}
                className={`px-3 py-1.5 rounded-xl font-bold ${galleryFilter === 'canvas' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Studio Canvas
              </button>
            </div>
          </div>

          {savedCreations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-base font-bold text-white">Aucune création sauvegardée pour l'instant</p>
              <p className="text-xs">Utilisez l'onglet Vidéo, Image ou Studio Canvas pour créer votre premier contenu !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCreations
                .filter(c => galleryFilter === 'all' || c.type === galleryFilter)
                .map((creation) => (
                  <div
                    key={creation.id}
                    className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 overflow-hidden flex flex-col justify-between transition group"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                      {creation.type === 'video' ? (
                        <video
                          src={creation.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={creation.mediaUrl}
                          alt={creation.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                        />
                      )}
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30 uppercase">
                        {creation.type}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white truncate">{creation.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">« {creation.prompt} »</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                        <span>{new Date(creation.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span className="text-purple-300">{creation.model}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={creation.mediaUrl}
                          download={`LobbyTech_${creation.id}.${creation.type === 'video' ? 'mp4' : 'png'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger</span>
                        </a>

                        <button
                          onClick={() => handleDeleteCreation(creation.id)}
                          className="py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 text-rose-300 font-bold text-xs flex items-center justify-center space-x-1 border border-rose-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
};
