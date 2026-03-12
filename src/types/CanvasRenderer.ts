import type { Cell } from "./Cell";
import type { RefObject } from "react";

export type CanvasRenderer = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cells: Cell[];
  selectedGene: string | null;
  compareGene: string | null;
  threshold: number;
};
