import { useLayers } from "../hooks/useLayers";

function LayersPanel() {

  const {
    layers,
    activeLayerId,
    setActiveLayerId,
    addLayer,
    removeLayer,
    renameLayer,
    toggleVisibility,
    toggleLock,
    moveLayer,
  } = useLayers();

  return (
    <aside className="layers-panel">

      <div className="layers-header">

        <h2>Layers</h2>

        <button
          className="layer-add-btn"
          onClick={addLayer}
        >
          +
        </button>

      </div>

      <div className="layers-list">

        {layers.map((layer, index) => (

          <div
            key={layer.id}
            className={
              activeLayerId === layer.id
                ? "layer-item active"
                : "layer-item"
            }
            onClick={() =>
              setActiveLayerId(layer.id)
            }
          >

            {/* NOME */}

            <input
              value={layer.name}
              onChange={(e) =>
                renameLayer(
                  layer.id,
                  e.target.value
                )
              }
            />

            {/* CONTROLES */}

            <div className="layer-controls">

              {/* VISIBILITY */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  toggleVisibility(
                    layer.id
                  );
                }}
              >
                {layer.visible
                  ? "👁"
                  : "🚫"}
              </button>

              {/* LOCK */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  toggleLock(layer.id);
                }}
              >
                {layer.locked
                  ? "🔒"
                  : "🔓"}
              </button>

              {/* MOVE UP */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  moveLayer(index, -1);
                }}
              >
                ↑
              </button>

              {/* MOVE DOWN */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  moveLayer(index, 1);
                }}
              >
                ↓
              </button>

              {/* DELETE */}

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  removeLayer(layer.id);
                }}
              >
                🗑
              </button>

            </div>

          </div>
        ))}

      </div>

    </aside>
  );
}

export default LayersPanel;
