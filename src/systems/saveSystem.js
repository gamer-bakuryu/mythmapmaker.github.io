const DB_NAME = 'rpg-map-builder'
const STORE = 'maps'

export async function openDatabase(){

  return new Promise((resolve,reject)=>{

    const request = indexedDB.open(DB_NAME,1)

    request.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE)
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = reject
  })
}

export async function saveMap(data){

  const db = await openDatabase()

  const tx = db.transaction(STORE,'readwrite')

  tx.objectStore(STORE).put(data,'autosave')
}
