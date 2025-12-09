import { GoogleGenAI } from "@google/genai";
import { GeminResponseSchema } from '../types';

export const generateDailyLiturgy = async (dateStr: string): Promise<GeminResponseSchema> => {
  // @ts-ignore - Vite uses import.meta.env, ignore TS warning if types aren't fully loaded
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("API Key is missing. Ensure VITE_API_KEY is set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  // Prompt otimizado para usar Search Grounding
  const prompt = `
  Atue como um assistente litúrgico católico preciso.
  Pesquise na web a liturgia diária católica EXATA (Leituras da Missa - CNBB) para a data: ${dateStr}.
  
  Certifique-se de encontrar:
  1. A Primeira Leitura correta para este dia específico.
  2. O Salmo Responsorial exato (atenção ao refrão e numeração correta para o dia).
  3. O Evangelho do dia.

  IMPORTANTE: O Salmo muda conforme o dia litúrgico (solenidade, memória, ferial). Não alucine. Use as informações da pesquisa para garantir a precisão.

  Retorne APENAS um objeto JSON válido (sem markdown de código) com esta estrutura exata:
  {
    "firstReadingRef": "referência bíblica",
    "firstReadingBody": "texto completo",
    "psalmRef": "referência do salmo",
    "psalmBody": "texto completo com refrão",
    "gospelRef": "referência bíblica",
    "gospelBody": "texto completo"
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Habilitar Google Search para buscar a liturgia correta do dia
        tools: [{ googleSearch: {} }],
        // Nota: responseMimeType e responseSchema NÃO podem ser usados junto com googleSearch
      },
    });

    if (response.text) {
      // Limpeza para garantir que parsearemos apenas o JSON
      // O modelo pode retornar ```json ... ``` ou texto introdutório
      let cleanText = response.text.trim();
      
      // Remove blocos de código markdown se existirem
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      
      // Tenta encontrar o primeiro '{' e o último '}' para isolar o JSON
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      return JSON.parse(cleanText) as GeminResponseSchema;
    }
    throw new Error("Não foi possível obter o texto da resposta do Gemini.");
  } catch (error) {
    console.error("Erro ao gerar liturgia:", error);
    throw error;
  }
};