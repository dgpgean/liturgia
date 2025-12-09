import React from 'react';

interface AdBannerProps {
  className?: string;
  slotId?: string; // O ID do bloco de anúncios gerado pelo AdSense (ex: "1234567890")
  format?: 'auto' | 'fluid' | 'rectangle';
}

// Removido slotId e format da desestruturação pois não estão sendo usados no momento (código comentado)
export const AdBanner: React.FC<AdBannerProps> = ({ className }) => {
  
  // No futuro, quando tiver o AdSense real, você pode reativar o useEffect e os props
  /*
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Erro ao carregar anúncio', err);
    }
  }, []);
  */

  return (
    <div className={`w-full my-6 flex justify-center items-center ${className}`}>
      {/* 
        ESTRUTURA REAL DO ADSENSE (Descomentar e usar quando tiver o ID)
        Lembre-se de adicionar slotId e format de volta nos props acima quando descomentar.
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%' }}
             data-ad-client="ca-pub-SEU_PUBLISHER_ID"
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
      */}

      {/* PLACEHOLDER VISUAL (Para ver onde o anúncio ficará) */}
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 w-full rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Publicidade</span>
        <p className="text-slate-500 text-sm">Espaço reservado para anúncio</p>
      </div>
    </div>
  );
};