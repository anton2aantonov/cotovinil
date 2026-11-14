import type { Album } from './types'
import { tracks } from './data'
export { downloadArt } from './cover'

export async function shareAlbum(album:Album, language:'ru'|'en') {
  const track=tracks.find(t=>t.id===album.trackId) ?? tracks[0]
  const text=language==='ru' ? `${album.name} слушает ${track.title} на MEOWAX` : `${album.name} listens to ${track.title} on MEOWAX`
  if(navigator.share) {try{await navigator.share({title:'MEOWAX',text})}catch{/* user cancelled */}}
  else {
    try { await navigator.clipboard.writeText(text); alert(language==='ru'?'Текст скопирован':'Text copied') }
    catch { window.prompt(language==='ru'?'Скопируй текст:':'Copy this text:', text) }
  }
}
