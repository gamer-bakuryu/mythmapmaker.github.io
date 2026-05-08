import { useEffect, useRef } from "react";
import { CanvasSystem } from "../systems/canvasSystem";

export function useCanvas() {
  const canvasRef = useRef(null);
  const canvasSystemRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasSystemRef.current = new CanvasSystem(canvasRef.current);
  }, []);

  return {
    canvasRef,
    canvasSystem: canvasSystemRef,
  };
}
