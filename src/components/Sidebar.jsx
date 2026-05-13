function Sidebar({

  assets,

  uploadAssets,
}) {

  // =========================
  // FILE UPLOAD
  // =========================

  const handleUpload = async (
    e
  ) => {

    const files =
      Array.from(e.target.files);

    await uploadAssets(files);
  };

  // =========================
  // DRAG ASSET
  // =========================

  const handleDragStart = (
    e,
    asset
  ) => {

    e.dataTransfer.setData(
      "application/json",
      JSON.stringify(asset)
    );
  };

  return (
    <aside className="sidebar">

      <h2>MythMapMaker</h2>

      {/* ========================= */}
      {/* UPLOAD */}
      {/* ========================= */}

      <div className="sidebar-section">

        <h3>Upload</h3>

        <label className="upload-button">

          Upload Sprite

          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp"
            onChange={handleUpload}
          />

        </label>

      </div>

      {/* ========================= */}
      {/* ASSET LIBRARY */}
      {/* ========================= */}

      <div className="sidebar-section">

        <h3>Assets</h3>

        <div className="asset-library">

          {assets.map((asset) => (

            <div
              key={asset.id}
              className="asset-item"
              draggable
              onDragStart={(e) =>
                handleDragStart(
                  e,
                  asset
                )
              }
            >

              <img
                src={asset.src}
                alt={asset.name}
              />

              <span>
                {asset.name}
              </span>

            </div>
          ))}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
