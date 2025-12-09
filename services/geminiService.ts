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
  1. A Cor Litúrgica do dia (Verde, Roxo, Branco, Vermelho, Rosa ou Preto).
  2. A identificação do dia litúrgico (ex: "3ª Feira da 2ª Semana do Tempo Comum" ou "Solenidade de São Pedro").
  3. A Primeira Leitura correta.
  4. O Salmo Responsorial. IMPORTANTE: 
     - Identifique o refrão completo no início com "R.".
     - DEPOIS DE CADA ESTROFE, insira uma linha contendo apenas "R." para indicar que a assembleia deve repetir o refrão.
  5. A Segunda Leitura (SE HOUVER - Comum em Domingos e Solenidades). Se não houver, deixe os campos vazios.
  6. O Evangelho do dia.

  Retorne APENAS um objeto JSON válido (sem markdown de código) com esta estrutura exata:
  {
    "liturgicalColor": "Cor (ex: Verde)",
    "liturgicalInfo": "Nome do dia (ex: Memória de Santa Luzia)",
    "firstReadingRef": "referência bíblica",
    "firstReadingBody": "texto completo",
    "psalmRef": "referência do salmo",
    "psalmBody": "texto completo formatado com 'R.' após cada estrofe",
    "secondReadingRef": "referência bíblica ou string vazia se não houver",
    "secondReadingBody": "texto completo ou string vazia se não houver",
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