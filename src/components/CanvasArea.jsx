import { useEffect, useRef } from "react";
import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";
import { ObjectSystem } from "../systems/objectSystem";
import { TransformSystem } from "../systems/transformSystem";

function CanvasArea({

  layers,
  activeLayerId,
  addObjectToLayer,
  selectedObjects,
  setSelectedObjects,

}) {

  const canvasRef = useRef(null);
  const canvasSystemRef = useRef(null);
  const gridSystemRef = useRef(null);
  const imageCache = useRef({});

  const layersRef = useRef(layers);
  const selectedRef = useRef(selectedObjects);

  useEffect(() => layersRef.current = layers, [layers]);
  useEffect(() => selectedRef.current = selectedObjects, [selectedObjects]);

  const interaction = useRef({
    mode: null,
    target: null,
    handle: null,
    offsetX: 0,
    offsetY: 0,
    startAngle: 0,
  });

  const GRID = 50;
  const snap = true;

  // =========================
  // INIT
  // =========================

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvasSystemRef.current)
      canvasSystemRef.current = new CanvasSystem(canvas);

    if (!gridSystemRef.current)
      gridSystemRef.current = new GridSystem(GRID);

    const canvasSystem = canvasSystemRef.current;
    const grid = gridSystemRef.current;

    // =========================
    // IMAGE CACHE
    // =========================

    const getImage = (src) => {
      if (!src) return null;
      if (imageCache.current[src]) return imageCache.current[src];

      const img = new Image();
      img.src = src;
      imageCache.current[src] = img;

      return img;
    };

    // =========================
    // FIND
    // =========================

    const findObject = (x, y) =>
      ObjectSystem.findTopObject(layersRef.current, x, y);

    // =========================
    // MOUSE DOWN
    // =========================

    const handleMouseDown = (e) => {

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);
      const result = findObject(world.x, world.y);

      if (!result) {
        setSelectedObjects([]);
        return;
      }

      const { obj } = result;

      setSelectedObjects([obj.id]);

      const screen = canvasSystem.worldToScreen(obj.x, obj.y);

      const handles = TransformSystem.getHandles(obj, screen, canvasSystem.camera);
      const handle = TransformSystem.detectHandle(handles, e.clientX, e.clientY);

      interaction.current = {
        mode: handle ? "transform" : "move",
        target: obj,
        handle,
        offsetX: world.x - obj.x,
        offsetY: world.y - obj.y,
      };
    };

    // =========================
    // MOVE + TRANSFORM
    // =========================

    const handleMouseMove = (e) => {

      const i = interaction.current;
      if (!i.target) return;

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      // =========================
      // MOVE
      // =========================

      if (i.mode === "move") {

        let nx = world.x - i.offsetX;
        let ny = world.y - i.offsetY;

        if (snap) {
          nx = Math.round(nx / GRID) * GRID;
          ny = Math.round(ny / GRID) * GRID;
        }

        i.target.x = nx;
        i.target.y = ny;
      }

      // =========================
      // RESIZE
      // =========================

      if (i.mode === "transform" && i.handle) {

        const obj = i.target;

        const dx = world.x - obj.x;
        const dy = world.y - obj.y;

        switch (i.handle) {

          case "se":
            obj.width = dx;
            obj.height = dy;
            break;

          case "nw":
            obj.width += obj.x - world.x;
            obj.height += obj.y - world.y;
            obj.x = world.x;
            obj.y = world.y;
            break;

          case "e":
            obj.width = dx;
            break;

          case "s":
            obj.height = dy;
            break;
        }

        if (obj.width < 20) obj.width = 20;
        if (obj.height < 20) obj.height = 20;
      }
    };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp = () => {
      interaction.current.target = null;
      interaction.current.mode = null;
    };

    // =========================
    // DELETE
    // =========================

    const handleKeyDown = (e) => {

      if (e.key === "Delete") {
        ObjectSystem.deleteObjects(layersRef.current, selectedObjects);
        setSelectedObjects([]);
      }
    };

    // =========================
    // DROP
    // =========================

    const handleDrop = (e) => {

      e.preventDefault();

      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;

      const asset = JSON.parse(raw);

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      addObjectToLayer(activeLayerId, {
        id: crypto.randomUUID(),
        type: "sprite",
        x: world.x,
        y: world.y,
        width: 120,
        height: 120,
        rotation: 0,
        src: asset.src,
      });
    };

    // =========================
    // RENDER
    // =========================

    const render = (ctx) => {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#233142";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      grid.draw(ctx, canvas.width, canvas.height, canvasSystem.camera);

      const layers = layersRef.current;
      const selected = selectedRef.current;

      for (const layer of layers) {

        if (!layer.visible) continue;

        for (const obj of layer.objects) {

          const img = getImage(obj.src);
          if (!img) continue;

          const screen = canvasSystem.worldToScreen(obj.x, obj.y);

          const w = obj.width * canvasSystem.camera.zoom;
          const h = obj.height * canvasSystem.camera.zoom;

          ctx.drawImage(img, screen.x, screen.y, w, h);

          // =========================
          // BOX + HANDLES
          // =========================

          if (selected.includes(obj.id)) {

            ctx.strokeStyle = "#00ff88";
            ctx.lineWidth = 2;
            ctx.strokeRect(screen.x, screen.y, w, h);

            const handles = TransformSystem.getHandles(obj, screen, canvasSystem.camera);

            for (const key in handles) {
              const hnd = handles[key];

              ctx.fillStyle = key === "rotate" ? "red" : "#ffffff";
              ctx.fillRect(hnd.x - 4, hnd.y - 4, 8, 8);
            }
          }
        }
      }
    };

    canvasSystem.startRenderLoop(render);

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("drop", handleDrop);
    canvas.addEventListener("dragover", e => e.preventDefault());

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("drop", handleDrop);
    };

  }, [layers, activeLayerId, selectedObjects]);

  return (
    <main className="canvas-area">
      <canvas ref={canvasRef} id="map-canvas" />
    </main>
  );
}

export default CanvasArea;
