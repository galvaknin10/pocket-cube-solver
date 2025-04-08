import { getLayerFromFaceAndPosition } from "./CubeUtils";

/**
 * Handle mouse down event on the cube.
 * Either triggers a layer rotation or starts full-cube drag.
 */
export function handleMouseDown(event, setSelectedLayer, setDragStart, setIsDragging) {
  event.preventDefault();
  const faceElement = event.target.closest(".cubie-face");
  if (faceElement) {
    const face = faceElement.dataset.face;
    const cubieEl = faceElement.closest(".cubie");
    if (face && cubieEl) {
      const { x, y, z } = cubieEl.dataset;
      const layer = getLayerFromFaceAndPosition(face, x, y, z);
      if (layer) {
        setSelectedLayer(layer);
        setDragStart({ x: event.clientX, y: event.clientY });
        return;
      }
    }
  }
  setIsDragging(true);
  setDragStart({ x: event.clientX, y: event.clientY });
}

/**
 * Handle mouse move event.
 * Either rotates the full cube or processes a layer drag.
 */
export function handleMouseMove(event, {
  isDragging,
  dragStart,
  setRotation,
  setDragStart,
  selectedLayer,
  setSelectedLayer,
  handleRotateLayer,
  cubeState,
  guideMode,
  solutionSteps,
  currentStepIndex,
  handleUserRotationDone
}) {
  const MAX_ROTATION_X = 90;
  const MIN_ROTATION_X = -90;

  if (isDragging) {
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    setRotation((prev) => {
      const newX = prev.x - deltaY * 0.3;
      const newY = prev.y + deltaX * 0.3;
      return {
        x: Math.max(MIN_ROTATION_X, Math.min(newX, MAX_ROTATION_X)),
        y: newY,
      };
    });
    setDragStart({ x: event.clientX, y: event.clientY });
  }

  if (!guideMode) {
    if (selectedLayer) {
      const deltaX = event.clientX - dragStart.x;
      if (Math.abs(deltaX) > 30) {
        const direction = deltaX > 0 ? 90 : -90;
        handleRotateLayer(selectedLayer, direction);
        console.log(cubeState);
        setSelectedLayer(null);
      }
    }
  } else {
    const expectedLayer = solutionSteps[currentStepIndex];
    if (selectedLayer === expectedLayer) {
      const deltaX = event.clientX - dragStart.x;
      const direction = deltaX > 0 ? 90 : -90;
      const validRotate =
        ((["U", "F", "R", "D"].includes(selectedLayer) && direction === 90) ||
         (["B", "L"].includes(selectedLayer) && direction === -90));

      if (Math.abs(deltaX) > 30 && validRotate) {
        handleRotateLayer(selectedLayer, direction);
        setSelectedLayer(null);
        handleUserRotationDone();
      }
    }
  }
}

/**
 * Resets dragging states when mouse is released.
 */
export function handleMouseUp(setIsDragging, setSelectedLayer) {
  setIsDragging(false);
  setSelectedLayer(null);
}

/**
 * Same as mouseUp — reset states if mouse leaves cube area.
 */
export function handleMouseLeave(setIsDragging, setSelectedLayer) {
  setIsDragging(false);
  setSelectedLayer(null);
}
