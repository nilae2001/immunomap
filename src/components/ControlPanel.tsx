import {
  Paper,
  Stack,
  Select,
  Box,
  Text,
  Slider,
  Divider,
  Group,
  Badge,
} from "@mantine/core";
import { geneColors } from "../constants/geneColors";

interface ControlPanelProps {
  geneOptions: string[];
  selectedGene: string | null;
  setSelectedGene: (val: string | null) => void;
  compareGene: string | null;
  setCompareGene: (val: string | null) => void;
  threshold: number;
  setThreshold: (val: number) => void;
  doublePositivePercent: string;
}

export default function ControlPanel({
  geneOptions,
  selectedGene,
  setSelectedGene,
  compareGene,
  setCompareGene,
  threshold,
  setThreshold,
  doublePositivePercent,
}: ControlPanelProps) {
  const isLowThreshold = threshold < 0.2;

  const getThresholdMessage = (val: number) => {
    if (val < 0.1)
      return "🔬 High Sensitivity: Displaying baseline transcripts and potential background noise.";
    if (val > 1.5)
      return "🎯 High Specificity: Isolating elite cells with maximum transcriptional activity.";
    return "Filters map sensitivity. Higher values isolate 'loud' signals; lower values reveal subtle biology.";
  };

  return (
    <Paper p="lg" radius="md" withBorder className="bg-glass-slate">
      <Stack gap="lg">
        <Select
          label="Target Gene"
          data={geneOptions}
          value={selectedGene}
          onChange={setSelectedGene}
          allowDeselect={false}
        />
        <Select
          label="Compare Gene (Optional)"
          placeholder="None"
          data={geneOptions}
          value={compareGene}
          onChange={setCompareGene}
          clearable
        />

        <Box>
          <Text size="sm" fw={500} mb="xs">
            Threshold:{" "}
            <span className="text-dna-teal">{threshold.toFixed(2)}</span>
          </Text>

          <Slider
            min={-1}
            max={3}
            step={0.05}
            value={threshold}
            onChange={setThreshold}
          />

          <Text
            size="xs"
            c="dimmed"
            mt="sm"
            lh={1.4}
            style={{ minHeight: "3em" }}
          >
            {getThresholdMessage(threshold)}
          </Text>
        </Box>

        <Divider />

        <Stack gap="xs">
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            Legend
          </Text>
          <Group gap="sm">
            <Box
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: selectedGene
                  ? (geneColors[selectedGene] ?? "#fff")
                  : "#fff",
              }}
            />
            <Text size="sm">{selectedGene} Only</Text>
          </Group>

          {compareGene && (
            <>
              <Group gap="sm">
                <Box className="w-3 h-3 rounded-full bg-white shadow-[0_0_8px_white]" />
                <Text size="sm" fw={700}>
                  Double Positive
                </Text>
              </Group>

              <Paper
                p="xs"
                radius="md"
                withBorder
                className={`transition-colors ${
                  isLowThreshold
                    ? "bg-red-900/20 border-red-500/50"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <Stack gap={2}>
                  <Group justify="space-between">
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                      Co-Expression
                    </Text>
                    {isLowThreshold && (
                      <Badge
                        color="red"
                        size="xs"
                        variant="filled"
                        className="animate-pulse"
                      >
                        Low Confidence
                      </Badge>
                    )}
                  </Group>
                  <Text
                    size="sm"
                    fw={700}
                    className={isLowThreshold ? "text-red-400" : "text-white"}
                  >
                    {doublePositivePercent}%{" "}
                    <span className="font-normal text-slate-400 text-xs">
                      Overlap
                    </span>
                  </Text>
                </Stack>
              </Paper>
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
