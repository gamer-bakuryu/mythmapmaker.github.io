export class GridSystem {

  constructor(size = 50) {

    this.size = size;

    this.enabled = true;

    this.snap = true;
  }

  // =========================
  // TOGGLE GRID
  // =========================

  toggleGrid() {

    this.enabled =
      !this.enabled;
  }

  // =========================
  // TOGGLE SNAP
  // =========================

  toggleSnap() {

    this.snap =
      !this.snap;
  }

  // =========================
  // SNAP POSITION
  // =========================

  snapPosition(x, y) {

    if (!this.snap) {

      return { x, y };
    }

    return {

      x:
        Math.round(
          x / this.size
        ) * this.size,

      y:
        Math.round(
          y / this.size
        ) * this.size,
    };
  }

  // =========================
  // DRAW GRID
  // =========================

  draw(
    ctx,
    width,
    height,
    camera
  ) {

    if (!this.enabled)
      return;

    const gridSize =
      this.size *
      camera.zoom;

    ctx.save();

    ctx.strokeStyle =
      "rgba(255,255,255,0.08)";

    ctx.lineWidth = 1;

    // =========================
    // OFFSET
    // =========================

    const offsetX =
      (-camera.x *
        camera.zoom) %
      gridSize;

    const offsetY =
      (-camera.y *
        camera.zoom) %
      gridSize;

    // =========================
    // VERTICAL
    // =========================

    for (
      let x = offsetX;
      x < width;
      x += gridSize
    ) {

      ctx.beginPath();

      ctx.moveTo(x, 0);

      ctx.lineTo(x, height);

      ctx.stroke();
    }

    // =========================
    // HORIZONTAL
    // =========================

    for (
      let y = offsetY;
      y < height;
      y += gridSize
    ) {

      ctx.beginPath();

      ctx.moveTo(0, y);

      ctx.lineTo(width, y);

      ctx.stroke();
    }

    ctx.restore();
  }
}
