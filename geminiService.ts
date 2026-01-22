
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeLabel = async (base64Image: string): Promise<AnalysisResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Eres un experto científico de alimentos especializado en aditivos y normativas de la FDA.
    Tu tarea es identificar aditivos alimentarios de las etiquetas en la imagen proporcionada.
    Para cada aditivo identificado, proporciona:
    1. Nombre del aditivo.
    2. Código E (si aplica).
    3. Propósito (ej. conservante, colorante).
    4. Estatus según la FDA (GRAS, prohibido, regulado).
    5. Riesgos potenciales para la salud, citando fuentes de la FDA y tesis académicas o estudios científicos.
    6. Calificación de seguridad: SAFE (seguro), CAUTION (precaución), AVOID (evitar).
    
    Responde ÚNICAMENTE en formato JSON con la estructura definida.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      productName: { type: Type.STRING },
      summary: { type: Type.STRING },
      additives: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            code: { type: Type.STRING },
            purpose: { type: Type.STRING },
            fdaStatus: { type: Type.STRING },
            healthRisks: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            sources: {
              type: Type.OBJECT,
              properties: {
                fda: { type: Type.STRING },
                academic: { type: Type.STRING }
              },
              required: ["fda", "academic"]
            },
            safetyRating: { 
              type: Type.STRING,
              description: "Must be SAFE, CAUTION, or AVOID"
            }
          },
          required: ["name", "purpose", "fdaStatus", "healthRisks", "sources", "safetyRating"]
        }
      }
    },
    required: ["additives", "summary"]
  };

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: "Analiza esta etiqueta de ingredientes e identifica todos los aditivos alimentarios. Proporciona detalles sobre su seguridad basándote en la FDA y estudios académicos."
  };

  try {
    const result = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const jsonText = result.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("No se pudo analizar la imagen. Asegúrate de que la etiqueta sea legible.");
  }
};
