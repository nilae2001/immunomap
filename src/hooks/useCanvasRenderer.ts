import { useEffect, type RefObject } from "react";
import type { Cell } from "../types/Cell";
import { geneColors } from "../constants/geneColors";

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  cells: Cell[],
  selectedGene: string | null,
  compareGene: string | null,
  threshold: number,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cells.length === 0) return;

    const ctx = canvas.getContext("2d"); // we've grabbed the canvas, and this is what we are gonna paint on it with
    if (!ctx) return;

    // 1. Sync Resolution (CRITICAL for clear points)
    const { width, height } = canvas.getBoundingClientRect(); // this is the height and width of the canvas
    canvas.width = width; // setting width here
    canvas.height = height; // setting height here

    // 2. Data Boundaries
    const xValues = cells.map((c) => c.x); // grab all the x values of the cells
    const yValues = cells.map((c) => c.y); // grab all the y values of the cells
    const minX = Math.min(...xValues); // find the furthest left edge x value of them all
    const maxX = Math.max(...xValues); // find the furthest right edge x value of them all
    const minY = Math.min(...yValues); // find the smallest y value of them all (very bottom)
    const maxY = Math.max(...yValues); // find the largest y value of them all (very top)

    // 3. Redesigned Scale Calculation (Tighter Padding)
    // CHANGED: reduced padding from 80/60 to 30. This is the "crop" effect.
    const padding = 30;
    const plotWidth = canvas.width - padding * 2; // plot height is the width of the canvas, subtracted by the padding, and times it by two so points arent tiny
    const plotHeight = canvas.height - padding * 2;

    const dataWidth = maxX - minX; // getting the true width of data (no pixels). ie if furthest cell on right (maxX) is at 15 and furthest on right is -5, then the data width is 20.0 in biological units
    const dataHeight = maxY - minY;

    // Find the perfect scale that hits the edge on ONE dimension
    const scale = Math.min(plotWidth / dataWidth, plotHeight / dataHeight); //width scale and height scale calculated. take the smallest one so the points arent stretched out

    // 4. Centering Offsets (UNCHANGED)
    const offsetX = (canvas.width - dataWidth * scale) / 2; // since when you scale a map, it would just sit on the top left corner, this takes back the leftover space, divides it by two, and nudges the entire map to the dead center
    const offsetY = (canvas.height - dataHeight * scale) / 2;

    // 5. The Dynamic Mapping Functions
    const getX = (x: number) => (x - minX) * scale + offsetX; // (x- minX) is normalization. if x coordinate is -5 it makes it 0. times it by scale to make it a pixel, and nudge to the side so it isnt in top left corner
    // Keep the Y-Flip fix so B Cells stay safe!
    const getY = (y: number) => canvas.height - ((y - minY) * scale + offsetY);

    cells.forEach((cell) => {
      const screenX = getX(cell.x); // take those raw coordinates
      const screenY = getY(cell.y);

      // Use bracket notation carefully
      const val1 = cell.genes[selectedGene!] || 0; // find the cell with this gene in its bag of genes
      const val2 = compareGene ? cell.genes[compareGene] || 0 : 0; // if the user picked a compare gene, check if it exists it exists or is null. if not null, bring the cells that have that gene

      const isGene1Active = val1 >= threshold; // gene 1 is active when val (the amount of expression of gene) is greater than or equal to the threshold (true or false?)
      const isGene2Active = val2 >= threshold;

      // RESET state for every cell to prevent bleed-over
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      if (isGene1Active && isGene2Active) {
        // TRUE DOUBLE POSITIVE if they're both active
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffffff";
      } else if (isGene1Active) {
        // TARGET ONLY (e.g., T-Cells)
        const color = geneColors[selectedGene!] || "#00f2ff"; // Default Cyan
        ctx.fillStyle = color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = color;
      } else if (isGene2Active) {
        // COMPARE ONLY (e.g., Monocytes)
        const color = compareGene
          ? geneColors[compareGene] || "#ff00ff"
          : "#ff00ff";
        ctx.fillStyle = color;
      } else {
        // INACTIVE
        ctx.fillStyle = "#1e293b";
        ctx.globalAlpha = 0.1;
      }

      ctx.beginPath(); // tells canvas to stop thinking about previous circle
      ctx.arc(screenX, screenY, 2, 0, Math.PI * 2); // draw our circle at coordinates with a radius of 2 pixels
      ctx.fill(); //dump the paint into the canvas
    });
    ctx.globalAlpha = 1.0; // reset the brush so cluster labels (next up) arent transparent or glowing
    ctx.shadowBlur = 0;

    const types = [...new Set(cells.map((c) => c.type))]; // creates a giant list of every single cell's type ("T-cell", "B-cell", etc)

    ctx.globalAlpha = 1.0; // get paintbrush ready
    ctx.shadowBlur = 0;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    types.forEach((type) => {
      const cluster = cells.filter((c) => c.type === type); // loop through each unique type (ie grab all T cells)
      if (cluster.length === 0) return;

      const avgX =
        cluster.reduce((sum, c) => sum + getX(c.x), 0) / cluster.length; // add up the x position of every t-cell, and divide by total number of t-cells
      const avgY =
        cluster.reduce((sum, c) => sum + getY(c.y), 0) / cluster.length;

      ctx.fillStyle = "rgba(2, 6, 23, 0.8)"; // draw a small dark rectangle
      const textWidth = ctx.measureText(type).width; // ask the canvas how long the word MONOCYTE is so we can make box the perfect size
      ctx.fillRect(avgX - textWidth / 2 - 2, avgY - 6, textWidth + 4, 12);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 10px Inter, system-ui, sans-serif";
      ctx.fillText(type.toUpperCase(), avgX, avgY); // write the cluster name
    });
  }, [cells, selectedGene, compareGene, threshold]);
}
