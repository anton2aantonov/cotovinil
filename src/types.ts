export type Genre = 'Jazz' | 'Soul' | 'Funk' | 'Disco' | 'Lo-fi' | 'Synthwave'
export type AnalysisPhase = 'idle' | 'image-selected' | 'loading-model' | 'detecting' | 'selecting-cat' | 'classifying' | 'generating-result' | 'success' | 'partial-success' | 'error'
export type PlayerPhase = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error'
export type CoverFilter = 'original' | 'warm' | 'mono' | 'film'
export interface CoverLayout { fit: 'contain' | 'cover'; x: number; y: number; zoom: number; filter: CoverFilter }
export interface CatBox { bbox: [number, number, number, number]; score: number }
export interface Album {
  id: string
  createdAt: number
  name: string
  breed: string | null
  uncertain: boolean
  trackId: string
  image: Blob
  demo?: boolean
  imageCredit?: string
  imageSource?: string
  cover?: CoverLayout
}
export interface Settings { language: 'ru' | 'en'; volume: number; muted: boolean; reducedMotion: boolean; vinylNoise: boolean }
