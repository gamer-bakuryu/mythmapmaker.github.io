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

  const canvasRef =
    useRef(null);

  const canvasSystemRef =
    useRef(null);

  const gridSystemRef =
    useRef(null);

  const imageCacheRef =
    useRef({});

  // =========================
  // DRAG STATE
  // =========================

  const dragRef = useRef({

    dragging: false,

    lastWorldX: 0,

    lastWorldY: 0,
  });

  // =========================
  // INIT ONLY ONCE
  // =========================

  useEffect(() => {

    const canvas =
      canvasRef.current;

    if (!canvas) return;

    // =========================
    // CREATE SYSTEMS
    // =========================

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

            return obj;
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

      const object =
        findObject(
          world.x,
          world.y
        );

      if (!object) {

        setSelectedObjects([]);

        canvasSystem.requestRedraw();

        return;
      }

      setSelectedObjects([
        object.id,
      ]);

      dragRef.current = {

        dragging: true,

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
    };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp = () => {

      dragRef.current.dragging =
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

            ctx.drawImage(

              img,

              screen.x,

              screen.y,

              obj.width *
                canvasSystem
                  .camera.zoom,

              obj.height *
                canvasSystem
                  .camera.zoom
            );

            // =========================
            // SELECTION
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

                screen.x,

                screen.y,

                obj.width *
                  canvasSystem
                    .camera.zoom,

                obj.height *
                  canvasSystem
                    .camera.zoom
              );
            }
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
  // REDRAW ON DATA CHANGE
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
