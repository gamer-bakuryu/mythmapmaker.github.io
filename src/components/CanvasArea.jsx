import { useEffect, useRef } from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

function CanvasArea({

  layers,

  activeLayerId,

  addObjectToLayer,

  selectedObjects,

  setSelectedObjects,

  updateObject,
}) {

  const canvasRef = useRef(null);

  const dragRef = useRef({

    dragging: false,

    objectId: null,

    layerId: null,

    offsetX: 0,

    offsetY: 0,
  });

  const resizeRef = useRef({

    resizing: false,

    objectId: null,

    layerId: null,
  });

  const rotationRef = useRef({

    rotating: false,

    objectId: null,

    layerId: null,
  });

  const imageCacheRef =
    useRef({});

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const canvasSystem =
      new CanvasSystem(canvas);

    const gridSystem =
      new GridSystem(50);

    // =========================
    // IMAGE CACHE
    // =========================

    const getImage = (src) => {

      if (
        imageCacheRef.current[src]
      ) {
        return imageCacheRef
          .current[src];
      }

      const img = new Image();

      img.src = src;

      imageCacheRef.current[src] =
        img;

      return img;
    };

    // =========================
    // FIND OBJECT
    // =========================

    const findObject = (
      worldX,
      worldY
    ) => {

      for (const layer of layers) {

        if (
          !layer.visible ||
          layer.locked
        ) {
          continue;
        }

        for (
          let i =
            layer.objects.length - 1;
          i >= 0;
          i--
        ) {

          const obj =
            layer.objects[i];

          if (
            worldX >= obj.x &&
            worldX <=
              obj.x + obj.width &&
            worldY >= obj.y &&
            worldY <=
              obj.y + obj.height
          ) {

            return {
              object: obj,
              layerId: layer.id,
            };
          }
        }
      }

      return null;
    };

    // =========================
    // MOUSE DOWN
    // =========================

    const handleMouseDown = (
      e
    ) => {

      if (e.button !== 0)
        return;

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      const found =
        findObject(
          world.x,
          world.y
        );

      if (!found) {

        setSelectedObjects([]);

        canvasSystem.requestRedraw();

        return;
      }

      const {
        object,
        layerId,
      } = found;

      setSelectedObjects([
        object.id,
      ]);

      // =========================
      // RESIZE HANDLE
      // =========================

      const handleSize = 12;

      const resizeX =
        object.x +
        object.width -
        handleSize;

      const resizeY =
        object.y +
        object.height -
        handleSize;

      if (
        world.x >= resizeX &&
        world.y >= resizeY
      ) {

        resizeRef.current = {

          resizing: true,

          objectId: object.id,

          layerId,
        };

        return;
      }

      // =========================
      // ROTATION HANDLE
      // =========================

      const rotX =
        object.x +
        object.width / 2;

      const rotY =
        object.y - 30;

      const dist =
        Math.hypot(
          world.x - rotX,
          world.y - rotY
        );

      if (dist <= 12) {

        rotationRef.current = {

          rotating: true,

          objectId: object.id,

          layerId,
        };

        return;
      }

      // =========================
      // DRAG
      // =========================

      dragRef.current = {

        dragging: true,

        objectId: object.id,

        layerId,

        offsetX:
          world.x - object.x,

        offsetY:
          world.y - object.y,
      };

      canvasSystem.requestRedraw();
    };

    // =========================
    // MOUSE MOVE
    // =========================

    const handleMouseMove = (
      e
    ) => {

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      // =========================
      // DRAGGING
      // =========================

      if (
        dragRef.current.dragging
      ) {

        updateObject(
          dragRef.current.layerId,

          dragRef.current.objectId,

          {

            x:
              world.x -
              dragRef.current
                .offsetX,

            y:
              world.y -
              dragRef.current
                .offsetY,
          }
        );

        canvasSystem.requestRedraw();
      }

      // =========================
      // RESIZE
      // =========================

      if (
        resizeRef.current
          .resizing
      ) {

        const layer =
          layers.find(
            (l) =>
              l.id ===
              resizeRef.current
                .layerId
          );

        const object =
          layer.objects.find(
            (o) =>
              o.id ===
              resizeRef.current
                .objectId
          );

        updateObject(
          resizeRef.current
            .layerId,

          resizeRef.current
            .objectId,

          {

            width:
              Math.max(
                20,
                world.x - object.x
              ),

            height:
              Math.max(
                20,
                world.y - object.y
              ),
          }
        );

        canvasSystem.requestRedraw();
      }

      // =========================
      // ROTATE
      // =========================

      if (
        rotationRef.current
          .rotating
      ) {

        const layer =
          layers.find(
            (l) =>
              l.id ===
              rotationRef.current
                .layerId
          );

        const object =
          layer.objects.find(
            (o) =>
              o.id ===
              rotationRef.current
                .objectId
          );

        const centerX =
          object.x +
          object.width / 2;

        const centerY =
          object.y +
          object.height / 2;

        const angle =
          Math.atan2(
            world.y - centerY,
            world.x - centerX
          );

        updateObject(
          rotationRef.current
            .layerId,

          rotationRef.current
            .objectId,

          {
            rotation: angle,
          }
        );

        canvasSystem.requestRedraw();
      }
    };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp = () => {

      dragRef.current.dragging =
        false;

      resizeRef.current.resizing =
        false;

      rotationRef.current.rotating =
        false;
    };

    // =========================
    // DROP
    // =========================

    const handleDrop = (e) => {

      e.preventDefault();

      const raw =
        e.dataTransfer.getData(
          "application/json"
        );

      if (!raw) return;

      const asset =
        JSON.parse(raw);

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      addObjectToLayer(
        activeLayerId,
        {

          id: crypto.randomUUID(),

          type: "sprite",

          x: world.x,

          y: world.y,

          width: 120,

          height: 120,

          rotation: 0,

          src: asset.src,
        }
      );

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
      // OBJECTS
      // =========================

      layers.forEach((layer) => {

        if (!layer.visible)
          return;

        layer.objects.forEach(
          (obj) => {

            const screen =
              canvasSystem.worldToScreen(
                obj.x,
                obj.y
              );

            const img =
              getImage(obj.src);

            ctx.save();

            ctx.translate(
              screen.x +
                (obj.width *
                  canvasSystem
                    .camera.zoom) /
                  2,

              screen.y +
                (obj.height *
                  canvasSystem
                    .camera.zoom) /
                  2
            );

            ctx.rotate(
              obj.rotation || 0
            );

            ctx.drawImage(
              img,

              -(
                obj.width *
                canvasSystem
                  .camera.zoom
              ) / 2,

              -(
                obj.height *
                canvasSystem
                  .camera.zoom
              ) / 2,

              obj.width *
                canvasSystem
                  .camera.zoom,

              obj.height *
                canvasSystem
                  .camera.zoom
            );

            // =========================
            // GIZMOS
            // =========================

            if (
              selectedObjects.includes(
                obj.id
              )
            ) {

              ctx.strokeStyle =
                "#00ff88";

              ctx.lineWidth = 2;

              ctx.strokeRect(
                -(
                  obj.width *
                  canvasSystem
                    .camera.zoom
                ) / 2,

                -(
                  obj.height *
                  canvasSystem
                    .camera.zoom
                ) / 2,

                obj.width *
                  canvasSystem
                    .camera.zoom,

                obj.height *
                  canvasSystem
                    .camera.zoom
              );

              // RESIZE HANDLE

              ctx.fillStyle =
                "#00ff88";

              ctx.fillRect(

                (obj.width *
                  canvasSystem
                    .camera.zoom) /
                  2 -
                  6,

                (obj.height *
                  canvasSystem
                    .camera.zoom) /
                  2 -
                  6,

                12,

                12
              );

              // ROTATION HANDLE

              ctx.beginPath();

              ctx.arc(
                0,

                -(
                  obj.height *
                  canvasSystem
                    .camera.zoom
                ) / 2 - 25,

                8,

                0,

                Math.PI * 2
              );

              ctx.fill();
            }

            ctx.restore();
          }
        );
      });
    };

    canvasSystem.startRenderLoop(
      renderScene
    );

    canvas.addEventListener(
      "mousedown",
      handleMouseDown
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseup",
      handleMouseUp
    );

    canvas.addEventListener(
      "dragover",
      (e) =>
        e.preventDefault()
    );

    canvas.addEventListener(
      "drop",
      handleDrop
    );

    return () => {

      canvasSystem.stopRenderLoop();

      canvas.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseup",
        handleMouseUp
      );

      canvas.removeEventListener(
        "drop",
        handleDrop
      );
    };

  }, [
    layers,
    activeLayerId,
    addObjectToLayer,
    selectedObjects,
    setSelectedObjects,
    updateObject,
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
