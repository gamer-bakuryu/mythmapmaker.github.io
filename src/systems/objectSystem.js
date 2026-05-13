export class ObjectSystem {

  static hitTest(obj, x, y) {
    return (
      x >= obj.x &&
      x <= obj.x + obj.width &&
      y >= obj.y &&
      y <= obj.y + obj.height
    );
  }

  static findTopObject(layers, x, y) {
    for (let l = layers.length - 1; l >= 0; l--) {
      const layer = layers[l];

      if (!layer.visible) continue;

      for (let i = layer.objects.length - 1; i >= 0; i--) {
        const obj = layer.objects[i];

        if (this.hitTest(obj, x, y)) {
          return { obj, layer };
        }
      }
    }
    return null;
  }

  static deleteObjects(layers, ids) {
    for (const layer of layers) {
      layer.objects = layer.objects.filter(o => !ids.includes(o.id));
    }
  }

  static duplicateObject(obj) {
    return {
      ...obj,
      id: crypto.randomUUID(),
      x: obj.x + 20,
      y: obj.y + 20
    };
  }
}
