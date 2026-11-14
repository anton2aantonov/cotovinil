import { tracks } from './data'
import type { Album, CoverFilter, CoverLayout } from './types'

export const defaultCover: CoverLayout = { fit: 'contain', x: 0, y: 0, zoom: 1, filter: 'original' }
const filters: CoverFilter[] = ['original', 'warm', 'mono', 'film']
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function normalizeCover(value?: Partial<CoverLayout> | null): CoverLayout {
  return {
    fit: value?.fit === 'cover' ? 'cover' : 'contain',
    x: clamp(Number.isFinite(value?.x) ? value!.x! : 0, -1, 1),
    y: clamp(Number.isFinite(value?.y) ? value!.y! : 0, -1, 1),
    zoom: clamp(Number.isFinite(value?.zoom) ? value!.zoom! : 1, 1, 2.4),
    filter: filters.includes(value?.filter as CoverFilter) ? value!.filter! : 'original',
  }
}

function fitText(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, width: number, initial: number, minimum: number, family: string) {
  let size = initial
  while (size > minimum) {
    ctx.font = `bold ${size}px ${family}`
    if (ctx.measureText(value).width <= width) break
    size -= 2
  }
  ctx.font = `bold ${size}px ${family}`
  let visible = value
  while (visible.length > 1 && ctx.measureText(visible).width > width) visible = visible.slice(0, -2) + '…'
  ctx.fillText(visible, x, y)
}

export async function renderCover(canvas: HTMLCanvasElement, album: Album, size = 1200, signal?: AbortSignal): Promise<void> {
  const layout = normalizeCover(album.cover)
  const track = tracks.find(item => item.id === album.trackId) ?? tracks[0]
  const bitmap = await createImageBitmap(album.image)
  try {
    if (signal?.aborted) return
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.setTransform(size / 1200, 0, 0, size / 1200, 0, 0)
    ctx.fillStyle = '#1d1714'
    ctx.fillRect(0, 0, 1200, 1200)
    ctx.fillStyle = '#32241f'
    ctx.fillRect(70, 95, 1060, 770)

    const base = (layout.fit === 'cover' ? Math.max : Math.min)(1060 / bitmap.width, 770 / bitmap.height)
    const width = bitmap.width * base * layout.zoom
    const height = bitmap.height * base * layout.zoom
    const offsetX = layout.x * Math.max(150, Math.abs(width - 1060) / 2)
    const offsetY = layout.y * Math.max(150, Math.abs(height - 770) / 2)
    ctx.save()
    ctx.beginPath()
    ctx.rect(70, 95, 1060, 770)
    ctx.clip()
    ctx.filter = layout.filter === 'warm' ? 'sepia(25%) saturate(120%)' : layout.filter === 'mono' ? 'grayscale(100%) contrast(108%)' : layout.filter === 'film' ? 'sepia(16%) contrast(112%) brightness(92%)' : 'none'
    ctx.drawImage(bitmap, 70 + (1060 - width) / 2 + offsetX, 95 + (770 - height) / 2 + offsetY, width, height)
    ctx.restore()

    ctx.fillStyle = track.color
    ctx.fillRect(70, 865, 1060, 265)
    ctx.fillStyle = '#1d1714'
    ctx.font = 'bold 40px Arial'
    ctx.fillText('MEOWAX', 105, 927)
    fitText(ctx, track.title.toUpperCase(), 105, 1016, 985, 80, 36, 'Georgia')
    fitText(ctx, album.name.toUpperCase(), 105, 1070, 985, 32, 20, 'Arial')
    ctx.font = 'bold 22px Arial'
    ctx.fillText(`${track.genre.toUpperCase()}  •  ${track.bpm} BPM`, 105, 1105)
    if (album.imageCredit) {
      ctx.font = '15px Arial'
      ctx.fillText(`PHOTO: ${album.imageCredit}`, 105, 1124, 985)
    }
    ctx.strokeStyle = '#d8b06a'
    ctx.lineWidth = 3
    ctx.strokeRect(34, 34, 1132, 1132)
  } finally { bitmap.close() }
}

export async function downloadArt(album: Album) {
  const canvas = document.createElement('canvas')
  await renderCover(canvas, album)
  const file = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Export failed')), 'image/png'))
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = `meowax-${album.id}.png`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
