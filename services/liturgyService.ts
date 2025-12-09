
import { GeminResponseSchema } from '../types';

export const fetchDailyLiturgy = async (dateStr: string): Promise<GeminResponseSchema> => {
  // Construção da URL da Paulus
  // Formato: {dia}-{dia-da-semana}-{mes-index}
  // Ex: 9-terca-feira-11 (para 9 de Dezembro)
  
  const dateParts = dateStr.split('-');
  const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
  
  const day = date.getDate();
  const monthIndex = date.getMonth(); // 0-11
  const dayOfWeek = date.getDay(); // 0-6

  const weekdays = [
    'domingo',
    'segunda-feira',
    'terca-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sabado'
  ];

  const weekdaySlug = weekdays[dayOfWeek];
  const targetUrl = `https://www.paulus.com.br/portal/liturgia-diaria/${day}-${weekdaySlug}-${monthIndex}/`;
  
  // Estratégia de Múltiplos Proxies
  // Se um falhar, tenta o próximo
  const fetchWithFallback = async () => {
    // 1. AllOrigins (Retorna JSON com o HTML dentro de 'contents')
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.contents) return data.contents;
      }
    } catch (e) {
      console.warn("Proxy AllOrigins falhou, tentando o próximo...");
    }

    // 2. CorsProxy.io (Retorna HTML puro)
    try {
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn("Proxy CorsProxy.io falhou.");
    }

    throw new Error("Não foi possível acessar a liturgia em nenhum dos serviços de proxy.");
  };

  try {
    const htmlContent = await fetchWithFallback();

    // Parsing do HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const textoDiv = doc.getElementById('texto');
    if (!textoDiv) {
      throw new Error("Estrutura da página da Paulus mudou ou conteúdo indisponível.");
    }

    // Inicialização dos dados
    let liturgicalInfo = '';
    let liturgicalColor = '';
    let firstReadingRef = '';
    let firstReadingBody = '';
    let psalmRef = '';
    let psalmBody = '';
    let secondReadingRef = '';
    let secondReadingBody = '';
    let gospelRef = '';
    let gospelBody = '';

    // Extração do Título (Data/Info)
    const titleDiv = doc.querySelector('.titulo-liturgia');
    if (titleDiv) {
        liturgicalInfo = titleDiv.textContent?.replace(/^\d+\s*–\s*/, '').trim() || ''; 
    }

    // Processamento do Conteúdo
    const paragraphs = Array.from(textoDiv.children);
    let currentSection = 'info'; 
    
    const regexFirst = /Primeira Leitura/i;
    const regexPsalm = /Salmo|Salmo Responsorial/i;
    const regexSecond = /Segunda Leitura/i;
    const regexGospel = /Evangelho/i;

    let buffer = '';

    const flushBuffer = () => {
        if (!buffer.trim()) return;
        
        // Limpeza de texto
        const cleanText = buffer
            .replace(/Palavra do Senhor\./gi, '')
            .replace(/Palavra da Salvação\./gi, '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n\n');

        if (currentSection === 'first') firstReadingBody = cleanText;
        else if (currentSection === 'psalm') psalmBody = cleanText;
        else if (currentSection === 'second') secondReadingBody = cleanText;
        else if (currentSection === 'gospel') gospelBody = cleanText;
        
        buffer = '';
    };

    for (const node of paragraphs) {
        let text = node.textContent?.trim() || '';
        const tagName = node.tagName.toLowerCase();
        const className = node.className;

        // Detecta Cabeçalhos de Seção
        if (tagName === 'div' && className.includes('subtitulo-liturgia')) {
            flushBuffer();

            if (regexFirst.test(text)) {
                currentSection = 'first';
                firstReadingRef = text.replace(/Primeira Leitura:?/i, '').trim();
            } else if (regexPsalm.test(text)) {
                currentSection = 'psalm';
                psalmRef = text.replace(/Salmo Responsorial:?|Salmo:?/i, '').trim();
            } else if (regexSecond.test(text)) {
                currentSection = 'second';
                secondReadingRef = text.replace(/Segunda Leitura:?/i, '').trim();
            } else if (regexGospel.test(text)) {
                currentSection = 'gospel';
                gospelRef = text.replace(/Evangelho:?/i, '').trim();
            } else if (text.includes('Reflexão')) {
                currentSection = 'reflection';
            }
            continue;
        }

        if (currentSection === 'reflection' || text.includes('(Dia a Dia com o Evangelho')) {
            break;
        }

        if (currentSection === 'info') {
            // Extração de cor e info extra
            if (text.includes('(') && text.includes(')')) {
                const colorMatch = text.match(/\((.*?)\)/);
                if (colorMatch) {
                    const contentParen = colorMatch[1].toLowerCase();
                    if (contentParen.includes('verde')) liturgicalColor = 'Verde';
                    else if (contentParen.includes('roxo')) liturgicalColor = 'Roxo';
                    else if (contentParen.includes('vermelho')) liturgicalColor = 'Vermelho';
                    else if (contentParen.includes('branco')) liturgicalColor = 'Branco';
                    else if (contentParen.includes('rosa')) liturgicalColor = 'Rosa';
                }
            }
            if (text === text.toUpperCase() && text.length > 5 && !text.startsWith('(')) {
                 if(liturgicalInfo) liturgicalInfo += ` - ${text}`;
                 else liturgicalInfo = text;
            }
        } else {
            // Limpeza de espaços duplicados
            text = text.replace(/\s+/g, ' ');

            if (currentSection === 'psalm') {
                // Remove marcações finais
                text = text.replace(/–\s*R\.$/, '').replace(/\/\s*R\.$/, '').trim();
                
                // Formatação do Refrão para vermelho
                // Verifica se é negrito/italico OU se começa com R.
                const isRefrainStyle = node.querySelector('strong') || node.querySelector('em');
                if ((isRefrainStyle || text.startsWith('R.') || text.startsWith('R:')) && !text.toLowerCase().includes('leitura') && !text.toLowerCase().includes('salmo')) {
                    if (!text.startsWith('R.') && !text.startsWith('R:')) {
                        text = 'R. ' + text;
                    }
                }
            }

            if (text) {
                buffer += text + '\n';
            }
        }
    }
    
    flushBuffer();

    if (!firstReadingBody && !gospelBody) {
        throw new Error("Conteúdo incompleto. Falha ao extrair leituras.");
    }

    return {
      liturgicalColor: liturgicalColor || 'Verde',
      liturgicalInfo: liturgicalInfo || 'Liturgia Diária',
      firstReadingRef: firstReadingRef,
      firstReadingBody: firstReadingBody,
      psalmRef: psalmRef,
      psalmBody: psalmBody,
      secondReadingRef: secondReadingRef,
      secondReadingBody: secondReadingBody,
      gospelRef: gospelRef,
      gospelBody: gospelBody
    };

  } catch (error) {
    console.error("Erro no scraper da Paulus:", error);
    throw error;
  }
};
