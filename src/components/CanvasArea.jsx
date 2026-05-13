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
  // LOCAL SCENE
  // =========================

  const sceneRef =
    useRef([]);

  // =========================
  // SYNC REACT -> LOCAL
  // =========================

  useEffect(() => {

    sceneRef.current =
      structuredClone(layers);

  }, [layers]);

  // =========================
  // DRAG
  // =========================

  const dragRef =
    useRef({

      dragging: false,

      object: null,

      offsetX: 0,

      offsetY: 0,
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

    const findObject =
      (x, y) => {

        const layers =
          sceneRef.current;

        for (
          let l =
            layers.length - 1;
          l >= 0;
          l--
        ) {

          const layer =
            layers[l];

          if (!layer.visible)
            continue;

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

              x >= obj.x &&

              x <=
                obj.x +
                  obj.width &&

              y >= obj.y &&

              y <=
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

        const obj =
          findObject(
            world.x,
            world.y
          );

        if (!obj) {

          setSelectedObjects([]);

          canvasSystem.requestRedraw();

          return;
        }

        setSelectedObjects([
          obj.id,
        ]);

        dragRef.current = {

          dragging: true,

          object: obj,

          offsetX:
            world.x - obj.x,

          offsetY:
            world.y - obj.y,
        };

        canvasSystem.requestRedraw();
      };

    // =========================
    // MOUSE MOVE
    // =========================

    const handleMouseMove =
      (e) => {

        const drag =
          dragRef.current;

        if (
          !drag.dragging ||
          !drag.object
        ) {
          return;
        }

        const world =
          canvasSystem.screenToWorld(
            e.clientX,
            e.clientY
          );

        // =========================
        // DIRECT MEMORY UPDATE
        // =========================

        drag.object.x =
          world.x -
          drag.offsetX;

        drag.object.y =
          world.y -
          drag.offsetY;

        canvasSystem.requestRedraw();
      };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp =
      () => {

        dragRef.current
          .dragging = false;
      };

    // =========================
    // DROP
    // =========================

    const handleDrop =
      (e) => {

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

        const newObject = {

          id:
            crypto.randomUUID(),

          type: "sprite",

          x: world.x,

          y: world.y,

          width: 120,

          height: 120,

          rotation: 0,

          src: asset.src,
        };

        const localLayers =
          sceneRef.current;

        const layer =
          localLayers.find(
            (l) =>
              l.id ===
              activeLayerId
          );

        if (!layer) return;

        layer.objects.push(
          newObject
        );

        addObjectToLayer(
          activeLayerId,
          newObject
        );

        canvasSystem.requestRedraw();
      };

    // =========================
    // RENDER
    // =========================

    const renderScene =
      (ctx) => {

        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        // =========================
        // BG
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
          sceneRef.current;

        for (
          const layer of layers
        ) {

          if (!layer.visible)
            continue;

          for (
            const obj of layer.objects
          ) {

            const img =
              getImage(obj.src);

            if (!img) continue;

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

            ctx.drawImage(

              img,

              screen.x,

              screen.y,

              width,

              height
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

                width,

                height
              );
            }
          }
        }
      };

    // =========================
    // LOOP
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
    activeLayerId,
    addObjectToLayer,
    selectedObjects,
    setSelectedObjects,
  ]);

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

  }, [layers]);

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
