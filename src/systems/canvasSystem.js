export class CanvasSystem {
  constructor(canvas) {
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");

    // =========================
    // CÂMERA
    // =========================

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
    };

    // =========================
    // LIMITES DE ZOOM
    // =========================

    this.minZoom = 0.2;

    this.maxZoom = 5;

    // =========================
    // CONTROLES
    // =========================

    this.isPanning = false;

    // =========================
    // REDRAW
    // =========================

    this.needsRedraw = true;

    this.animationFrame = null;

    // =========================
    // RESIZE
    // =========================

    this.resize();

    window.addEventListener(
      "resize",
      () => {
        this.resize();

        this.requestRedraw();
      }
    );
  }

  // =========================
  // RESIZE
  // =========================

  resize() {
    const rect =
      this.canvas.parentElement.getBoundingClientRect();

    this.canvas.width = rect.width;

    this.canvas.height = rect.height;
  }

  // =========================
  // LIMPAR CANVAS
  // =========================

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  // =========================
  // CONVERSÃO SCREEN → WORLD
  // =========================

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

  // =========================
  // CONVERSÃO WORLD → SCREEN
  // =========================

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

  // =========================
  // ZOOM NO CURSOR
  // =========================

  zoomAt(mouseX, mouseY, delta) {
    const zoomFactor = 0.1;

    const oldZoom = this.camera.zoom;

    if (delta < 0) {
      this.camera.zoom += zoomFactor;
    } else {
      this.camera.zoom -= zoomFactor;
    }

    // Clamp zoom

    this.camera.zoom = Math.max(
      this.minZoom,
      Math.min(
        this.maxZoom,
        this.camera.zoom
      )
    );

    // Ajustar câmera para zoom no cursor

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

  // =========================
  // REDRAW
  // =========================

  requestRedraw() {
    this.needsRedraw = true;
  }

  // =========================
  // RENDER LOOP
  // =========================

  startRenderLoop(renderCallback) {

    const renderLoop = () => {

      if (this.needsRedraw) {

        this.clear();

        renderCallback(this.ctx);

        this.needsRedraw = false;
      }

      this.animationFrame =
        requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }

  // =========================
  // STOP LOOP
  // =========================

  stopRenderLoop() {

    if (this.animationFrame) {

      cancelAnimationFrame(
        this.animationFrame
      );
    }
  }
}
