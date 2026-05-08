import { useState } from "react";

export function useLayers() {
  const [layers, setLayers] = useState([]);

  const addLayer = (name) => {
    setLayers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
      },
    ]);
  };

  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  };

  return {
    layers,
    addLayer,
    removeLayer,
  };
}
