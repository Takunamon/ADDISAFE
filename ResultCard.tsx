
import React from 'react';
import { Additive, AnalysisResponse } from '../types';

interface ResultCardProps {
  data: AnalysisResponse;
  onReset: () => void;
}

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'SAFE': return 'bg-green-100 text-green-800 border-green-200';
    case 'CAUTION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'AVOID': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getRatingEmoji = (rating: string) => {
  switch (rating) {
    case 'SAFE': return '✅';
    case 'CAUTION': return '⚠️';
    case 'AVOID': return '🚫';
    default: return '❔';
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {data.productName || "Resultado del Análisis"}
          </h2>
          <button 
            onClick={onReset}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Nueva Consulta
          </button>
        </div>
        <p className="text-gray-600 italic leading-relaxed">"{data.summary}"</p>
      </div>

      <div className="grid gap-4">
        {data.additives.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-50 flex flex-col md:flex-row">
            <div className={`p-4 md:w-48 flex flex-col items-center justify-center text-center ${getRatingColor(item.safetyRating)}`}>
              <span className="text-4xl mb-2">{getRatingEmoji(item.safetyRating)}</span>
              <span className="text-xs font-black tracking-widest uppercase">{item.safetyRating}</span>
              {item.code && <span className="mt-1 text-lg font-bold">{item.code}</span>}
            </div>
            
            <div className="p-6 flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 font-medium">{item.purpose}</p>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-xl">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-tighter mb-1">Estatus FDA</h4>
                <p className="text-sm text-blue-800">{item.fdaStatus}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-red-700 mb-2">Riesgos Potenciales</h4>
                <ul className="space-y-1">
                  {item.healthRisks.map((risk, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fuente FDA</h4>
                  <p className="text-xs text-gray-600 leading-tight">{item.sources.fda}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fuente Tesis/Estudio</h4>
                  <p className="text-xs text-gray-600 leading-tight italic">{item.sources.academic}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.additives.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
          <p className="text-gray-500 text-lg">No se detectaron aditivos en esta imagen.</p>
          <button 
            onClick={onReset}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
};
