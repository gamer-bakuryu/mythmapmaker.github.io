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
    // LOOP
    // =========================

    this.animationFrame = null;

    this.needsRedraw = true;

    this.renderCallback = null;

    // =========================
    // PAN
    // =========================

    this.isPanning = false;

    this.lastMouseX = 0;

    this.lastMouseY = 0;

    // =========================
    // INIT
    // =========================

    this.resize();

    this.setupEvents();
  }

  // =========================
  // RESIZE
  // =========================

  resize() {

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
      () => this.resize()
    );

    // =========================
    // ZOOM
    // =========================

    this.canvas.addEventListener(
      "wheel",

      (e) => {

        e.preventDefault();

        const zoomSpeed =
          0.1;

        const oldZoom =
          this.camera.zoom;

        // =========================
        // CURSOR POSITION
        // =========================

        const rect =
          this.canvas.getBoundingClientRect();

        const mouseX =
          e.clientX - rect.left;

        const mouseY =
          e.clientY - rect.top;

        const worldPosBefore =
          this.screenToWorld(
            e.clientX,
            e.clientY
          );

        // =========================
        // APPLY ZOOM
        // =========================

        if (e.deltaY < 0) {

          this.camera.zoom *=
            1 + zoomSpeed;

        } else {

          this.camera.zoom *=
            1 - zoomSpeed;
        }

        // =========================
        // CLAMP
        // =========================

        this.camera.zoom =
          Math.max(
            0.2,
            Math.min(
              4,
              this.camera.zoom
            )
          );

        // =========================
        // KEEP CURSOR FIXED
        // =========================

        const worldPosAfter =
          this.screenToWorld(
            e.clientX,
            e.clientY
          );

        this.camera.x +=
          worldPosBefore.x -
          worldPosAfter.x;

        this.camera.y +=
          worldPosBefore.y -
          worldPosAfter.y;

        this.requestRedraw();
      },

      { passive: false }
    );

    // =========================
    // PAN START
    // =========================

    this.canvas.addEventListener(
      "mousedown",

      (e) => {

        if (e.button !== 1)
          return;

        this.isPanning = true;

        this.lastMouseX =
          e.clientX;

        this.lastMouseY =
          e.clientY;
      }
    );

    // =========================
    // PAN MOVE
    // =========================

    window.addEventListener(
      "mousemove",

      (e) => {

        if (!this.isPanning)
          return;

        const dx =
          e.clientX -
          this.lastMouseX;

        const dy =
          e.clientY -
          this.lastMouseY;

        this.camera.x -=
          dx / this.camera.zoom;

        this.camera.y -=
          dy / this.camera.zoom;

        this.lastMouseX =
          e.clientX;

        this.lastMouseY =
          e.clientY;

        this.requestRedraw();
      }
    );

    // =========================
    // PAN END
    // =========================

    window.addEventListener(
      "mouseup",

      () => {

        this.isPanning = false;
      }
    );
  }

  // =========================
  // SCREEN TO WORLD
  // =========================

  screenToWorld(
    screenX,
    screenY
  ) {

    const rect =
      this.canvas.getBoundingClientRect();

    const localX =
      screenX - rect.left;

    const localY =
      screenY - rect.top;

    return {

      x:
        localX /
          this.camera.zoom +
        this.camera.x,

      y:
        localY /
          this.camera.zoom +
        this.camera.y,
    };
  }

  // =========================
  // WORLD TO SCREEN
  // =========================

  worldToScreen(
    worldX,
    worldY
  ) {

    return {

      x:
        (worldX -
          this.camera.x) *
        this.camera.zoom,

      y:
        (worldY -
          this.camera.y) *
        this.camera.zoom,
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

  startRenderLoop(
    renderCallback
  ) {

    this.renderCallback =
      renderCallback;

    const loop = () => {

      if (
        this.needsRedraw
      ) {

        this.render();
      }

      this.animationFrame =
        requestAnimationFrame(
          loop
        );
    };

    loop();
  }

  // =========================
  // RENDER
  // =========================

  render() {

    if (
      !this.renderCallback
    ) {
      return;
    }

    this.renderCallback(
      this.ctx
    );

    this.needsRedraw = false;
  }

  // =========================
  // STOP
  // =========================

  stopRenderLoop() {

    if (
      this.animationFrame
    ) {

      cancelAnimationFrame(
        this.animationFrame
      );
    }
  }
}
