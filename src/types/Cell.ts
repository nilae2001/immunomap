export type Cell = {
  id: number;
  x: number;
  y: number;
  type: string;
  genes: {
    [key: string]: number;
  };
};
