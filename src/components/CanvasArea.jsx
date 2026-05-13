import React from "react";
import { CanvasSystem } from "../systems/canvasSystem";

function CanvasArea({ children }) {
  return (
    <div className="w-full h-full relative">
      <CanvasSystem>
        {children}
      </CanvasSystem>
    </div>
  );
}

export default CanvasArea;
