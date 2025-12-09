
import { GeminResponseSchema } from '../types';

export const fetchDailyLiturgy = async (dateStr: string): Promise<GeminResponseSchema> => {
  // Construção da Data
  const dateParts = dateStr.split('-');
  // Cria a data ao meio-dia para evitar problemas de fuso horário alterando o dia
  const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), 12, 0, 0);
  
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
  
  // Lista de URLs candidatas para tentar (Mês atual, Anterior, Próximo)
  // Isso resolve inconsistências onde a Paulus usa índices diferentes para o mês
  const candidateMonthIndices = [monthIndex, monthIndex - 1, monthIndex + 1].filter(m => m >= 0 && m <= 11);
  const candidateUrls = candidateMonthIndices.map(m => 
    `https://www.paulus.com.br/portal/liturgia-diaria/${day}-${weekdaySlug}-${m}/`
  );

  // Mapa de sobrescritos para números dos versículos
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };

  const toSuperscript = (text: string) => {
    return text.split('').map(char => superscripts[char] || char).join('');
  };

  // Extrai texto convertendo tags <sup> em caracteres Unicode
  const extractTextWithSuperscripts = (node: Node): string => {
    let result = '';
    node.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            result += child.textContent || '';
        } else if (child.nodeName === 'SUP') {
            result += toSuperscript(child.textContent || '');
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            result += extractTextWithSuperscripts(child);
        }
    });
    return result;
  };

  // Validador para garantir que baixamos uma página com conteúdo real
  const isValidLiturgyPage = (html: string): boolean => {
      if (!html) return false;
      if (html.length < 500) return false; // Muito curto para ser uma página válida
      // Verifica se tem "Página não encontrada" ou similar
      if (html.includes("Página não encontrada") || html.includes("Page not found")) return false;
      // Verifica se tem a div principal do texto ou o título característico
      if (html.includes('id="texto"') || html.includes('class="titulo-liturgia"')) return true;
      return false;
  };

  // Função que tenta buscar em uma lista de URLs usando múltiplos proxies
  const fetchContentFromCandidates = async () => {
    for (const targetUrl of candidateUrls) {
        // Tentativa 1: AllOrigins
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.contents) {
                    if(isValidLiturgyPage(data.contents)) {
                        return data.contents;
                    }
                }
            }
        } catch (e) {
            console.warn(`AllOrigins falhou para ${targetUrl}`);
        }

        // Tentativa 2: CorsProxy
        try {
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
            if (response.ok) {
                const text = await response.text();
                if (isValidLiturgyPage(text)) {
                     return text;
                }
            }
        } catch (e) {
            console.warn(`CorsProxy falhou para ${targetUrl}`);
        }
    }
    throw new Error("Não foi possível encontrar uma página de liturgia válida nas URLs prováveis.");
  };

  try {
    const htmlContent = await fetchContentFromCandidates();

    // Parsing
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const textoDiv = doc.getElementById('texto');
    if (!textoDiv) {
      throw new Error("Estrutura da página mudou ou conteúdo indisponível.");
    }

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

    // Título e Informações
    const titleDiv = doc.querySelector('.titulo-liturgia');
    if (titleDiv) {
        // Remove numeração inicial ex: "14 – "
        liturgicalInfo = titleDiv.textContent?.replace(/^\d+\s*(–|-|&#8211;)\s*/, '').trim() || ''; 
    }

    const paragraphs = Array.from(textoDiv.children);
    let currentSection = 'info'; 
    
    const regexFirst = /Primeira Leitura/i;
    const regexPsalm = /Salmo|Salmo Responsorial/i;
    const regexSecond = /Segunda Leitura/i;
    const regexGospel = /Evangelho/i;

    let buffer = '';

    const flushBuffer = () => {
        if (!buffer.trim()) return;
        
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
        let text = extractTextWithSuperscripts(node).trim();
        const tagName = node.tagName.toLowerCase();
        const className = node.className;

        // Header de Seção
        if (tagName === 'div' && className.includes('subtitulo-liturgia')) {
            flushBuffer();
            const headerText = node.textContent?.trim() || '';

            if (regexFirst.test(headerText)) {
                currentSection = 'first';
                firstReadingRef = headerText.replace(/Primeira Leitura:?/i, '').trim();
            } else if (regexPsalm.test(headerText)) {
                currentSection = 'psalm';
                psalmRef = headerText.replace(/Salmo Responsorial:?|Salmo:?/i, '').trim();
            } else if (regexSecond.test(headerText)) {
                currentSection = 'second';
                secondReadingRef = headerText.replace(/Segunda Leitura:?/i, '').trim();
            } else if (regexGospel.test(headerText)) {
                currentSection = 'gospel';
                gospelRef = headerText.replace(/Evangelho:?/i, '').trim();
            } else if (headerText.includes('Reflexão')) {
                currentSection = 'reflection';
            }
            continue;
        }

        if (currentSection === 'reflection' || text.includes('(Dia a Dia com o Evangelho')) {
            break;
        }

        if (currentSection === 'info') {
            if (text.includes('(') && text.includes(')')) {
                const lower = text.toLowerCase();
                if (lower.includes('verde')) liturgicalColor = 'Verde';
                else if (lower.includes('roxo')) liturgicalColor = 'Roxo';
                else if (lower.includes('vermelho')) liturgicalColor = 'Vermelho';
                else if (lower.includes('branco')) liturgicalColor = 'Branco';
                else if (lower.includes('rosa')) liturgicalColor = 'Rosa';
            }
            // Pega info extra em caixa alta (ex: 3º DOMINGO DO ADVENTO)
            if (text === text.toUpperCase() && text.length > 5 && !text.startsWith('(')) {
                 if(liturgicalInfo && !liturgicalInfo.includes(text)) liturgicalInfo += ` - ${text}`;
                 else if (!liturgicalInfo) liturgicalInfo = text;
            }
        } else {
            // Lógica para ignorar comentários introdutórios (comuns aos domingos)
            // Geralmente estão alinhados à direita ou em itálico longo
            const style = node.getAttribute('style') || '';
            const isRightAligned = style.includes('text-align: right');
            const isItalicStart = node.querySelector('em') && node.textContent?.length && node.textContent.length > 20;
            // Exceção importante: O Aleluia do Evangelho às vezes é formatado assim, mas precisamos dele
            const isAlleluia = text.toLowerCase().includes('aleluia');

            if ((isRightAligned || isItalicStart) && !isAlleluia) {
                continue; 
            }

            text = text.replace(/\s+/g, ' ');

            if (currentSection === 'psalm') {
                text = text.replace(/–\s*R\.$/, '').replace(/\/\s*R\.$/, '').trim();
                const isRefrainStyle = node.querySelector('strong') || node.querySelector('em');
                
                // Melhora detecção de refrão
                if ((isRefrainStyle || text.startsWith('R.') || text.startsWith('R:')) && !text.toLowerCase().includes('leitura')) {
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
        throw new Error("Conteúdo incompleto ou falha ao extrair as leituras.");
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
