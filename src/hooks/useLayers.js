import { useEffect, useState } from "react";

const STORAGE_KEY = "mythmapmaker_layers";

export function useLayers() {

  const [layers, setLayers] = useState(() => {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: crypto.randomUUID(),

        name: "Base Layer",

        visible: true,

        locked: false,

        objects: [],
      },
    ];
  });

  const [activeLayerId, setActiveLayerId] =
    useState(layers[0]?.id);

  const [selectedObjects, setSelectedObjects] =
    useState([]);

  // =========================
  // SAVE
  // =========================

  useEffect(() => {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(layers)
    );

  }, [layers]);

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
  // REMOVE
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
  // RENAME
  // =========================

  const renameLayer = (
    id,
    newName
  ) => {

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
  // VISIBILITY
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
  // LOCK
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
  // MOVE
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

  // =========================
  // ADD OBJECT
  // =========================

  const addObjectToLayer = (
    layerId,
    object
  ) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              objects: [
                ...layer.objects,
                object,
              ],
            }
          : layer
      )
    );
  };

  // =========================
  // UPDATE OBJECT
  // =========================

  const updateObject = (
    layerId,
    objectId,
    updates
  ) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,

              objects:
                layer.objects.map(
                  (obj) =>
                    obj.id === objectId
                      ? {
                          ...obj,
                          ...updates,
                        }
                      : obj
                ),
            }
          : layer
      )
    );
  };

  // =========================
  // DELETE OBJECT
  // =========================

  const removeObject = (
    layerId,
    objectId
  ) => {

    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,

              objects:
                layer.objects.filter(
                  (obj) =>
                    obj.id !== objectId
                ),
            }
          : layer
      )
    );
  };

  return {

    layers,

    activeLayerId,

    setActiveLayerId,

    selectedObjects,

    setSelectedObjects,

    addLayer,

    removeLayer,

    renameLayer,

    toggleVisibility,

    toggleLock,

    moveLayer,

    addObjectToLayer,

    updateObject,

    removeObject,
  };
}
