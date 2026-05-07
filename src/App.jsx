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
