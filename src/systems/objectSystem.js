export class ObjectSystem {
  constructor() {
    this.objects = [];
    this.selectedObject = null;
  }

  addObject(object) {
    this.objects.push({
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      ...object,
    });
  }

  removeObject(id) {
    this.objects = this.objects.filter((obj) => obj.id !== id);
  }

  selectObject(id) {
    this.selectedObject = id;
  }

  moveObject(id, x, y) {
    const obj = this.objects.find((o) => o.id === id);

    if (!obj) return;

    obj.x = x;
    obj.y = y;
  }
}
