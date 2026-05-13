export class GridSystem {

  constructor(size = 50) {

    this.size = size;

    this.enabled = true;

    this.snapEnabled = true;
  }

  // =========================
  // TOGGLE GRID
  // =========================

  toggleGrid() {

    this.enabled = !this.enabled;
  }

  // =========================
  // TOGGLE SNAP
  // =========================

  toggleSnap() {

    this.snapEnabled =
      !this.snapEnabled;
  }

  // =========================
  // SNAP POSITION
  // =========================

  snapPosition(x, y) {

    if (!this.snapEnabled) {

      return { x, y };
    }

    return {

      x:
        Math.round(x / this.size) *
        this.size,

      y:
        Math.round(y / this.size) *
        this.size,
    };
  }

  // =========================
  // DRAW GRID
  // =========================

  draw(
    ctx,
    canvasWidth,
    canvasHeight,
    camera
  ) {

    if (!this.enabled) return;

    const scaledGrid =
      this.size * camera.zoom;

    // Evita grid impossível de ver

    if (scaledGrid < 8) return;

    ctx.save();

    ctx.strokeStyle =
      "rgba(255,255,255,0.12)";

    ctx.lineWidth = 1;

    // Offset baseado na câmera

    const offsetX =
      camera.x % scaledGrid;

    const offsetY =
      camera.y % scaledGrid;

    // =========================
    // LINHAS VERTICAIS
    // =========================

    for (
      let x = offsetX;
      x < canvasWidth;
      x += scaledGrid
    ) {

      ctx.beginPath();

      ctx.moveTo(x, 0);

      ctx.lineTo(x, canvasHeight);

      ctx.stroke();
    }

    // =========================
    // LINHAS HORIZONTAIS
    // =========================

    for (
      let y = offsetY;
      y < canvasHeight;
      y += scaledGrid
    ) {

      ctx.beginPath();

      ctx.moveTo(0, y);

      ctx.lineTo(canvasWidth, y);

      ctx.stroke();
    }

    ctx.restore();
  }
}
