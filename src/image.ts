const MAX_SIZE = 10 * 1024 * 1024
export async function validateImage(file: File): Promise<void> {
  if (file.size > MAX_SIZE) throw new Error('too-large')
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const jpeg = bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff
  const png = bytes[0]===0x89 && bytes[1]===0x50 && bytes[2]===0x4e && bytes[3]===0x47
  const webp = String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP'
  if (!(jpeg || png || webp)) throw new Error('unsupported-format')
}
export async function prepareImage(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob, { imageOrientation:'from-image' })
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('image-read')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(result=>result ? resolve(result) : reject(new Error('image-read')), 'image/jpeg', .88))
  } finally { bitmap.close() }
}
export async function cropCat(blob: Blob, box: [number,number,number,number]): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  try {
    const [x,y,w,h] = box, pad = Math.max(w,h)*.12
    const left = Math.max(0,x-pad), top = Math.max(0,y-pad)
    const width = Math.min(bitmap.width-left,w+2*pad), height = Math.min(bitmap.height-top,h+2*pad)
    const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=512
    const ctx=canvas.getContext('2d'); if (!ctx) throw new Error('image-read')
    ctx.fillStyle='#f2e5ce'; ctx.fillRect(0,0,512,512)
    const ratio=Math.min(512/width,512/height), dw=width*ratio, dh=height*ratio
    ctx.drawImage(bitmap,left,top,width,height,(512-dw)/2,(512-dh)/2,dw,dh)
    return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('image-read')),'image/jpeg',.9))
  } finally { bitmap.close() }
}
