import { useEffect, useRef } from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

function CanvasArea() {

  // =========================
  // REFS
  // =========================

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

    // =========================
    // SISTEMAS
    // =========================

    const canvasSystem =
      new CanvasSystem(canvas);

    const gridSystem =
      new GridSystem(50);

    canvasSystemRef.current =
      canvasSystem;

    gridSystemRef.current =
      gridSystem;

    // =========================
    // MOUSE MOVE
    // =========================

    const handleMouseMove = (e) => {

      mouseRef.current.x =
        e.clientX;

      mouseRef.current.y =
        e.clientY;

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      mouseRef.current.worldX =
        world.x;

      mouseRef.current.worldY =
        world.y;

      // =========================
      // PAN
      // =========================

      if (canvasSystem.isPanning) {

        canvasSystem.camera.x +=
          e.movementX;

        canvasSystem.camera.y +=
          e.movementY;
      }

      canvasSystem.requestRedraw();
    };

    // =========================
    // PAN START
    // =========================

    const handleMouseDown = (e) => {

      // Botão do meio OU direito

      if (
        e.button === 1 ||
        e.button === 2
      ) {
        canvasSystem.isPanning = true;
      }
    };

    // =========================
    // PAN END
    // =========================

    const handleMouseUp = () => {

      canvasSystem.isPanning = false;

      canvasSystem.requestRedraw();
    };

    // =========================
    // ZOOM
    // =========================

    const handleWheel = (e) => {

      e.preventDefault();

      canvasSystem.zoomAt(
        e.clientX,
        e.clientY,
        e.deltaY
      );

      canvasSystem.requestRedraw();
    };

    // =========================
    // RENDER SCENE
    // =========================

    const renderScene = (ctx) => {

      // =========================
      // FUNDO
      // =========================

      ctx.fillStyle = "#233142";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // =========================
      // GRID
      // =========================

      gridSystem.draw(
        ctx,
        canvas.width,
        canvas.height,
        canvasSystem.camera
      );

      // =========================
      // HUD
      // =========================

      ctx.fillStyle = "white";

      ctx.font =
        "14px Garamond";

      ctx.fillText(
        `Mouse: ${Math.floor(
          mouseRef.current.worldX
        )}, ${Math.floor(
          mouseRef.current.worldY
        )}`,
        20,
        30
      );

      ctx.fillText(
        `Zoom: ${canvasSystem.camera.zoom.toFixed(
          2
        )}`,
        20,
        50
      );

      ctx.fillText(
        `Camera: ${Math.floor(
          canvasSystem.camera.x
        )}, ${Math.floor(
          canvasSystem.camera.y
        )}`,
        20,
        70
      );
    };

    // =========================
    // START LOOP
    // =========================

    canvasSystem.startRenderLoop(
      renderScene
    );

    // =========================
    // EVENTS
    // =========================

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    canvas.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    // =========================
    // REMOVER MENU DIREITO
    // =========================

    canvas.addEventListener(
      "contextmenu",
      (e) => e.preventDefault()
    );

    // =========================
    // CLEANUP
    // =========================

    return () => {

      canvasSystem.stopRenderLoop();

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
