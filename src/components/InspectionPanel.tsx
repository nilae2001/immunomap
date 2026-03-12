import {
  Paper,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Divider,
  Box,
} from "@mantine/core";
import { cellDatabase } from "../data/cellDatabase";
import { getIdentity } from "../hooks/useGetIdentity";
import type { InspectionPanelProps } from "../types/InspectionPanel";

export default function InspectionPanel({
  cell,
  threshold,
  onClose,
}: InspectionPanelProps) {
  const cleanType = cell.type.trim();
  const cellInfo = cellDatabase[cleanType];

  const prediction = getIdentity(cell.genes);

  const isMismatch = (() => {
    if (prediction.name === "Unknown Identity") return false;

    const type = cell.type.toLowerCase();
    const pred = prediction.name.toLowerCase();

    if (pred.includes("t-lymphocyte") && type.includes("t cell")) return false; // t-lymphocyte is sometimes called t-cell, if thats the case, there's no mismatch, just different names for same thing
    if (pred.includes("b-lymphocyte") && type.includes("b cell")) return false;
    if (pred.includes("monocyte") && type.includes("monocyte")) return false;
    if (pred.includes("nk") && type.includes("nk")) return false;
    if (pred.includes("dendritic") && type.includes("dendritic")) return false;
    if (pred.includes("megakaryocyte") && type.includes("megakaryocyte"))
      return false;

    return pred !== type; //if STILL the data says monocyte but prediction says B cell, it return true, and there is a mismatch. this can happen if for instance a T-cell was gropued with monocytes by louvain since it was expressing the same noise as a monocyte, and thus lives in that neighbourhood. prediction is the actual dna that the app is looking at (looking for a specific gene expression of that one single cell, ie checking for cd3e or cd14). prediction doesnt care who neighbours are, its just looking at what cell is saying
  })();

  const activeInfo = cellDatabase[prediction.name] || cellInfo;

  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      className="bg-glass-slate border-dna-teal shadow-lg animate-in fade-in slide-in-from-bottom-4 relative"
    >
      <Stack className="mb-5">
        <Button
          variant="outline"
          color="gray"
          size="xs"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            paddingBottom: 2,
          }}
        >
          Close
        </Button>
      </Stack>

      <Group align="flex-start" gap="xl" mt="xs" mb="md">
        <Stack gap={0}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Inspecting Cell
          </Text>
          <Text fw={700} size="xl" className="text-dna-teal">
            ID: #{cell.id}
          </Text>
        </Stack>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            General Identity
          </Text>
          <Badge
            size="lg"
            color={prediction.color}
            variant={prediction.name !== "Unknown Identity" ? "dot" : "light"}
          >
            {prediction.name}
          </Badge>
        </Stack>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            Data Cluster
          </Text>
          <Badge size="lg" color={prediction.color} variant="filled">
            {cell.type}
          </Badge>
          {isMismatch && (
            <Badge color="red" variant="outline" size="sm">
              ⚠️ IDENTITY CONFLICT
            </Badge>
          )}
        </Stack>

        <Stack gap={0}>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase">
            Reasoning
          </Text>
          <Text size="sm" c="slate.3">
            {prediction.reason}
          </Text>
        </Stack>

        {isMismatch && (
          <Box
            p="xs"
            mt="sm"
            className="bg-red-500/10 border border-red-500/20 rounded"
          >
            <Text size="xs" c="red.4" fw={700}>
              CLASSIFICATION DISCREPANCY:
            </Text>
            <Text size="xs" c="red.2">
              Cluster analysis suggests{" "}
              <span className="italic">{cell.type}</span>, but gene markers{" "}
              <span className="font-bold">
                {Object.keys(cell.genes)
                  .filter((g) => cell.genes[g] > 0.5)
                  .join(", ")}
              </span>
              {""}point to <span className="font-bold">{prediction.name}</span>.
            </Text>
          </Box>
        )}
        {prediction.name === "Unknown Identity" && cell.type && (
          <Box
            p="xs"
            className="bg-orange-500/10 border border-orange-500/20 rounded"
          >
            <Text size="xs" c="orange" fw={600}>
              ⚠️ GENOMIC SILENCE:
            </Text>
            <Text size="xs" c="orange.3">
              The markers for this cell are below the detection threshold.
              Classification is based on the{" "}
              <span className="font-bold">{cell.type}</span> cluster assignment.
            </Text>
          </Box>
        )}
      </Group>

      <Divider my="md" opacity={0.2} />

      <Group grow align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            Biological Context
          </Text>
          <Text fw={700} size="xl">
            {prediction.name !== "Unknown Identity"
              ? prediction.name
              : cell.type}
          </Text>
          <Text size="sm" fw={600} c="dna-teal">
            "{activeInfo?.desc || "Specialized immune profile"}"
          </Text>
          <Text size="xs" c="slate.2" lh={1.5}>
            <span className="font-bold text-white">Primary Function: </span>
            {activeInfo?.function ||
              "Standard immune surveillance and cellular response."}
          </Text>
        </Stack>

        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase">
            Expression Profile
          </Text>
          {Object.entries(cell.genes).map(([gene, value]) => (
            <Box key={gene}>
              <Group justify="space-between" mb={2}>
                <Text size="xs" fw={500}>
                  {gene}
                </Text>
                <Text size="xs" c={value > threshold ? "cyan" : "dimmed"}>
                  {value.toFixed(2)}
                </Text>
              </Group>
              <Box className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <Box
                  className="h-full bg-dna-teal transition-all duration-500"
                  style={{ width: `${Math.min((value / 3) * 100, 100)}%` }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Group>
    </Paper>
  );
}
