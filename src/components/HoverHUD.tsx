import { Paper, Text } from "@mantine/core";
import type { Cell } from "../types/Cell";

interface HoverHUDProps {
  cell: Cell;
}

export default function HoverHUD({ cell }: HoverHUDProps) {
  return (
    <Paper
      p="sm"
      shadow="xl"
      withBorder
      className="bg-glass-slate border-dna-teal animate-in fade-in slide-in-from-right-2"
      style={{
        textAlign: "right",
        borderRightWidth: "4px",
      }}
    >
      <Text size="xs" c="dimmed">
        ID: {cell.id}
      </Text>
      <Text fw={700} c="var(--color-dna-teal)">
        {cell.type}
      </Text>
    </Paper>
  );
}
