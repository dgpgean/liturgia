import React, { useState, useEffect } from 'react';
import { Tab, LiturgyContent, EucharisticPrayer, SavedItem } from './types';
import { generateDailyLiturgy } from './services/geminiService';
import { PRAYERS_DATA } from './constants';
import { BookOpenIcon, CrossIcon, SaveIcon, BookmarkIcon, RefreshIcon, MaximizeIcon, ArrowLeftIcon, TypeIcon, PlusIcon, MinusIcon } from './components/Icons';
import { AdBanner } from './components/AdBanner';

// --- Type definition for focused content ---
interface FocusedContent {
  title: string;
  subtitle?: string;
  content: string;
  itemToSave?: SavedItem; // If provided, allows saving from the focused view
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LITURGY);
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  
  // Font Size State (1-5, default 3)
  const [fontSizeLevel, setFontSizeLevel] = useState(3);
  
  // Focused View State (Read Mode)
  const [focusedContent, setFocusedContent] = useState<FocusedContent | null>(null);

  // Liturgy State
  const [liturgyDate, setLiturgyDate] = useState(new Date().toISOString().split('T')[0]);
  const [liturgyData, setLiturgyData] = useState<LiturgyContent>({
    id: new Date().toISOString().split('T')[0],
    date: new Date().toISOString().split('T')[0],
    firstReadingRef: '',
    firstReadingBody: '',
    psalmRef: '',
    psalmBody: '',
    gospelRef: '',
    gospelBody: '',
    type: 'liturgy'
  });
  const [showFontMenu, setShowFontMenu] = useState(false);

  // Load saved items on mount
  useEffect(() => {
    const saved = localStorage.getItem('catolico_saved_items');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  const saveToLocal = (items: SavedItem[]) => {
    localStorage.setItem('catolico_saved_items', JSON.stringify(items));
    setSavedItems(items);
  };

  const saveItem = (item: SavedItem) => {
    // Remove existing version if any (to allow updates)
    const otherItems = savedItems.filter(i => i.id !== item.id);
    const newItems = [...otherItems, item];
    saveToLocal(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = savedItems.filter(i => i.id !== id);
    saveToLocal(newItems);
  };

  const toggleSaveItem = (item: SavedItem) => {
    if (isSaved(item.id)) {
      removeItem(item.id);
    } else {
      saveItem(item);
    }
  };

  const isSaved = (id: string) => savedItems.some(i => i.id === id);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setLiturgyDate(newDate);
    
    // Check if we have this date saved locally (Offline support)
    const savedLiturgy = savedItems.find(item => item.id === newDate && item.type === 'liturgy');
    
    if (savedLiturgy) {
        setLiturgyData(savedLiturgy as LiturgyContent);
    } else {
        // Reset to empty state for the new date to avoid confusion
        setLiturgyData({
            id: newDate,
            date: newDate,
            firstReadingRef: '',
            firstReadingBody: '',
            psalmRef: '',
            psalmBody: '',
            gospelRef: '',
            gospelBody: '',
            type: 'liturgy'
        });
    }
  };

  const handleGenerateLiturgy = async () => {
    setLoading(true);
    try {
      const data = await generateDailyLiturgy(liturgyDate);
      const newLiturgyData: LiturgyContent = {
        ...data,
        id: liturgyDate,
        date: liturgyDate,
        type: 'liturgy'
      };
      setLiturgyData(newLiturgyData);
    } catch (err) {
      alert("Erro ao gerar liturgia. Verifique sua conexão. Se você salvou esta liturgia anteriormente, selecione a data correspondente.");
    } finally {
      setLoading(false);
    }
  };

  const openReader = (title: string, content: string, subtitle?: string, itemToSave?: SavedItem) => {
      setFocusedContent({ title, content, subtitle, itemToSave });
  };

  const increaseFont = () => setFontSizeLevel(prev => Math.min(prev + 1, 5));
  const decreaseFont = () => setFontSizeLevel(prev => Math.max(prev - 1, 1));

  const getFontSizeClass = (level: number) => {
    switch(level) {
        case 1: return 'text-sm';
        case 2: return 'text-base';
        case 3: return 'text-lg';
        case 4: return 'text-xl';
        case 5: return 'text-2xl';
        default: return 'text-lg';
    }
  };
  
  const getLineHeightClass = (level: number) => {
    switch(level) {
        case 1: return 'leading-normal';
        case 2: return 'leading-relaxed';
        case 3: return 'leading-relaxed';
        case 4: return 'leading-loose';
        case 5: return 'leading-loose';
        default: return 'leading-relaxed';
    }
  };

  // --- Views ---

  // Componente de Leitura Focada (Modal Full Screen)
  const FullScreenReader = () => {
    if (!focusedContent) return null;
    
    const isPrayer = focusedContent.itemToSave?.type === 'prayer';

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-in slide-in-from-bottom-5 duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-50">
          <button 
            onClick={() => setFocusedContent(null)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full flex gap-2 items-center"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            <span className="font-medium text-sm">Voltar</span>
          </button>

          <div className="flex items-center gap-1">
             <div className="flex items-center bg-slate-100 rounded-lg mr-2 p-1">
                <button onClick={decreaseFont} className="p-2 hover:bg-white rounded-md transition-colors text-slate-600">
                    <MinusIcon className="w-4 h-4"/>
                </button>
                <span className="px-2 text-xs font-bold text-slate-400">Aa</span>
                <button onClick={increaseFont} className="p-2 hover:bg-white rounded-md transition-colors text-slate-600">
                    <PlusIcon className="w-4 h-4"/>
                </button>
             </div>

            {focusedContent.itemToSave && (
               <button 
               onClick={() => toggleSaveItem(focusedContent.itemToSave!)}
               className={`p-2 rounded-full transition-colors ${
                 isSaved(focusedContent.itemToSave.id) ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
               }`}
             >
                {isSaved(focusedContent.itemToSave.id) ? <BookmarkIcon filled className="w-6 h-6"/> : <SaveIcon className="w-6 h-6"/>}
             </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto p-6 pb-20">
          {focusedContent.subtitle && (
            <div className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">
              {focusedContent.subtitle}
            </div>
          )}
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 leading-tight">
            {focusedContent.title}
          </h2>
          
          <div 
            // CRITICAL FIX: If it is a prayer (HTML), do NOT use whitespace-pre-wrap, otherwise HTML newlines create massive gaps.
            className={`reading-text ${getFontSizeClass(fontSizeLevel)} ${getLineHeightClass(fontSizeLevel)} text-slate-800 font-serif ${isPrayer ? 'whitespace-normal' : 'whitespace-pre-wrap'}`}
            dangerouslySetInnerHTML={{ __html: focusedContent.content }}
          />
          
          {/* Ad at end of reading */}
          <AdBanner />
        </div>
      </div>
    );
  };

  const LiturgyView = () => (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full sm:w-auto">
                <input 
                type="date" 
                value={liturgyDate}
                onChange={handleDateChange}
                className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 w-full"
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto items-center">
                 {/* Save Button for Liturgy */}
                {liturgyData.gospelBody && (
                    <button
                        onClick={() => saveItem(liturgyData)}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors shadow-sm border ${
                            isSaved(liturgyData.id)
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                        }`}
                        title="Salvar para acesso offline"
                    >
                        {isSaved(liturgyData.id) ? <BookmarkIcon filled className="w-4 h-4"/> : <SaveIcon className="w-4 h-4" />}
                        <span className="text-sm font-medium hidden sm:inline">Salvar</span>
                    </button>
                )}
                
                <button 
                onClick={handleGenerateLiturgy}
                disabled={loading}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                <RefreshIcon spin={loading} className="w-4 h-4" />
                {loading ? 'Gerando...' : 'Carregar'}
                </button>
            </div>
        </div>
      </div>

      {/* Top Ad */}
      <AdBanner />

      <div className="space-y-6 relative z-0">
        {/* First Reading */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="mb-4 pb-2 border-b border-amber-100 flex justify-between items-center">
            <h3 className="text-amber-700 font-bold uppercase tracking-wide text-sm">Primeira Leitura</h3>
               {liturgyData.firstReadingBody && (
                <button 
                    onClick={() => openReader(liturgyData.firstReadingRef, liturgyData.firstReadingBody, "Primeira Leitura", liturgyData)}
                    className="text-amber-600 hover:bg-amber-50 p-1 rounded transition-colors" title="Expandir"
                >
                    <MaximizeIcon className="w-5 h-5" />
                </button>
               )}
          </div>
          
            <>
              <p className="text-slate-500 text-sm font-medium mb-2">{liturgyData.firstReadingRef || "Referência não definida"}</p>
              <div className={`reading-text text-slate-800 whitespace-pre-wrap line-clamp-[10] ${getFontSizeClass(fontSizeLevel)} ${getLineHeightClass(fontSizeLevel)}`}>
                {liturgyData.firstReadingBody || "Clique em 'Carregar' para preencher via IA."}
              </div>
              {liturgyData.firstReadingBody && (
                  <button onClick={() => openReader(liturgyData.firstReadingRef, liturgyData.firstReadingBody, "Primeira Leitura", liturgyData)} className="mt-2 text-sm text-amber-600 hover:underline">Ler tudo...</button>
              )}
            </>
        </section>

        {/* Psalm */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <div className="mb-4 pb-2 border-b border-amber-100 flex justify-between items-center">
            <h3 className="text-amber-700 font-bold uppercase tracking-wide text-sm">Salmo Responsorial</h3>
             {liturgyData.psalmBody && (
                <button 
                    onClick={() => openReader(liturgyData.psalmRef, liturgyData.psalmBody, "Salmo Responsorial", liturgyData)}
                    className="text-amber-600 hover:bg-amber-50 p-1 rounded transition-colors" title="Expandir"
                >
                    <MaximizeIcon className="w-5 h-5" />
                </button>
            )}
          </div>
            <>
                <p className="text-slate-500 text-sm font-medium mb-2">{liturgyData.psalmRef}</p>
                <div className={`reading-text text-slate-700 italic whitespace-pre-wrap line-clamp-[8] ${getFontSizeClass(fontSizeLevel)} ${getLineHeightClass(fontSizeLevel)}`}>
                    {liturgyData.psalmBody || "Conteúdo do Salmo..."}
                </div>
                 {liturgyData.psalmBody && (
                  <button onClick={() => openReader(liturgyData.psalmRef, liturgyData.psalmBody, "Salmo Responsorial", liturgyData)} className="mt-2 text-sm text-amber-600 hover:underline">Ler tudo...</button>
              )}
            </>
        </section>

        {/* Gospel */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-12 -mt-12 z-0"></div>
           <div className="mb-4 pb-2 border-b border-red-100 relative z-10 flex justify-between items-center">
            <h3 className="text-red-800 font-bold uppercase tracking-wide text-sm">Evangelho</h3>
             {liturgyData.gospelBody && (
                <button 
                    onClick={() => openReader(liturgyData.gospelRef, liturgyData.gospelBody, "Evangelho", liturgyData)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors" title="Expandir"
                >
                    <MaximizeIcon className="w-5 h-5" />
                </button>
            )}
          </div>
          
            <div className="relative z-10">
                <p className="text-red-600 text-sm font-bold mb-4">{liturgyData.gospelRef}</p>
                <div className={`reading-text text-slate-900 whitespace-pre-wrap line-clamp-[12] ${getFontSizeClass(fontSizeLevel)} ${getLineHeightClass(fontSizeLevel)}`}>
                    {liturgyData.gospelBody || "Conteúdo do Evangelho..."}
                </div>
                 {liturgyData.gospelBody && (
                  <button onClick={() => openReader(liturgyData.gospelRef, liturgyData.gospelBody, "Evangelho", liturgyData)} className="mt-2 text-sm text-red-600 hover:underline">Ler Evangelho completo...</button>
              )}
            </div>
        </section>
        
        {/* Bottom Ad */}
        <AdBanner />

        {/* Floating Action Button for Liturgy (Mobile Friendly) */}
        {liturgyData.gospelBody && (
             <div className="fixed bottom-20 right-4 z-40">
                <button 
                onClick={() => toggleSaveItem(liturgyData)}
                className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
                    isSaved(liturgyData.id) 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
                aria-label={isSaved(liturgyData.id) ? "Remover dos salvos" : "Salvar offline"}
                >
                {isSaved(liturgyData.id) ? <BookmarkIcon filled /> : <SaveIcon />}
                </button>
            </div>
        )}
      </div>
    </div>
  );

  const PrayersView = () => (
    <div className="space-y-4 pb-24">
      {/* Top Ad in Prayers */}
      <AdBanner />
      
      {PRAYERS_DATA.map((prayer, index) => (
        <React.Fragment key={prayer.id}>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-amber-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif font-bold text-lg text-slate-800">{prayer.title}</h3>
                <button 
                onClick={() => toggleSaveItem(prayer)}
                className={`p-2 rounded-full transition-colors ${
                    isSaved(prayer.id) ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                >
                    {isSaved(prayer.id) ? <BookmarkIcon filled className="w-5 h-5"/> : <SaveIcon className="w-5 h-5"/>}
                </button>
            </div>
            {/* Preview of content (stripped of tags for preview) */}
            <div className="text-slate-500 leading-relaxed text-sm line-clamp-3 font-serif">
                {prayer.content.replace(/<[^>]*>?/gm, ' ').substring(0, 150)}...
            </div>
            
            <button 
                onClick={() => openReader(prayer.title, prayer.content, "Oração Eucarística", prayer)}
                className="mt-4 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <BookOpenIcon className="w-4 h-4"/>
                Ler oração completa
            </button>
            </div>
            
            {/* Insert ad after the 2nd prayer */}
            {index === 1 && <AdBanner />}
        </React.Fragment>
      ))}
    </div>
  );

  const SavedView = () => (
    <div className="space-y-4 pb-24">
      <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
        Os itens salvos aqui podem ser acessados mesmo sem conexão com a internet.
      </div>
      
      {savedItems.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BookmarkIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Nenhum item salvo para leitura offline.</p>
        </div>
      ) : (
        savedItems.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-blue-600 border-slate-100">
            <div className="flex justify-between items-start">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                        {item.type === 'liturgy' ? 'Liturgia' : 'Oração'}
                    </span>
                    <h3 className="font-bold text-slate-800 text-lg">
                        {item.type === 'liturgy' ? `Liturgia de ${(item as LiturgyContent).date}` : (item as EucharisticPrayer).title}
                    </h3>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 p-2"
                  title="Remover dos salvos"
                >
                    <CrossIcon className="w-5 h-5" />
                </button>
            </div>
            {item.type === 'liturgy' ? (
                <div className="mt-2 text-sm text-slate-500">
                    Evangelho: {(item as LiturgyContent).gospelRef}
                </div>
            ) : null}
            
            <button 
                onClick={() => {
                   if(item.type === 'liturgy') {
                       setLiturgyData(item as LiturgyContent);
                       setLiturgyDate((item as LiturgyContent).date);
                       setActiveTab(Tab.LITURGY);
                   } else {
                        openReader(
                            (item as EucharisticPrayer).title, 
                            (item as EucharisticPrayer).content, 
                            "Oração Salva", 
                            item
                        );
                   }
                }}
                className="mt-4 w-full bg-slate-50 text-slate-600 py-2 rounded border border-slate-200 hover:bg-slate-100 text-sm font-medium"
            >
                Abrir
            </button>
          </div>
        ))
      )}
      
      <AdBanner />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Full Screen Reader Modal */}
      {focusedContent && <FullScreenReader />}

      {/* Header */}
      <header className="bg-[#002366] text-white p-4 shadow-lg relative z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-500 rounded-lg">
                <CrossIcon className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold font-serif leading-none">Católico na Missa</h1>
                <p className="text-xs text-blue-200 opacity-80 mt-1">Liturgia e Orações</p>
             </div>
          </div>
          
          {/* Main screen font controls */}
          <div className="relative">
             <button 
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="p-2 text-blue-200 hover:bg-blue-900 rounded-lg transition-colors"
                title="Ajustar texto"
             >
                <TypeIcon className="w-6 h-6" />
             </button>
             
             {showFontMenu && (
                 <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-slate-100 p-2 flex items-center gap-1 z-50 min-w-[120px]">
                    <button onClick={decreaseFont} className="p-2 hover:bg-slate-100 rounded text-slate-600 w-full flex justify-center">
                        <MinusIcon className="w-4 h-4"/>
                    </button>
                    <span className="text-xs text-slate-400 font-bold mx-1">Aa</span>
                    <button onClick={increaseFont} className="p-2 hover:bg-slate-100 rounded text-slate-600 w-full flex justify-center">
                        <PlusIcon className="w-4 h-4"/>
                    </button>
                 </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 mt-2">
        {activeTab === Tab.LITURGY && <LiturgyView />}
        {activeTab === Tab.PRAYERS && <PrayersView />}
        {activeTab === Tab.SAVED && <SavedView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab(Tab.LITURGY)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.LITURGY ? 'text-[#002366]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookOpenIcon className={`w-6 h-6 ${activeTab === Tab.LITURGY ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium uppercase tracking-wide">Liturgia</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(Tab.PRAYERS)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.PRAYERS ? 'text-[#002366]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <CrossIcon className={`w-6 h-6 ${activeTab === Tab.PRAYERS ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium uppercase tracking-wide">Orações</span>
          </button>

          <button 
            onClick={() => setActiveTab(Tab.SAVED)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === Tab.SAVED ? 'text-[#002366]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BookmarkIcon filled={activeTab === Tab.SAVED} className={`w-6 h-6 ${activeTab === Tab.SAVED ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-medium uppercase tracking-wide">Salvos</span>
          </button>
        </div>
      </nav>
      
      {/* Safe area padding for bottom nav */}
      <div className="h-6 w-full bg-white fixed bottom-0 z-30 sm:hidden"></div>
    </div>
  );
}