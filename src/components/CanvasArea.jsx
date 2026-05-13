import { useEffect, useRef } from "react";
import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";
import { ObjectSystem } from "../systems/objectSystem";

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
  const canvasSystemRef = useRef(null);
  const gridSystemRef = useRef(null);
  const imageCacheRef = useRef({});

  // =========================
  // STATE REFS (EVITA BUG)
  // =========================

  const layersRef = useRef(layers);
  const selectedRef = useRef(selectedObjects);

  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  useEffect(() => {
    selectedRef.current = selectedObjects;
  }, [selectedObjects]);

  // =========================
  // TRANSFORM STATE
  // =========================

  const interactionRef = useRef({
    mode: null, // move | resize | rotate
    target: null,
    offsetX: 0,
    offsetY: 0,
    startAngle: 0,
  });

  const snapToGrid = true;
  const GRID = 50;

  // =========================
  // INIT
  // =========================

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvasSystemRef.current) {
      canvasSystemRef.current = new CanvasSystem(canvas);
    }

    if (!gridSystemRef.current) {
      gridSystemRef.current = new GridSystem(GRID);
    }

    const canvasSystem = canvasSystemRef.current;
    const gridSystem = gridSystemRef.current;

    // =========================
    // GET IMAGE
    // =========================

    const getImage = (src) => {
      if (!src) return null;

      if (imageCacheRef.current[src]) {
        return imageCacheRef.current[src];
      }

      const img = new Image();
      img.src = src;
      imageCacheRef.current[src] = img;

      return img;
    };

    // =========================
    // FIND OBJECT
    // =========================

    const findObject = (x, y) => {
      return ObjectSystem.findTopObject(layersRef.current, x, y);
    };

    // =========================
    // MOUSE DOWN
    // =========================

    const handleMouseDown = (e) => {

      if (e.button !== 0) return;

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      const result = findObject(world.x, world.y);

      if (!result) {
        setSelectedObjects([]);
        return;
      }

      const { obj } = result;

      setSelectedObjects([obj.id]);

      interactionRef.current = {
        mode: "move",
        target: obj,
        offsetX: world.x - obj.x,
        offsetY: world.y - obj.y,
      };
    };

    // =========================
    // MOVE
    // =========================

    const handleMouseMove = (e) => {

      const state = interactionRef.current;
      if (!state.target) return;

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      let newX = world.x - state.offsetX;
      let newY = world.y - state.offsetY;

      if (snapToGrid) {
        newX = Math.round(newX / GRID) * GRID;
        newY = Math.round(newY / GRID) * GRID;
      }

      state.target.x = newX;
      state.target.y = newY;
    };

    // =========================
    // MOUSE UP
    // =========================

    const handleMouseUp = () => {
      interactionRef.current.target = null;
      interactionRef.current.mode = null;
    };

    // =========================
    // DELETE / DUPLICATE
    // =========================

    const handleKeyDown = (e) => {

      if (e.key === "Delete") {
        ObjectSystem.deleteObjects(layersRef.current, selectedObjects);
        setSelectedObjects([]);
      }

      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
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

    const renderScene = (ctx) => {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#233142";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gridSystem.draw(ctx, canvas.width, canvas.height, canvasSystem.camera);

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

          if (selected.includes(obj.id)) {
            ctx.strokeStyle = "#00ff88";
            ctx.lineWidth = 2;
            ctx.strokeRect(screen.x, screen.y, w, h);
          }
        }
      }
    };

    canvasSystem.startRenderLoop(renderScene);

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
