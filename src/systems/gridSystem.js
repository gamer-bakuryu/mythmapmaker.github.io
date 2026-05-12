export class GridSystem {
  constructor(size = 50) {
    this.size = size;

    this.enabled = true;

    this.snapEnabled = true;

    this.type = "square";
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
    this.snapEnabled = !this.snapEnabled;
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

  draw(ctx, width, height, camera) {
    if (!this.enabled) return;

    const scaledSize =
      this.size * camera.zoom;

    // Evita grid minúsculo

    if (scaledSize < 8) return;

    ctx.save();

    ctx.strokeStyle =
      "rgba(255,255,255,0.12)";

    ctx.lineWidth = 1;

}
