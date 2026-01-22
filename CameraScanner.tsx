
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, isAnalyzing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        setError("No se pudo acceder a la cámara. Por favor, otorga los permisos necesarios.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      onCapture(base64);
    }
  }, [isAnalyzing, onCapture]);

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-black aspect-[3/4] shadow-2xl">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white bg-red-900/50">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scanning Overlay */}
          {isCameraReady && !isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 h-1 bg-green-400 opacity-75 scan-line blur-[1px]" />
              <div className="absolute inset-0 border-[40px] border-black/30">
                <div className="w-full h-full border-2 border-white/20 rounded-lg flex items-center justify-center">
                  <div className="w-64 h-32 border border-green-400/50 rounded flex items-center justify-center">
                    <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Enfoca los ingredientes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white font-medium animate-pulse">Analizando ingredientes...</p>
            </div>
          )}

          <div className="absolute bottom-8 inset-x-0 flex justify-center z-10">
            <button
              onClick={handleCapture}
              disabled={isAnalyzing || !isCameraReady}
              className={`group flex items-center justify-center w-20 h-20 rounded-full border-4 border-white transition-all transform active:scale-95 ${
                isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
