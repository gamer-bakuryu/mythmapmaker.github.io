import { useRef } from 'react'

export default function AssetLibrary(){

  const inputRef = useRef()

  function uploadAssets(e){
    const files = [...e.target.files]

    console.log(files)
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 bg-black/60 backdrop-blur-md border-t border-cyan-500/20 p-3 overflow-auto">

      <div className="flex items-center gap-2 mb-3">

        <button
          className="bg-cyan-500 px-3 py-2 rounded-lg"
          onClick={()=>inputRef.current.click()}
        >
          Upload Assets
        </button>

        <input
          hidden
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={uploadAssets}
        />

      </div>

      <div className="grid grid-cols-8 gap-2">
      </div>

    </div>
  )
}
