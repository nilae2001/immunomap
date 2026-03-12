import type { Cell } from "./Cell";

export type InspectionPanelProps = {
  cell: Cell;
  threshold: number;
  onClose: () => void;
};
