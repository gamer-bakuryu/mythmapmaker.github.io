import "./styles/global.css";
import "./styles/layout.css";
import "./styles/sidebar.css";
import "./styles/canvas.css";

import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import CanvasArea from "./components/CanvasArea";
import LayersPanel from "./components/LayersPanel";
import StatusBar from "./components/StatusBar";

import { useLayers } from "./hooks/useLayers";
import { useAssets } from "./hooks/useAssets";

function App() {

  const layerSystem =
    useLayers();

  const assetSystem =
    useAssets();

  return (
    <div className="app-shell">

      <Toolbar />

      <div className="editor-shell">

        <Sidebar
          assets={assetSystem.assets}
          uploadAssets={
            assetSystem.uploadAssets
          }
        />

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

          updateObject={
            layerSystem.updateObject
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
