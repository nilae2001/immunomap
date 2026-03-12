import { useState, useMemo } from "react";
import type { Cell } from "../types/Cell";
import { quadtree } from "d3-quadtree";

export function useMouseInteraction(cells: Cell[]) {
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  // 1. Build the Quadtree once.
  // We use useMemo so it only recalculates if the cell list actually changes.
  const searchTree = useMemo(() => {
    return quadtree<Cell>()
      .x((d) => d.x)
      .y((d) => d.y)
      .addAll(cells);
  }, [cells]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();

    // Mouse position in Pixels
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (cells.length === 0) return;

    // 2. REPEAT THE GEOMETRY MATH
    const padding = 30;
    const plotWidth = canvas.width - padding * 2;
    const plotHeight = canvas.height - padding * 2;

    const xValues = cells.map((c) => c.x);
    const yValues = cells.map((c) => c.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    const scale = Math.min(
      plotWidth / (maxX - minX),
      plotHeight / (maxY - minY),
    );

    const offsetX = (canvas.width - (maxX - minX) * scale) / 2;
    const offsetY = (canvas.height - (maxY - minY) * scale) / 2;

    // 3. THE REVERSE TRANSFORM
    // We convert the Pixel-Mouse-Pos into "Biological Units"
    // To ask the tree: "Who is at these UMAP coordinates?"
    const dataX = (mouseX - offsetX) / scale + minX;

    // Remember the Y-flip: we have to reverse the subtraction from canvas.height
    const dataY = (canvas.height - mouseY - offsetY) / scale + minY;

    // 4. THE SEARCH
    // Search within a 12px radius (converted to data units)
    const searchRadius = 12 / scale;
    const closest = searchTree.find(dataX, dataY, searchRadius) || null;

    setHoveredCell(closest);
  };

  const handleMouseLeave = () => setHoveredCell(null);

  const handleCanvasClick = () => {
    if (hoveredCell) {
      setSelectedCell(hoveredCell);
    } else {
      setSelectedCell(null);
    }
  };

  return {
    hoveredCell,
    selectedCell,
    setSelectedCell,
    handleMouseMove,
    handleMouseLeave,
    handleCanvasClick,
  };
}
