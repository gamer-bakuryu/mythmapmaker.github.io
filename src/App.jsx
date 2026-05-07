import Viewport from './editor/viewport/Viewport'
import AssetLibrary from './editor/assets/AssetLibrary'
import InspectorPanel from './editor/inspector/InspectorPanel'
import HierarchyPanel from './editor/hierarchy/HierarchyPanel'

export default function App(){

  return (
    <div className="w-screen h-screen bg-[#08090d] text-white overflow-hidden relative flex">

      <div className="absolute top-0 left-0 right-0 h-14 z-50 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 flex items-center px-4 gap-3">

        <div className="text-cyan-400 font-bold text-lg tracking-wide">
          RPG MAP BUILDER
        </div>

        <button className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 transition">
          File
        </button>

        <button className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 transition">
          Edit
        </button>

        <button className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 transition">
          World
        </button>

      </div>

      <HierarchyPanel />

      <div className="flex-1 relative">

        <Viewport />

        <div className="absolute top-20 right-6 w-56 h-56 rounded-2xl overflow-hidden border border-cyan-500/20 bg-black/50 backdrop-blur-lg z-20">

          <div className="text-xs p-2 border-b border-cyan-500/20 text-cyan-300">
            MINIMAP
          </div>

          <div className="w-full h-full bg-gradient-to-b from-green-900 to-blue-900 opacity-80" />

        </div>

      </div>

      <InspectorPanel />

      <AssetLibrary />

    </div>
  )
}
```jsx
import Viewport from './editor/viewport/Viewport'
import AssetLibrary from './editor/assets/AssetLibrary'
import InspectorPanel from './editor/inspector/InspectorPanel'
import HierarchyPanel from './editor/hierarchy/HierarchyPanel'

export default function App(){
  return (
    <div className="w-screen h-screen bg-[#08090d] text-white flex overflow-hidden">

      <HierarchyPanel />

      <div className="flex-1 relative">
        <Viewport />
      </div>

      <InspectorPanel />

      <AssetLibrary />

    </div>
  )
}
