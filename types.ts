export enum Tab {
  LITURGY = 'LITURGY',
  PRAYERS = 'PRAYERS',
  SAVED = 'SAVED',
}

export interface LiturgyContent {
  id: string; // usually date string YYYY-MM-DD
  date: string;
  liturgicalColor?: string; // Novo: Ex: "Verde", "Roxo"
  liturgicalInfo?: string;  // Novo: Ex: "2ª Feira da 1ª Semana do Advento"
  firstReadingRef: string;
  firstReadingBody: string;
  psalmRef: string;
  psalmBody: string;
  secondReadingRef?: string; // Optional (Sundays/Solemnities)
  secondReadingBody?: string;
  gospelRef: string;
  gospelBody: string;
  type: 'liturgy';
}

export interface EucharisticPrayer {
  id: string;
  title: string;
  content: string; // HTML or markdown string
  type: 'prayer';
}

export type SavedItem = LiturgyContent | EucharisticPrayer;

export interface GeminResponseSchema {
  liturgicalColor: string;
  liturgicalInfo: string;
  firstReadingRef: string;
  firstReadingBody: string;
  psalmRef: string;
  psalmBody: string;
  secondReadingRef?: string;
  secondReadingBody?: string;
  gospelRef: string;
  gospelBody: string;
}