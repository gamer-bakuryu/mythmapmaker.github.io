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
}) {
  const canvasRef = useRef(null);

  const canvasSystemRef = useRef(null);
  const gridSystemRef = useRef(null);

  const layersRef = useRef(layers);
  const selectedRef = useRef(selectedObjects);

  const imageCache = useRef({});

  const interaction = useRef({
    target: null,
    offsetX: 0,
    offsetY: 0,
  });

  const GRID = 50;
  const snap = true;

  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  useEffect(() => {
    selectedRef.current = selectedObjects;
  }, [selectedObjects]);

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
    // SAFE IMAGE LOADER (CRÍTICO)
    // =========================
    const getImage = (src) => {
      if (!src || typeof src !== "string") return null;

      if (imageCache.current[src]) {
        const cached = imageCache.current[src];
        if (!cached.complete || cached.naturalWidth === 0) {
          return null;
        }
        return cached;
      }

      const img = new Image();

      img.onload = () => {
        canvasSystem.requestRedraw();
      };

      img.onerror = () => {
        console.warn("Imagem inválida:", src);
      };

      img.src = src;
      imageCache.current[src] = img;

      return null;
    };

    // =========================
    // FIND OBJECT SAFE
    // =========================
    const findObject = (x, y) => {
      for (let l = layersRef.current.length - 1; l >= 0; l--) {
        const layer = layersRef.current[l];

        if (!layer.visible) continue;

        for (let i = layer.objects.length - 1; i >= 0; i--) {
          const obj = layer.objects[i];

          if (
            x >= obj.x &&
            x <= obj.x + (obj.width || 0) &&
            y >= obj.y &&
            y <= obj.y + (obj.height || 0)
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
    const onMouseDown = (e) => {
      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);
      const obj = findObject(world.x, world.y);

      if (!obj) {
        setSelectedObjects([]);
        return;
      }

      setSelectedObjects([obj.id]);

      interaction.current = {
        target: obj,
        offsetX: world.x - obj.x,
        offsetY: world.y - obj.y,
      };
    };

    // =========================
    // MOVE
    // =========================
    const onMouseMove = (e) => {
      const i = interaction.current;
      if (!i.target) return;

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      let x = world.x - i.offsetX;
      let y = world.y - i.offsetY;

      if (snap) {
        x = Math.round(x / GRID) * GRID;
        y = Math.round(y / GRID) * GRID;
      }

      i.target.x = x;
      i.target.y = y;
    };

    const onMouseUp = () => {
      interaction.current.target = null;
    };

    // =========================
    // DROP SAFE (CRÍTICO)
    // =========================
    const onDrop = (e) => {
      e.preventDefault();

      const raw = e.dataTransfer.getData("application/json");
      if (!raw) return;

      let asset;
      try {
        asset = JSON.parse(raw);
      } catch {
        return;
      }

      const world = canvasSystem.screenToWorld(e.clientX, e.clientY);

      if (!asset?.src) return;

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
    // RENDER LOOP (BLINDADO)
    // =========================
    const render = (ctx) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#233142";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      gridSystem.draw(
        ctx,
        canvas.width,
        canvas.height,
        canvasSystem.camera
      );

      const layers = layersRef.current;
      const selected = selectedRef.current;

      for (const layer of layers) {
        if (!layer.visible) continue;

        for (const obj of layer.objects) {
          if (!obj || typeof obj !== "object") continue;

          const img = getImage(obj.src);
          if (!img) continue;

          const screen = canvasSystem.worldToScreen(obj.x, obj.y);

          const w =
            (obj.width || 0) * canvasSystem.camera.zoom;

          const h =
            (obj.height || 0) * canvasSystem.camera.zoom;

          // 🚨 proteção contra draw inválido
          if (w <= 0 || h <= 0) continue;

          ctx.drawImage(img, screen.x, screen.y, w, h);

          if (selected.includes(obj.id)) {
            ctx.strokeStyle = "#00ff88";
            ctx.lineWidth = 2;
            ctx.strokeRect(screen.x, screen.y, w, h);
          }
        }
      }
    };

    canvasSystem.startRenderLoop(render);

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("drop", onDrop);
    canvas.addEventListener("dragover", (e) => e.preventDefault());

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("drop", onDrop);
    };
  }, [layers, activeLayerId]);

  return (
    <main className="canvas-area">
      <canvas ref={canvasRef} id="map-canvas" />
    </main>
  );
}

export default CanvasArea;
