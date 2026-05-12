import { useEffect, useRef } from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

function CanvasArea({
  layers,
  activeLayerId,
  addObjectToLayer,
  selectedObjects,
  setSelectedObjects,
}) {

  const canvasRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
  });

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const canvasSystem =
      new CanvasSystem(canvas);

    const gridSystem =
      new GridSystem(50);

    // =========================
    // CLICK ADD OBJECT
    // =========================

    const handleDoubleClick = (e) => {

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      addObjectToLayer(
        activeLayerId,
        {
          id: crypto.randomUUID(),

          x: world.x,

          y: world.y,

          width: 50,

          height: 50,

          color: "#3a86ff",
        }
      );

      canvasSystem.requestRedraw();
    };

    // =========================
    // MULTI SELECT
    // =========================

    const handleClick = (e) => {

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      const clicked = [];

      layers.forEach((layer) => {

        if (
          !layer.visible ||
          layer.locked
        ) {
          return;
        }

        layer.objects.forEach((obj) => {

          if (
            world.x >= obj.x &&
            world.x <=
              obj.x + obj.width &&
            world.y >= obj.y &&
            world.y <=
              obj.y + obj.height
          ) {
            clicked.push(obj.id);
          }
        });
      });

      if (e.shiftKey) {

        setSelectedObjects((prev) => [
          ...new Set([
            ...prev,
            ...clicked,
          ]),
        ]);

      } else {

        setSelectedObjects(clicked);
      }

      canvasSystem.requestRedraw();
    };

    // =========================
    // RENDER
    // =========================

    const renderScene = (ctx) => {

      ctx.fillStyle = "#233142";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      gridSystem.draw(
        ctx,
        canvas.width,
        canvas.height,
        canvasSystem.camera
      );

      // =========================
      // DRAW OBJECTS
      // =========================

      layers.forEach((layer) => {

        if (!layer.visible) return;

        layer.objects.forEach((obj) => {

          const screen =
            canvasSystem.worldToScreen(
              obj.x,
              obj.y
            );

          ctx.fillStyle = obj.color;

          ctx.fillRect(
            screen.x,
            screen.y,
            obj.width *
              canvasSystem.camera.zoom,
            obj.height *
              canvasSystem.camera.zoom
          );

          // SELECTED

          if (
            selectedObjects.includes(
              obj.id
            )
          ) {

            ctx.strokeStyle =
              "#00ff88";

            ctx.lineWidth = 3;

            ctx.strokeRect(
              screen.x,
              screen.y,
              obj.width *
                canvasSystem.camera
                  .zoom,
              obj.height *
                canvasSystem.camera
                  .zoom
            );
          }
        });
      });
    };

    canvasSystem.startRenderLoop(
      renderScene
    );

    canvas.addEventListener(
      "dblclick",
      handleDoubleClick
    );

    canvas.addEventListener(
      "click",
      handleClick
    );

    return () => {

      canvasSystem.stopRenderLoop();

      canvas.removeEventListener(
        "dblclick",
        handleDoubleClick
      );

      canvas.removeEventListener(
        "click",
        handleClick
      );
    };

  }, [
    layers,
    activeLayerId,
    addObjectToLayer,
    selectedObjects,
    setSelectedObjects,
  ]);

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
