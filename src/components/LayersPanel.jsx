function LayersPanel({

  layers,

  activeLayerId,

  setActiveLayerId,

  addLayer,

  removeLayer,

  renameLayer,

  toggleVisibility,

  toggleLock,

  moveLayer,
}) {

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

            <input
              value={layer.name}
              onChange={(e) =>
                renameLayer(
                  layer.id,
                  e.target.value
                )
              }
            />

            <div className="layer-controls">

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

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  moveLayer(index, -1);
                }}
              >
                ↑
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  moveLayer(index, 1);
                }}
              >
                ↓
              </button>

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
