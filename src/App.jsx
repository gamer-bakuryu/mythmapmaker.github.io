import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import CanvasArea from "./components/CanvasArea";
import LayersPanel from "./components/LayersPanel";
import StatusBar from "./components/StatusBar";

function App() {
  return (
    <div className="app-container">

      {/* TOPO */}
      <Toolbar />

      {/* CONTEÚDO PRINCIPAL */}
      <div className="editor-layout">

        {/* MENU ESQUERDO */}
        <Sidebar />

        {/* ÁREA CENTRAL */}
        <CanvasArea />

        {/* PAINEL DIREITO */}
        <LayersPanel />

      </div>

      {/* BARRA INFERIOR */}
      <StatusBar />

    </div>
  );
}

export default App;
