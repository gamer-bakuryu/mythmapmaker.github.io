import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import CanvasArea from "./components/CanvasArea";
import LayersPanel from "./components/LayersPanel";
import StatusBar from "./components/StatusBar";

function App() {
  return (
    <div className="app-container">

      <Toolbar />

      <div className="main-layout">

        <Sidebar />

        <CanvasArea />

        <LayersPanel />

      </div>

      <StatusBar />

    </div>
  );
}

export default App;
