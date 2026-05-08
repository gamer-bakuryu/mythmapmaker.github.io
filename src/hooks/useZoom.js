import { useState } from "react";

export function useZoom(initialZoom = 1) {
  const [zoom, setZoom] = useState(initialZoom);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.2));
  };

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
  };
}
