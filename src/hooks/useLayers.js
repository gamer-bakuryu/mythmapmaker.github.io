import { useState } from "react";

export function useLayers() {

  const [layers, setLayers] = useState([
    {
      id: crypto.randomUUID(),

      name: "Base Layer",

      visible: true,

      locked: false,

      objects: [],
    },
  ]);

  const [activeLayerId, setActiveLayerId] =
    useState(layers[0].id);

  // =========================
  // ADD LAYER
  // =========================

  const addLayer = () => {

    const newLayer = {
      id: crypto.randomUUID(),

      name: `Layer ${layers.length + 1}`,

      visible: true,

      locked: false,

      objects: [],
    };

    setLayers((prev) => [
      newLayer,
      ...prev,
    ]);

    setActiveLayerId(newLayer.id);
  };

  // =========================
  // REMOVE LAYER
  // =========================

  const removeLayer = (id) => {

    if (layers.length <= 1) return;

    const updated =
      layers.filter(
        (layer) => layer.id !== id
      );

    setLayers(updated);

    if (activeLayerId === id) {

      setActiveLayerId(updated[0].id);
    }
  };

  // =========================
  // RENAME LAYER
  // =========================

  const renameLayer = (id, newName) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              name: newName,
            }
          : layer
      )
    );
  };

  // =========================
  // TOGGLE VISIBILITY
  // =========================

  const toggleVisibility = (id) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              visible:
                !layer.visible,
            }
          : layer
      )
    );
  };

  // =========================
  // TOGGLE LOCK
  // =========================

  const toggleLock = (id) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              locked:
                !layer.locked,
            }
          : layer
      )
    );
  };

  // =========================
  // MOVE LAYER
  // =========================

  const moveLayer = (
    index,
    direction
  ) => {

    const updated = [...layers];

    const target =
      index + direction;

    if (
      target < 0 ||
      target >= layers.length
    ) {
      return;
    }

    [
      updated[index],
      updated[target],
    ] = [
      updated[target],
      updated[index],
    ];

    setLayers(updated);
  };

  return {

    layers,

    activeLayerId,

    setActiveLayerId,

    addLayer,

    removeLayer,

    renameLayer,

    toggleVisibility,

    toggleLock,

    moveLayer,
  };
}
