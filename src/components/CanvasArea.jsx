import { useEffect, useRef } from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

function CanvasArea() {
  const canvasRef = useRef(null);

  const canvasSystemRef = useRef(null);
  const gridSystemRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    // Inicializa sistemas
    const canvasSystem = new CanvasSystem(canvas);
    const gridSystem = new GridSystem(50);

    canvasSystemRef.current = canvasSystem;
    gridSystemRef.current = gridSystem;

    // =========================
    // MOUSE MOVE
    // =========================
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const world = canvasSystem.screenToWorld(
        e.clientX,
        e.clientY
      );

      mouseRef.current.worldX = world.x;
      mouseRef.current.worldY = world.y;

      // PAN
      if (canvasSystem.isPanning) {
        canvasSystem.camera.x += e.movementX;
        canvasSystem.camera.y += e.movementY;
      }
    };

    // =========================
    // PAN START
    // =========================
    const handleMouseDown = (e) => {
      if (e.button === 1 || e.button === 2) {
        canvasSystem.isPanning = true;
      }
    };

    // =========================
    // PAN END
    // =========================
    const handleMouseUp = () => {
      canvasSystem.isPanning = false;
    };

    // =========================
    // ZOOM
    // =========================
    const handleWheel = (e) => {
      e.preventDefault();

      const zoomIntensity = 0.1;

      if (e.deltaY < 0) {
        canvasSystem.camera.zoom += zoomIntensity;
      } else {
        canvasSystem.camera.zoom -= zoomIntensity;
      }

      canvasSystem.camera.zoom = Math.max(
        0.2,
        Math.min(5, canvasSystem.camera.zoom)
      );
    };

    // =========================
    // RENDER LOOP
    // =========================
    const render = () => {
      const ctx = canvasSystem.ctx;

      canvasSystem.clear();

      // Fundo
      ctx.fillStyle = "#2c2c2c";
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Grid
      gridSystem.draw(
        ctx,
        canvas.width,
        canvas.height,
        canvasSystem.camera
      );

      // Coordenadas
      ctx.fillStyle = "white";
      ctx.font = "14px Arial";

      ctx.fillText(
        `Mouse: ${Math.floor(mouseRef.current.worldX)}, ${Math.floor(mouseRef.current.worldY)}`,
        20,
        30
      );

      ctx.fillText(
        `Zoom: ${canvasSystem.camera.zoom.toFixed(2)}`,
        20,
        50
      );

      requestAnimationFrame(render);
    };

    render();

    // =========================
    // EVENTS
    // =========================
    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mousedown", handleMouseDown);

    window.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    // REMOVE CONTEXT MENU
    canvas.addEventListener("contextmenu", (e) =>
      e.preventDefault()
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      canvas.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, []);

  return (
    <main className="canvas-area">
      <canvas
        ref={canvasRef}
        id="map-canvas"
      />
    </main>
  );
}

export default CanvasArea;
