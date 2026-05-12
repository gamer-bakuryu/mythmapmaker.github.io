import { useEffect, useRef } from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

function CanvasArea() {

  const canvasRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
    snappedX: 0,
    snappedY: 0,
  });

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    // =========================
    // SYSTEMS
    // =========================

    const canvasSystem =
      new CanvasSystem(canvas);

    const gridSystem =
      new GridSystem(50);

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
      // SNAP
      // =========================

      const snapped =
        gridSystem.snapPosition(
          world.x,
          world.y
        );

      mouseRef.current.snappedX =
        snapped.x;

      mouseRef.current.snappedY =
        snapped.y;

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
    // KEYBOARD
    // =========================

    const handleKeyDown = (e) => {

      // G = Toggle Grid

      if (e.key.toLowerCase() === "g") {

        gridSystem.toggleGrid();

        canvasSystem.requestRedraw();
      }

      // S = Toggle Snap

      if (e.key.toLowerCase() === "s") {

        gridSystem.toggleSnap();

        canvasSystem.requestRedraw();
      }
    };

    // =========================
    // RENDER
    // =========================

    const renderScene = (ctx) => {

      // =========================
      // BACKGROUND
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
      // SNAP PREVIEW
      // =========================

      const snappedScreen =
        canvasSystem.worldToScreen(
          mouseRef.current.snappedX,
          mouseRef.current.snappedY
        );

      ctx.fillStyle =
        "rgba(58,134,255,0.8)";

      ctx.beginPath();

      ctx.arc(
        snappedScreen.x,
        snappedScreen.y,
        5,
        0,
        Math.PI * 2
      );

      ctx.fill();

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
        `Snap: ${Math.floor(
          mouseRef.current.snappedX
        )}, ${Math.floor(
          mouseRef.current.snappedY
        )}`,
        20,
        50
      );

      ctx.fillText(
        `Zoom: ${canvasSystem.camera.zoom.toFixed(
          2
        )}`,
        20,
        70
      );

      ctx.fillText(
        `Grid: ${
          gridSystem.enabled
            ? "ON"
            : "OFF"
        }`,
        20,
        90
      );

      ctx.fillText(
        `Snap: ${
          gridSystem.snapEnabled
            ? "ON"
            : "OFF"
        }`,
        20,
        110
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

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    canvas.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

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

      window.removeEventListener(
        "keydown",
        handleKeyDown
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
