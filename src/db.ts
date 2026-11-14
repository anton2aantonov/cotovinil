import Dexie, { type Table } from 'dexie'
import type { Album } from './types'

class MeowaxDB extends Dexie {
  albums!: Table<Album, string>
  constructor() { super('meowax'); this.version(1).stores({ albums:'id, createdAt, name, breed, trackId' }) }
}
export const db = new MeowaxDB()
export const collection = {
  all: () => db.albums.orderBy('createdAt').reverse().toArray(),
  get: (id: string) => db.albums.get(id),
  save: (album: Album) => db.albums.put(album),
  remove: (id: string) => db.albums.delete(id),
  clear: () => db.albums.clear(),
  count: () => db.albums.count(),
}
