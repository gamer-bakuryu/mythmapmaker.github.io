import React from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import GridSystem from "../systems/gridSystem";

function CanvasArea({
  children
}) {
  return (
    <div className="w-full h-full relative">

      <CanvasSystem>

        <GridSystem />

        {children}

      </CanvasSystem>

    </div>
  );
}

export default CanvasArea;
