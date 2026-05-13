import {
  useEffect,
  useRef,
} from "react";

import { CanvasSystem } from "../systems/canvasSystem";
import { GridSystem } from "../systems/gridSystem";

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

  // =====================================
  // REFS
  // =====================================

  const canvasRef = useRef(null);

  const canvasSystemRef =
    useRef(null);

  const gridSystemRef =
    useRef(null);

  const imageCacheRef =
    useRef({});

  // =====================================
  // LIVE STATE REFS
  // =====================================

  const layersRef =
    useRef(layers);

  const activeLayerRef =
    useRef(activeLayerId);

  const selectedRef =
    useRef(selectedObjects);

  useEffect(() => {

    layersRef.current =
      layers;

  }, [layers]);

  useEffect(() => {

    activeLayerRef.current =
      activeLayerId;

  }, [activeLayerId]);

  useEffect(() => {

    selectedRef.current =
      selectedObjects;

  }, [selectedObjects]);

  // =====================================
  // DRAG STATE
  // =====================================

  const dragRef = useRef({

    window.addEventL
