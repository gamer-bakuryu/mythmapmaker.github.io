export class CanvasSystem {

  constructor(canvas) {

    this.canvas = canvas;

    this.ctx =
      canvas.getContext("2d");

    // =========================
    // CAMERA
    // =========================

    this.camera = {

      x: 0,

      y: 0,

      zoom: 1,
    };

    // =========================
    // RENDER LOOP
    // =========================

    this.animationFrame = null;

    this.needsRedraw = true;

    // =========================
    // PAN
    // =========================

    this.isPanning = false;

    this.lastMouse = {
      x: 0,
      y: 0,
    };

    // =========================
    // INIT
    // =========================

    this.resizeCanvas();

    this.setupEvents();
  }

  // =========================
  // RESIZE
  // =========================

  resizeCanvas() {

    this.canvas.width =
      this.canvas.clientWidth;

    this.canvas.height =
      this.canvas.clientHeight;

    this.requestRedraw();
  }

  // =========================
  // EVENTS
  // =========================

  setupEvents() {

    window.addEventListener(
      "resize",
      () => this.resizeCanvas()
    );

    // =========================
    // ZOOM
    // =========================

    this.canvas.addEventListener(
      "wheel",
      (e) => {

        e.preventDefault();

        const zoomAmount =
          e.deltaY > 0
            ? 0.9
            : 1.1;

        this.camera.zoom *=
          zoomAmount;

        this.camera.zoom =
          Math.max(
            0.2,
            Math.min(
              this.camera.zoom,
              5
            )
          );

        this.requestRedraw();
      }
    );

    // =========================
    // PAN
    // =========================

    this.canvas.addEventListener(
      "mousedown",
      (e) => {

        if (e.button !== 1) return;

        this.isPanning = true;

        this.lastMouse = {

          x: e.clientX,

          y: e.clientY,
        };
      }
    );

    window.addEventListener(
      "mouseup",
      () => {

        this.isPanning = false;
      }
    );

    window.addEventListener(
      "mousemove",
      (e) => {

        if (!this.isPanning)
          return;

        const dx =
          e.clientX -
          this.lastMouse.x;

        const dy =
          e.clientY -
          this.lastMouse.y;

        this.camera.x -=
          dx / this.camera.zoom;

        this.camera.y -=
          dy / this.camera.zoom;

        this.lastMouse = {

          x: e.clientX,

          y: e.clientY,
        };

        this.requestRedraw();
      }
    );
  }

  // =========================
  // WORLD -> SCREEN
  // =========================

  worldToScreen(x, y) {

    return {

      x:
        (x - this.camera.x) *
        this.camera.zoom,

      y:
        (y - this.camera.y) *
        this.camera.zoom,
    };
  }

  // =========================
  // SCREEN -> WORLD
  // =========================

  screenToWorld(x, y) {

    const rect =
      this.canvas.getBoundingClientRect();

    return {

      x:
        (x - rect.left) /
          this.camera.zoom +
        this.camera.x,

      y:
        (y - rect.top) /
          this.camera.zoom +
        this.camera.y,
    };
  }

  // =========================
  // REDRAW
  // =========================

  requestRedraw() {

    this.needsRedraw = true;
  }

  // =========================
  // LOOP
  // =========================

  startRenderLoop(render) {

    const loop = () => {

      if (this.needsRedraw) {

        this.ctx.clearRect(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );

        render(this.ctx);

        this.needsRedraw = false;
      }

      this.animationFrame =
        requestAnimationFrame(loop);
    };

    loop();
  }

  stopRenderLoop() {

    cancelAnimationFrame(
      this.animationFrame
    );
  }
}
