import { Paper, Stack, Group, Text } from "@mantine/core";
import type { Cell } from "../types/Cell";

interface StatsPanelProps {
  cells: Cell[];
}

export default function StatsPanel({ cells }: StatsPanelProps) {
  const types = [...new Set(cells.map((c) => c.type))];

  return (
    <Stack gap="md">
      <Paper withBorder p="xs" className="bg-glass-slate">
        <Group gap="xs">
          <Text size="xs" fw={700} c="dimmed">
            TOTAL CELLS:
          </Text>
          <Text size="sm" fw={700}>
            {cells.length.toLocaleString()}
          </Text>
        </Group>
      </Paper>

      <Paper
        p="md"
        radius="md"
        withBorder
        className="bg-glass-slate/30 border-slate-800"
      >
        <Text size="xs" fw={700} c="dimmed" mb="sm" tt="uppercase">
          Breakdown
        </Text>
        <Stack gap={5}>
          {types.map((type) => (
            <Group key={type} justify="space-between">
              <Text size="xs" c="white">
                {type}
              </Text>
              <Text size="xs" c="dimmed">
                {(
                  (cells.filter((c) => c.type === type).length / cells.length) *
                  100
                ).toFixed(1)}
                %
              </Text>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
