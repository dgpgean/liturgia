import { GoogleGenAI } from "@google/genai";
import { GeminResponseSchema } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export const generateDailyLiturgy = async (dateStr: string): Promise<GeminResponseSchema> => {
  // @ts-ignore - Vite uses import.meta.env, ignore TS warning if types aren't fully loaded
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("API Key is missing. Ensure VITE_API_KEY is set in your environment variables.");
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

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

  Retorne APENAS um objeto JSON válido (sem markdown de código ou explicações) com esta estrutura exata:
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

  let lastError: any;

  // Loop de tentativas (Retry Logic)
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 1) {
        console.log(`Tentativa ${attempt} de ${MAX_RETRIES} para gerar liturgia...`);
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      if (response.text) {
        let cleanText = response.text.trim();
        
        // Estratégia de extração de JSON mais robusta:
        // Procura pelo primeiro '{' e o último '}' para isolar o objeto JSON,
        // ignorando qualquer texto conversacional antes ou depois.
        const firstBrace = cleanText.indexOf('{');
        const lastBrace = cleanText.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1) {
          cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        } else {
             // Se não achar chaves, provavelmente não é um JSON válido.
             throw new Error("A resposta da IA não contém um formato JSON válido.");
        }

        return JSON.parse(cleanText) as GeminResponseSchema;
      }
      
      throw new Error("Resposta da IA veio vazia.");

    } catch (error) {
      console.warn(`Erro na tentativa ${attempt}:`, error);
      lastError = error;
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError || new Error("Não foi possível gerar a liturgia após várias tentativas.");
};