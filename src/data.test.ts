import { describe, expect, it } from 'vitest'
import { breedGenre, defaultSettings, recommend, tracks } from './data'
import { validateImage } from './image'
import { defaultCover, normalizeCover } from './cover'

describe('recommendations',()=>{
  it('maps requested breeds to distinct genres',()=>{
    expect(breedGenre['Siamese']).toBe('Jazz')
    expect(breedGenre['Maine Coon']).toBe('Soul')
    expect(breedGenre['Bengal']).toBe('Funk')
    expect(breedGenre['Sphynx']).toBe('Synthwave')
  })
  it('selects the matching track and a stable fallback',()=>{
    expect(recommend('Ragdoll').id).toBe('rain-on-the-needle')
    expect(recommend(null).id).toBe('rain-on-the-needle')
    expect(new Set(tracks.map(track=>track.id)).size).toBe(6)
  })
  it('has safe default settings',()=>expect(defaultSettings).toMatchObject({language:'ru',muted:false,volume:72,vinylNoise:true}))
})
describe('cover layout', () => {
  it('opens a legacy album with a safe full-image composition', () => {
    expect(normalizeCover(undefined)).toEqual(defaultCover)
  })
  it('clamps corrupt or out-of-range values from storage', () => {
    expect(normalizeCover({ fit: 'cover', x: 12, y: -4, zoom: 99, filter: 'mono' })).toEqual({ fit: 'cover', x: 1, y: -1, zoom: 2.4, filter: 'mono' })
  })
})
describe('image validation',()=>{
  it('accepts JPEG magic bytes',async()=>{
    const file=new File([new Uint8Array([0xff,0xd8,0xff,0x00])],'cat.jpg',{type:'image/jpeg'})
    await expect(validateImage(file)).resolves.toBeUndefined()
  })
  it('rejects spoofed file types',async()=>{
    const file=new File(['not an image'],'cat.png',{type:'image/png'})
    await expect(validateImage(file)).rejects.toThrow('unsupported-format')
  })
  it('rejects oversized files',async()=>{
    const file=new File([new Uint8Array(10*1024*1024+1)],'large.jpg',{type:'image/jpeg'})
    await expect(validateImage(file)).rejects.toThrow('too-large')
  })
})
