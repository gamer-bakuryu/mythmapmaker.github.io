import {
  useEffect,
  useRef,
} from "react";

import { CanvasSystem }
  from "../systems/canvasSystem";

import { GridSystem }
  from "../systems/gridSystem";

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

  // =========================
  // REFS
  // =========================

  const canvasRef =
    useRef(null);

  const canvasSystemRef =
    useRef(null);

  const gridSystemRef =
    useRef(null);

  const imageCacheRef =
    useRef({});

  // =========================
  // LIVE STATE
  // =========================

  const layersRef =
    useRef(layers);

  const selectedRef =
    useRef(selectedObjects);

  const activeLayerRef =
    useRef(activeLayerId);

  useEffect(() => {

    layersRef.current =
      layers;

  }, [layers]);

  useEffect(() => {

    selectedRef.current =
      selectedObjects;

  }, [selectedObjects]);

  useEffect(() => {

    activeLayerRef.current =
      activeLayerId;

  }, [activeLayerId]);

  // =========================
  // INTERACTION STATE
  // =========================

  const interactionRef =
    useRef({

      dragging: false,

      selectedId: null,

      dragOffsetX: 0,

      dragOffsetY: 0,
    });

  // =========================
  // INIT
  // =========================

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    // =========================
    // SYSTEMS
    // =========================

    if (
      !canvasSystemRef.current
    ) {

      canvasSystemRef.current =
        new CanvasSystem(canvas);
    }

    if (
      !gridSystemRef.current
    ) {

      gridSystemRef.current =
        new GridSystem(50);
    }

    const canvasSystem =
      canvasSystemRef.current;

    const gridSystem =
      gridSystemRef.current;

    // =========================
    // IMAGE CACHE
    // =========================

    const getImage = (src) => {

      if (!src) return null;

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

    const findObjectAt =
      (worldX, worldY) => {

        const layers =
          layersRef.current;

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
              layer.objects
                .length - 1;
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

    // =========================
    // MOUSE DOWN
    // =========================

    const handleMouseDown =
      (e) => {

        if (e.button !== 0)
          return;

        const world =
          canvasSystem.screenToWorld(
            e.clientX,
            e.clientY
          );

        const clickedObject =
          findObjectAt(
            world.x,
            world.y
          );

        // =========================
        // EMPTY SPACE
        // =========================

        if (!clickedObject) {

          setSelectedObjects([]);

          interactionRef.current
            .dragging = false;

          canvasSystem.requestRedraw();

          return;
        }

        // =========================
        // SELECT
        // =========================

        setSelectedObjects([
          clickedObject.id,
        ]);

        // =========================
        // DRAG START
        // =========================

        interactionRef.current = {

          dragging: true,

          selectedId:
            clickedObject.id,

          dragOffsetX:
            world.x -
            clickedObject.x,

          dragOffsetY:
            world.y -
            clickedObject.y,
        };

        canvasSystem.requestRedraw();
      };

    // =========================
    // MOUSE MOVE
    // =========================

    const handleMouseMove =
      (e) => {

        const interaction =
          interactionRef.current;

        if (
          !interaction.dragging
        ) {
          return;
        }

        const world =
          canvasSystem.screenToWorld(
            e.clientX,
            e.clientY
          );

        const layers =
          layersRef.current;

        for (
          const layer of layers
        ) {

          const obj =
            layer.objects.find(
              (o) =>
                o.id ===
                interaction
                  .selectedId
            );

          if (!obj) continue;

          // =========================
          // SAFE POSITION
          // =========================

          const newX =
            world.x -
            interaction
              .dragOffsetX;

          const newY =
            world.y -
            interaction
              .dragOffsetY;

          // =========================
          // UPDATE
          // =========================

          updateObject(

            layer.id,

            obj.id,

            {

              x: newX,

              y: newY,
            }
          );

          canvasSystem.requestRedraw();

          break;
        }
      };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp =
      () => {

        interactionRef.current
          .dragging = false;
      };

    // =========================
    // KEYBOARD
    // =========================

    const handleKeyDown =
      (e) => {

        // =========================
        // DELETE
        // =========================

        if (
          e.key === "Delete"
        ) {

          deleteSelected();

          canvasSystem.requestRedraw();
        }

        // =========================
        // DUPLICATE
        // =========================

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

    // =========================
    // RENDER
    // =========================

    const renderScene =
      (ctx) => {

        // =========================
        // CLEAR
        // =========================

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // =========================
        // BACKGROUND
        // =========================

        ctx.fillStyle =
          "#233142";

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
        // OBJECTS
        // =========================

        const layers =
          layersRef.current;

        const selected =
          selectedRef.current;

        for (
          const layer of layers
        ) {

          if (!layer.visible)
            continue;

          for (
            const obj of layer.objects
          ) {

            // =========================
            // IMAGE
            // =========================

            const img =
              getImage(obj.src);

            if (!img) continue;

            // =========================
            // SCREEN POS
            // =========================

            const screen =
              canvasSystem.worldToScreen(
                obj.x,
                obj.y
              );

            const width =
              obj.width *
              canvasSystem
                .camera.zoom;

            const height =
              obj.height *
              canvasSystem
                .camera.zoom;

            // =========================
            // DRAW
            // =========================

            try {

              ctx.drawImage(

                img,

                screen.x,

                screen.y,

                width,

                height
              );

            } catch {

              continue;
            }

            // =========================
            // SELECTION
            // =========================

            if (
              selected.includes(
                obj.id
              )
            ) {

              ctx.strokeStyle =
                "#00ff88";

              ctx.lineWidth = 2;

              ctx.strokeRect(

                screen.x,

                screen.y,

                width,

                height
              );
            }
          }
        }
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

  }, []);

  // =========================
  // REDRAW
  // =========================

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
