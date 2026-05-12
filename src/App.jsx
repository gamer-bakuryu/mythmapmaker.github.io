import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import CanvasArea from "./components/CanvasArea";
import LayersPanel from "./components/LayersPanel";
import StatusBar from "./components/StatusBar";

import { useLayers } from "./hooks/useLayers";

function App() {

  const layerSystem =
    useLayers();

  return (
    <div className="app-container">

      <Toolbar />

      <div className="editor-layout">

        <Sidebar />

        <CanvasArea
          layers={layerSystem.layers}
          activeLayerId={
            layerSystem.activeLayerId
          }
          addObjectToLayer={
            layerSystem.addObjectToLayer
          }
          selectedObjects={
            layerSystem.selectedObjects
          }
          setSelectedObjects={
            layerSystem.setSelectedObjects
          }
        />

        <LayersPanel
          {...layerSystem}
        />

      </div>

      <StatusBar />

    </div>
  );
}

export default App;
