import {
  useEffect,
  useRef,
} from "react";

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

  // =====================================
  // REFS
  // =====================================

  const canvasRef = useRef(null);

  const canvasSystemRef =
    useRef(null);

  const gridSystemRef =
    useRef(null);

  const imageCacheRef =
    useRef({});

  // =====================================
  // LIVE STATE REFS
  // =====================================

  const layersRef =
    useRef(layers);

  const activeLayerRef =
    useRef(activeLayerId);

  const selectedRef =
    useRef(selectedObjects);

  useEffect(() => {

    layersRef.current =
      layers;

  }, [layers]);

  useEffect(() => {

    activeLayerRef.current =
      activeLayerId;

  }, [activeLayerId]);

  useEffect(() => {

    selectedRef.current =
      selectedObjects;

  }, [selectedObjects]);

  // =====================================
  // DRAG STATE
  // =====================================

  const dragRef = useRef({

    dragging: false,

    objectId: null,

    startWorldX: 0,

    startWorldY: 0,
  });

  // =====================================
  // INIT SYSTEMS
  // =====================================

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    // =====================================
    // SYSTEMS
    // =====================================

    if (!canvasSystemRef.current) {

      canvasSystemRef.current =
        new CanvasSystem(canvas);
    }

    if (!gridSystemRef.current) {

      gridSystemRef.current =
        new GridSystem(50);
    }

    const canvasSystem =
      canvasSystemRef.current;

    const gridSystem =
      gridSystemRef.current;

    // =====================================
    // IMAGE CACHE
    // =====================================

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

    // =====================================
    // FIND OBJECT
    // =====================================

    const findObject = (
      worldX,
      worldY
    ) => {

      const currentLayers =
        layersRef.current;

      for (
        let l =
          currentLayers.length - 1;
        l >= 0;
        l--
      ) {

        const layer =
          currentLayers[l];

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

            return obj;
          }
        }
      }

      return null;
    };

    // =====================================
    // MOUSE DOWN
    // =====================================

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

      const object =
        findObject(
          world.x,
          world.y
        );

      // =====================================
      // EMPTY SPACE
      // =====================================

      if (!object) {

        setSelectedObjects([]);

        dragRef.current.dragging =
          false;

        canvasSystem.requestRedraw();

        return;
      }

      // =====================================
      // SELECT
      // =====================================

      if (e.shiftKey) {

        setSelectedObjects(
          (prev) => {

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
        );

      } else {

        setSelectedObjects([
          object.id,
        ]);
      }

      // =====================================
      // START DRAG
      // =====================================

      dragRef.current = {

        dragging: true,

        objectId: object.id,

        startWorldX:
          world.x,

        startWorldY:
          world.y,
      };
    };

    // =====================================
    // MOUSE MOVE
    // =====================================

    const handleMouseMove = (
      e
    ) => {

      if (
        !dragRef.current.dragging
      ) {
        return;
      }

      const world =
        canvasSystem.screenToWorld(
          e.clientX,
          e.clientY
        );

      const dx =
        world.x -
        dragRef.current
          .startWorldX;

      const dy =
        world.y -
        dragRef.current
          .startWorldY;

      // =====================================
      // IGNORE MICRO MOVEMENT
      // =====================================

      if (

        Math.abs(dx) < 0.01 &&

        Math.abs(dy) < 0.01
      ) {

        return;
      }

      moveSelected(dx, dy);

      dragRef.current.startWorldX =
        world.x;

      dragRef.current.startWorldY =
        world.y;

      canvasSystem.requestRedraw();
    };

    // =====================================
    // MOUSE UP
    // =====================================

    const handleMouseUp = () => {

      dragRef.current.dragging =
        false;
    };

    // =====================================
    // KEYBOARD
    // =====================================

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

    // =====================================
    // DRAG OVER
    // =====================================

    const handleDragOver = (
      e
    ) => {

      e.preventDefault();
    };

    // =====================================
    // DROP ASSET
    // =====================================

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

        activeLayerRef.current,

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

    // =====================================
    // RENDER
    // =====================================

    const renderScene = (ctx) => {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // =====================================
      // BACKGROUND
      // =====================================

      ctx.fillStyle =
        "#233142";

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      // =====================================
      // GRID
      // =====================================

      gridSystem.draw(

        ctx,

        canvas.width,

        canvas.height,

        canvasSystem.camera
      );

      const currentLayers =
        layersRef.current;

      const selected =
        selectedRef.current;

      // =====================================
      // DRAW OBJECTS
      // =====================================

      currentLayers.forEach(
        (layer) => {

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

              const width =
                obj.width *
                canvasSystem
                  .camera.zoom;

              const height =
                obj.height *
                canvasSystem
                  .camera.zoom;

              // =====================================
              // WAIT IMAGE LOAD
              // =====================================

              if (!img.complete)
                return;

              ctx.save();

              ctx.translate(

                screen.x +
                  width / 2,

                screen.y +
                  height / 2
              );

              ctx.rotate(
                obj.rotation || 0
              );

              ctx.drawImage(

                img,

                -width / 2,

                -height / 2,

                width,

                height
              );

              // =====================================
              // SELECTION
              // =====================================

              if (
                selected.includes(
                  obj.id
                )
              ) {

                ctx.strokeStyle =
                  "#00ff88";

                ctx.lineWidth = 2;

                ctx.strokeRect(

                  -width / 2,

                  -height / 2,

                  width,

                  height
                );
              }

              ctx.restore();
            }
          );
        }
      );
    };

    // =====================================
    // START LOOP
    // =====================================

    canvasSystem.startRenderLoop(
      renderScene
    );

    // =====================================
    // EVENTS
    // =====================================

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
      handleDragOver
    );

    canvas.addEventListener(
      "drop",
      handleDrop
    );

    // =====================================
    // CLEANUP
    // =====================================

    return () => {

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
        "dragover",
        handleDragOver
      );

      canvas.removeEventListener(
        "drop",
        handleDrop
      );
    };

  }, []);

  // =====================================
  // REDRAW ON CHANGE
  // =====================================

  useEffect(() => {

    if (
      canvasSystemRef.current
    ) {

      canvasSystemRef.current
        .requestRedraw();
    }

  }, [
    layers,
    selectedObjects,
  ]);

  // =====================================
  // JSX
  // =====================================

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
