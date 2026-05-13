export class TransformSystem {

  static getHandles(obj, screen, zoom) {

    const w = obj.width * zoom;
    const h = obj.height * zoom;

    const x = screen.x;
    const y = screen.y;

    return {
      nw: { x, y },
      ne: { x: x + w, y },
      sw: { x, y: y + h },
      se: { x: x + w, y: y + h },

      n: { x: x + w / 2, y },
      s: { x: x + w / 2, y: y + h },
      w: { x, y: y + h / 2 },
      e: { x: x + w, y: y + h / 2 },

      rotate: { x: x + w / 2, y: y - 30 },
    };
  }

  static hit(px, py, hx, hy, size = 8) {
    return (
      px >= hx - size &&
      px <= hx + size &&
      py >= hy - size &&
      py <= hy + size
    );
  }

  static detectHandle(handles, x, y) {

    for (const key in handles) {
      if (this.hit(x, y, handles[key].x, handles[key].y)) {
        return key;
      }
    }

    return null;
  }
}
