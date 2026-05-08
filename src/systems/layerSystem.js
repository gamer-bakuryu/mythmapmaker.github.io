export class LayerSystem {
  constructor() {
    this.layers = [];
    this.activeLayer = null;
  }

  createLayer(name = "Nova Layer") {
    const layer = {
      id: crypto.randomUUID(),
      name,
      visible: true,
      locked: false,
      objects: [],
    };

    this.layers.push(layer);

    if (!this.activeLayer) {
      this.activeLayer = layer.id;
    }

    return layer;
  }

  deleteLayer(id) {
    this.layers = this.layers.filter((layer) => layer.id !== id);
  }

  getLayer(id) {
    return this.layers.find((layer) => layer.id === id);
  }

  setActiveLayer(id) {
    this.activeLayer = id;
  }
}
