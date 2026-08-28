import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  RefreshCw,
  Sparkles,
  Check,
  Upload,
  AlertCircle,
  Grid,
  Sun,
  Timer,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

// Curated realistic authentic artisanal craft photos for 1-click fallback & instant sampling
const REALISTIC_CRAFT_SAMPLES = [
  {
    title: "Hand-Thrown Terracotta Urn",
    category: "Terracotta & Pottery",
    region: "Bishnupur, West Bengal",
    url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80",
    desc: "Natural earthen clay pot with traditional wood-kiln patina",
  },
  {
    title: "Bastar Dokra Lost-Wax Metalwork",
    category: "Dokra Metal Casting",
    region: "Bastar, Chhattisgarh",
    url: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80",
    desc: "Antique brass bell metal cast with natural beeswax core",
  },
  {
    title: "Mithila Madhubani Folk Canvas",
    category: "Madhubani & Folk Painting",
    region: "Mithila, Bihar",
    url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80",
    desc: "Hand-painted Tree of Life with turmeric & wild indigo dyes",
  },
  {
    title: "Pochampally Double Ikat Silk Stole",
    category: "Handloom & Textiles",
    region: "Pochampally, Telangana",
    url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80",
    desc: "Pure mulberry handloom silk with geometric resist-dye weave",
  },
  {
    title: "Jaipur Quartz Blue Pottery Vase",
    category: "Terracotta & Pottery",
    region: "Jaipur, Rajasthan",
    url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
    desc: "Ground quartz dough with turquoise copper-oxide floral glaze",
  },
  {
    title: "Saharanpur Rosewood Carved Box",
    category: "Woodcarving & Crafts",
    region: "Saharanpur, Uttar Pradesh",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
    desc: "Seasoned Sheesham wood with brass inlay & openwork jali",
  },
  {
    title: "Tribal Bastar Brass Elephant Trio",
    category: "Dokra Metal Casting",
    region: "Kondagaon, Chhattisgarh",
    url: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1200&q=80",
    desc: "One-of-a-kind lost wax bell metal filigree figurines",
  },
  {
    title: "Traditional Bengal Clay Potter Wheel Craft",
    category: "Terracotta & Pottery",
    region: "Bankura, West Bengal",
    url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
    desc: "Live pottery workshop creation using river alluvial soil",
  },
];

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [useCountdownTimer, setUseCountdownTimer] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeTab, setActiveTab] = useState<'live_camera' | 'sample_photos' | 'device_file'>('live_camera');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for multiple cameras
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter((device) => device.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        })
        .catch(() => setHasMultipleCameras(false));
    }
  }, []);

  // Initialize camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    if (activeTab === 'live_camera') {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, activeTab]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser.');
      setActiveTab('sample_photos');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch((e) => console.warn('Video play error:', e));
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions or use device upload.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No active camera hardware detected on this device.');
      } else {
        setCameraError('Unable to start live camera feed. You can use your device camera app or choose from authentic craft photos below.');
      }
      setActiveTab('sample_photos');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture Photo Execution
  const executeCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trigger visual shutter flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    // Play subtle acoustic shutter sound if possible
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // Audio context might be restricted, ignore safely
    }

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    setRotationAngle(0);
    stopCamera();
  };

  const handleShutterClick = () => {
    if (useCountdownTimer) {
      setIsCountingDown(true);
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setIsCountingDown(false);
            setCountdown(null);
            executeCapture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setRotationAngle(0);
    startCamera();
  };

  const handleRotate = () => {
    if (!capturedImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
      }
    };
    img.src = capturedImage;
  };

  const handleConfirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setCapturedImage(sampleUrl);
    onCapture(sampleUrl);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setCapturedImage(url);
          onCapture(url);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-capture-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#1C1B18] text-[#F5F3EF] rounded-3xl max-w-2xl w-full border border-stone-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#24221E]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#5A5A40] text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Artisan Craft Camera Viewfinder
                <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  HD Studio Ready
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Frame your handmade craft with authentic lighting & composition lines
              </p>
            </div>
          </div>

          <button
            id="close-camera-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-[#161513] text-xs font-semibold px-4 pt-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('live_camera');
              setCapturedImage(null);
            }}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'live_camera'
                ? 'border-[#8A8A65] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera
          </button>

          <button
            onClick={() => setActiveTab('sample_photos')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'sample_photos'
                ? 'border-[#8A8A65] text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Authentic Craft Library ({REALISTIC_CRAFT_SAMPLES.length})
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="pb-2.5 px-3 border-b-2 border-transparent text-stone-400 hover:text-stone-200 flex items-center gap-1.5 ml-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload from Device
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>

        {/* Body Viewport Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center">
          {/* TAB 1: LIVE CAMERA & PHOTO PREVIEW */}
          {activeTab === 'live_camera' && (
            <div className="w-full flex flex-col items-center">
              {capturedImage ? (
                /* Captured Photo Review View */
                <div className="w-full max-w-md space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#5A5A40] shadow-xl bg-black">
                    <img
                      src={capturedImage}
                      alt="Captured Craft"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Craft Photo Captured
                    </div>
                  </div>

                  {/* Review Action Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-retake-photo"
                      onClick={handleRetake}
                      className="flex-1 py-3 px-4 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake Photo
                    </button>

                    <button
                      onClick={handleRotate}
                      className="p-3 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      title="Rotate 90 degrees"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                      id="btn-use-captured-photo"
                      onClick={handleConfirmImage}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Use in Studio
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Camera Stream Viewfinder */
                <div className="w-full max-w-md space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-2xl">
                    {/* Live Video Feed */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${
                        facingMode === 'user' ? 'scale-x-[-1]' : ''
                      }`}
                    />

                    {/* Visual Flash Effect Overlay */}
                    {flashEffect && (
                      <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200" />
                    )}

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                      <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-7xl font-bold font-mono text-white animate-ping">
                          {countdown}
                        </span>
                      </div>
                    )}

                    {/* Composition Rule-of-Thirds Grid */}
                    {showGrid && (
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-40">
                        <div className="border-r border-b border-white/60" />
                        <div className="border-r border-b border-white/60" />
                        <div className="border-b border-white/60" />
                        <div className="border-r border-b border-white/60" />
                        <div className="border-r border-b border-white/60" />
                        <div className="border-b border-white/60" />
                        <div className="border-r border-white/60" />
                        <div className="border-r border-white/60" />
                        <div />
                      </div>
                    )}

                    {/* Center Focus Reticle */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-70">
                      <div className="w-32 h-32 border border-dashed border-amber-300/80 rounded-2xl flex items-center justify-center">
                        <div className="w-3 h-3 border-t-2 border-l-2 border-amber-400 absolute top-2 left-2" />
                        <div className="w-3 h-3 border-t-2 border-r-2 border-amber-400 absolute top-2 right-2" />
                        <div className="w-3 h-3 border-b-2 border-l-2 border-amber-400 absolute bottom-2 left-2" />
                        <div className="w-3 h-3 border-b-2 border-r-2 border-amber-400 absolute bottom-2 right-2" />
                        <span className="text-[9px] uppercase tracking-widest text-amber-200 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                          Craft Center
                        </span>
                      </div>
                    </div>

                    {/* Top Status Indicators inside Viewfinder */}
                    <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Viewfinder
                      </span>

                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => setShowGrid(!showGrid)}
                          className={`p-1.5 rounded-lg text-xs ${
                            showGrid ? 'bg-white/20 text-white' : 'text-stone-400'
                          }`}
                          title="Toggle 3x3 Composition Grid"
                        >
                          <Grid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setUseCountdownTimer(!useCountdownTimer)}
                          className={`p-1.5 rounded-lg text-xs ${
                            useCountdownTimer ? 'bg-amber-500 text-black font-bold' : 'text-stone-400'
                          }`}
                          title="Toggle 3-second self-timer"
                        >
                          <Timer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Camera Bottom Shutter Bar */}
                  <div className="flex items-center justify-between px-6 pt-2">
                    {/* Device Upload fallback */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
                      title="Upload photo from device storage"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    {/* Main Shutter Button */}
                    <button
                      id="btn-capture-shutter"
                      onClick={handleShutterClick}
                      disabled={isCountingDown}
                      className="relative p-1.5 rounded-full border-4 border-white/80 hover:border-white transition-all transform hover:scale-105 active:scale-95 group focus:outline-none"
                    >
                      <div className="w-16 h-16 rounded-full bg-white group-hover:bg-amber-100 flex items-center justify-center shadow-lg transition-colors">
                        <Camera className="w-7 h-7 text-[#1C1B18]" />
                      </div>
                    </button>

                    {/* Switch Camera Button */}
                    <button
                      onClick={switchCamera}
                      className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
                      title="Switch Front / Rear Camera"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUTHENTIC REALISTIC CRAFT SAMPLES */}
          {activeTab === 'sample_photos' && (
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">
                    Select High-Resolution Authentic Craft Photo
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Real artisan pieces captured in natural lighting with authentic textures & patinas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {REALISTIC_CRAFT_SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    id={`btn-select-sample-${idx}`}
                    onClick={() => handleSelectSample(sample.url)}
                    className="group text-left p-2 rounded-2xl bg-[#24221E] border border-stone-800 hover:border-[#8A8A65] transition-all flex flex-col justify-between overflow-hidden shadow-sm"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-black relative">
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {sample.region}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-[11px] text-white line-clamp-1 group-hover:text-amber-300">
                        {sample.title}
                      </h5>
                      <p className="text-[9px] text-stone-400 line-clamp-1">
                        {sample.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Instant Device Camera Direct Trigger */}
              <div className="p-3 rounded-2xl bg-[#24221E] border border-stone-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-stone-300 text-[11px]">
                    Want to take a direct photo with your smartphone camera?
                  </span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#5A5A40] text-white text-[11px] font-bold hover:bg-[#484833] shrink-0"
                >
                  Open Phone Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 border-t border-stone-800 bg-[#161513] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Studio enhances color richness & removes cluttered workshop backgrounds.
          </span>
          <span className="text-stone-500">100% Client-Side Camera Privacy</span>
        </div>
      </div>
    </div>
  );
};
