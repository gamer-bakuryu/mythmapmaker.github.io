export class CanvasSystem {
  constructor(canvas) {
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
    };

    this.minZoom = 0.2;
    this.maxZoom = 5;

    this.isPanning = false;

    this.resize();

    window.addEventListener(
      "resize",
      () => this.resize()
    );
  }

  resize() {
    const rect =
      this.canvas.parentElement.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  screenToWorld(x, y) {
    return {
      x:
        (x - this.camera.x) /
        this.camera.zoom,

      y:
        (y - this.camera.y) /
        this.camera.zoom,
    };
  }

  worldToScreen(x, y) {
    return {
      x:
        x * this.camera.zoom +
        this.camera.x,

      y:
        y * this.camera.zoom +
        this.camera.y,
    };
  }

  zoomAt(mouseX, mouseY, delta) {
    const zoomFactor = 0.1;

    const oldZoom = this.camera.zoom;

    if (delta < 0) {
      this.camera.zoom += zoomFactor;
    } else {
      this.camera.zoom -= zoomFactor;
    }

    this.camera.zoom = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, this.camera.zoom)
    );

    const zoomRatio =
      this.camera.zoom / oldZoom;

    this.camera.x =
      mouseX -
      (mouseX - this.camera.x) *
        zoomRatio;

    this.camera.y =
      mouseY -
      (mouseY - this.camera.y) *
        zoomRatio;
  }
}
