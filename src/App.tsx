import { useRef, useState } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";

import { useCellData } from "./hooks/useCellData";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { useMouseInteraction } from "./hooks/useMouseInteraction";

import CellCanvas from "./components/CellCanvas";
import InspectionPanel from "./components/InspectionPanel";
import ControlPanel from "./components/ControlPanel";
import StatsPanel from "./components/StatsPanel";
import HoverHUD from "./components/HoverHUD";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { cells } = useCellData();

  const [selectedGene, setSelectedGene] = useState<string | null>("CD3E");
  const [compareGene, setCompareGene] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(0.2);

  const {
    hoveredCell,
    selectedCell,
    setSelectedCell,
    handleMouseMove,
    handleMouseLeave,
    handleCanvasClick,
  } = useMouseInteraction(cells);

  useCanvasRenderer(canvasRef, cells, selectedGene, compareGene, threshold);

  const geneOptions = cells.length > 0 ? Object.keys(cells[0].genes) : [];

  const doublePositiveCount = cells.filter((cell) => {
    const val1 = cell.genes[selectedGene!] || 0;
    const val2 = compareGene ? cell.genes[compareGene] || 0 : 0;
    return val1 > threshold && val2 > threshold;
  }).length;

  const doublePositivePercent = (
    (doublePositiveCount / cells.length) *
    100
  ).toFixed(1);
  return (
    <MantineProvider defaultColorScheme="dark" forceColorScheme="dark">
      <div className="bg-void-black min-h-screen text-slate-200">
        <Header />

        <main className="max-w-450 mx-auto px-6 py-2">
          <div className="flex flex-row items-start gap-8 no-wrap">
            <aside className="w-60 shrink-0 flex flex-col gap-6">
              <div className="h-15 w-full relative">
                {hoveredCell ? (
                  <div>
                    <HoverHUD cell={hoveredCell} />
                  </div>
                ) : (
                  <div className="h-full w-full rounded-md border border-dashed border-slate-700 flex items-center justify-center bg-slate-900/20">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Scan Map
                    </span>
                  </div>
                )}
              </div>

              <StatsPanel cells={cells} />
              <p className="text-xs text-slate-500 italic">
                Click a cell to lock selection for deep biological analysis.
              </p>
            </aside>

            <section className="flex-1 min-w-0 flex flex-col gap-6">
              <section className="flex-1 min-w-0 h-[75vh] flex flex-col">
                <div className="relative w-full h-full border border-slate-800 rounded-xl overflow-hidden bg-black">
                  <CellCanvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleCanvasClick}
                  />
                </div>
              </section>
            </section>

            <aside className="w-95 shrink-0">
              {selectedCell ? (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <InspectionPanel
                    cell={selectedCell}
                    threshold={threshold}
                    onClose={() => setSelectedCell(null)}
                  />
                </div>
              ) : (
                <ControlPanel
                  geneOptions={geneOptions}
                  selectedGene={selectedGene}
                  setSelectedGene={setSelectedGene}
                  compareGene={compareGene}
                  setCompareGene={setCompareGene}
                  threshold={threshold}
                  setThreshold={setThreshold}
                  doublePositivePercent={doublePositivePercent}
                />
              )}
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </MantineProvider>
  );
}

export default App;
