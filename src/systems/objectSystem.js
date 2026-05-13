export class ObjectSystem {

  // =========================
  // SELECT
  // =========================

  static selectObject(
    selectedObjects,
    objectId,
    multiSelect = false
  ) {

    if (!multiSelect) {

      return [objectId];
    }

    if (
      selectedObjects.includes(
        objectId
      )
    ) {

      return selectedObjects.filter(
        (id) => id !== objectId
      );
    }

    return [
      ...selectedObjects,
      objectId,
    ];
  }

  // =========================
  // DELETE
  // =========================

  static deleteSelected(
    layers,
    selectedObjects
  ) {

    return layers.map((layer) => ({

      ...layer,

      objects:
        layer.objects.filter(
          (obj) =>
            !selectedObjects.includes(
              obj.id
            )
        ),
    }));
  }

  // =========================
  // DUPLICATE
  // =========================

  static duplicateSelected(
    layers,
    selectedObjects
  ) {

    return layers.map((layer) => {

      const duplicates = [];

      layer.objects.forEach(
        (obj) => {

          if (
            selectedObjects.includes(
              obj.id
            )
          ) {

            duplicates.push({

              ...obj,

              id:
                crypto.randomUUID(),

              x: obj.x + 40,

              y: obj.y + 40,
            });
          }
        }
      );

      return {

        ...layer,

        objects: [
          ...layer.objects,
          ...duplicates,
        ],
      };
    });
  }

  // =========================
  // MOVE MULTI
  // =========================

  static moveSelected(
    layers,
    selectedObjects,
    dx,
    dy
  ) {

    return layers.map((layer) => ({

      ...layer,

      objects:
        layer.objects.map((obj) => {

          if (
            selectedObjects.includes(
              obj.id
            )
          ) {

            return {

              ...obj,

              x: obj.x + dx,

              y: obj.y + dy,
            };
          }

          return obj;
        }),
    }));
  }
}
