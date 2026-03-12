import { forwardRef } from "react";
import { Paper } from "@mantine/core";

interface CellCanvasProps {
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const CellCanvas = forwardRef<HTMLCanvasElement | null, CellCanvasProps>(
  ({ onMouseMove, onMouseLeave, onClick }, ref) => {
    return (
      <Paper
        shadow="xl"
        p={0}
        radius="md"
        withBorder
        className="bg-glass-slate border-slate-700 overflow-hidden w-full h-full flex items-center justify-center"
      >
        <canvas
          ref={ref}
          width={800}
          height={756}
          onMouseMove={onMouseMove}
          onClick={onClick}
          onMouseLeave={onMouseLeave}
          className="bg-black rounded border border-slate-800 w-full h-auto cursor-crosshair"
        />
      </Paper>
    );
  },
);

CellCanvas.displayName = "CellCanvas";
export default CellCanvas;
