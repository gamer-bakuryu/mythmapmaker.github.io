import { useState } from "react";

import { ObjectSystem } from "../systems/objectSystem";

export function useLayers() {

  // =========================
  // LAYERS
  // =========================

  const [layers, setLayers] =
    useState([
      {
        id:
          crypto.randomUUID(),

        name: "Layer 1",

        visible: true,

        locked: false,

        objects: [],
      },
    ]);

  // =========================
  // ACTIVE
  // =========================

  const [
    activeLayerId,

    setActiveLayerId,
  ] = useState(layers[0].id);

  // =========================
  // SELECTION
  // =========================

  const [
    selectedObjects,

    setSelectedObjects,
  ] = useState([]);

  // =========================
  // ADD LAYER
  // =========================

  const addLayer = () => {

    const newLayer = {

      id:
        crypto.randomUUID(),

      name:
        `Layer ${
          layers.length + 1
        }`,

      visible: true,

      locked: false,

      objects: [],
    };

    setLayers([
      ...layers,
      newLayer,
    ]);

    setActiveLayerId(
      newLayer.id
    );
  };

  // =========================
  // REMOVE
  // =========================

  const removeLayer = (
    layerId
  ) => {

    if (layers.length <= 1)
      return;

    const filtered =
      layers.filter(
        (l) => l.id !== layerId
      );

    setLayers(filtered);

    if (
      activeLayerId === layerId
    ) {

      setActiveLayerId(
        filtered[0].id
      );
    }
  };

  // =========================
  // RENAME
  // =========================

  const renameLayer = (
    layerId,
    name
  ) => {

    setLayers(
      layers.map((layer) => {

        if (
          layer.id === layerId
        ) {

          return {
            ...layer,
            name,
          };
        }

        return layer;
      })
    );
  };

  // =========================
  // VISIBILITY
  // =========================

  const toggleVisibility = (
    layerId
  ) => {

    setLayers(
      layers.map((layer) => {

        if (
          layer.id === layerId
        ) {

          return {

            ...layer,

            visible:
              !layer.visible,
          };
        }

        return layer;
      })
    );
  };

  // =========================
  // LOCK
  // =========================

  const toggleLock = (
    layerId
  ) => {

    setLayers(
      layers.map((layer) => {

        if (
          layer.id === layerId
        ) {

          return {

            ...layer,

            locked:
              !layer.locked,
          };
        }

        return layer;
      })
    );
  };

  // =========================
  // ADD OBJECT
  // =========================

  const addObjectToLayer = (
    layerId,
    object
  ) => {

    setLayers(
      layers.map((layer) => {

        if (
          layer.id === layerId
        ) {

          return {

            ...layer,

            objects: [
              ...layer.objects,
              object,
            ],
          };
        }

        return layer;
      })
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

    setLayers(
      layers.map((layer) => {

        if (
          layer.id === layerId
        ) {

          return {

            ...layer,

            objects:
              layer.objects.map(
                (obj) => {

                  if (
                    obj.id ===
                    objectId
                  ) {

                    return {
                      ...obj,
                      ...updates,
                    };
                  }

                  return obj;
                }
              ),
          };
        }

        return layer;
      })
    );
  };

  // =========================
  // DELETE
  // =========================

  const deleteSelected =
    () => {

      setLayers(

        ObjectSystem.deleteSelected(
          layers,
          selectedObjects
        )
      );

      setSelectedObjects([]);
    };

  // =========================
  // DUPLICATE
  // =========================

  const duplicateSelected =
    () => {

      setLayers(

        ObjectSystem.duplicateSelected(
          layers,
          selectedObjects
        )
      );
    };

  // =========================
  // MOVE MULTI
  // =========================

  const moveSelected = (
    dx,
    dy
  ) => {

    setLayers(

      ObjectSystem.moveSelected(
        layers,
        selectedObjects,
        dx,
        dy
      )
    );
  };

  return {

    layers,

    setLayers,

    activeLayerId,

    setActiveLayerId,

    addLayer,

    removeLayer,

    renameLayer,

    toggleVisibility,

    toggleLock,

    addObjectToLayer,

    updateObject,

    selectedObjects,

    setSelectedObjects,

    deleteSelected,

    duplicateSelected,

    moveSelected,
  };
}
