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

  deleteSelected,

  duplicateSelected,

  moveSelected,
}) {

  const canvasRef = useRef(null);

  const dragRef = useRef({

    dragging: false,

    objectId: null,

    layerId: null,

    offsetX: 0,

    offsetY: 0,

    lastWorldX: 0,

    lastWorldY: 0,
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

      for (
        let l =
          layers.length - 1;
        l >= 0;
        l--
      ) {

        const layer =
          layers[l];

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
              obj.x +
                obj.width &&

            worldY >= obj.y &&

            worldY <=
              obj.y +
                obj.height
          ) {

            return {

              object: obj,

              layerId:
                layer.id,
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

      // =========================
      // EMPTY SPACE
      // =========================

      if (!found) {

        if (!e.shiftKey) {

          setSelectedObjects([]);
        }

        canvasSystem.requestRedraw();

        return;
      }

      const {
        object,
        layerId,
      } = found;

      // =========================
      // MULTI SELECT
      // =========================

      setSelectedObjects(
        (prev) => {

          if (e.shiftKey) {

            if (
              prev.includes(
                object.id
              )
            ) {

              return prev.filter(
                (id) =>
                  id !==
                  object.id
              );
            }

            return [
              ...prev,
              object.id,
            ];
          }

          return [object.id];
        }
      );

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

          objectId:
            object.id,

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

          objectId:
            object.id,

          layerId,
        };

        return;
      }

      // =========================
      // DRAG
      // =========================

      dragRef.current = {

        dragging: true,

        objectId:
          object.id,

        layerId,

        offsetX:
          world.x - object.x,

        offsetY:
          world.y - object.y,

        lastWorldX:
          world.x,

        lastWorldY:
          world.y,
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

        const dx =
          world.x -
          dragRef.current
            .lastWorldX;

        const dy =
          world.y -
          dragRef.current
            .lastWorldY;

        moveSelected(dx, dy);

        dragRef.current.lastWorldX =
          world.x;

        dragRef.current.lastWorldY =
          world.y;

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

        if (!layer) return;

        const object =
          layer.objects.find(
            (o) =>
              o.id ===
              resizeRef.current
                .objectId
          );

        if (!object) return;

        updateObject(

          resizeRef.current
            .layerId,

          resizeRef.current
            .objectId,

          {

            width:
              Math.max(
                20,
                world.x -
                  object.x
              ),

            height:
              Math.max(
                20,
                world.y -
                  object.y
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

        if (!layer) return;

        const object =
          layer.objects.find(
            (o) =>
              o.id ===
              rotationRef.current
                .objectId
          );

        if (!object) return;

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
    // KEYBOARD
    // =========================

    const handleKeyDown = (
      e
    ) => {

      // DELETE

      if (
        e.key === "Delete"
      ) {

        deleteSelected();

        canvasSystem.requestRedraw();
      }

      // DUPLICATE

      if (

        e.ctrlKey &&

        e.key.toLowerCase() ===
          "d"
      ) {

        e.preventDefault();

        duplicateSelected();

        canvasSystem.requestRedraw();
      }
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

          id:
            crypto.randomUUID(),

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

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.fillStyle =
        "#233142";

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
                  2 - 6,

                (obj.height *
                  canvasSystem
                    .camera.zoom) /
                  2 - 6,

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

    // =========================
    // START LOOP
    // =========================

    canvasSystem.startRenderLoop(
      renderScene
    );

    // =========================
    // EVENTS
    // =========================

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

    window.addEventListener(
      "keydown",
      handleKeyDown
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

    // =========================
    // CLEANUP
    // =========================

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

      window.removeEventListener(
        "keydown",
        handleKeyDown
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

    deleteSelected,

    duplicateSelected,

    moveSelected,
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
