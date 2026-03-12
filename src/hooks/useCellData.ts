import { useEffect, useState } from "react";
import type { Cell } from "../types/Cell";

export function useCellData() {
  const [cells, setCells] = useState<Cell[]>([]);

  useEffect(() => {
    fetch("./cells.json")
      .then((res) => res.json())
      .then((data) => setCells(data));
  }, []);

  return { cells };
}
