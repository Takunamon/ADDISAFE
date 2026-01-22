
import React, { useState } from 'react';
import { CameraScanner } from './components/CameraScanner';
import { ResultCard } from './components/ResultCard';
import { analyzeLabel } from './services/geminiService';
import { AnalysisResponse, AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setAppState(AppState.ANALYZING);
    setErrorMessage(null);
    try {
      const result = await analyzeLabel(base64);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error inesperado.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              AddiSafe
            </h1>
          </div>
          {appState === AppState.RESULT && (
             <button 
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {(appState === AppState.IDLE || appState === AppState.ANALYZING) && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Escanea tu producto</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Captura la lista de ingredientes para identificar aditivos y sus posibles efectos en la salud según la FDA y la academia.
              </p>
            </div>
            
            <CameraScanner 
              onCapture={handleCapture} 
              isAnalyzing={appState === AppState.ANALYZING} 
            />

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <div className="text-green-600 text-xs font-black mb-1">FDA</div>
                <div className="text-[10px] text-gray-400 uppercase">Regulaciones</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
                <div className="text-blue-600 text-xs font-black mb-1">CIENCIA</div>
                <div className="text-[10px] text-gray-400 uppercase">Tesis y Estudios</div>
              </div>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && analysisResult && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <ResultCard data={analysisResult} onReset={handleReset} />
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto text-center space-y-6 py-12">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Ups, algo salió mal</h3>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
            <button 
              onClick={handleReset}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-xl"
            >
              Reintentar escaneo
            </button>
          </div>
        )}
      </main>

      {/* Info Footer */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/60 backdrop-blur-md border-t border-gray-100 py-3">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
          <span>Fuente: FDA & Research Databases</span>
          <span>© 2024 AddiSafe AI</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
