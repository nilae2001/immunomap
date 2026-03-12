import {
  Modal,
  Text,
  Stack,
  Divider,
  Group,
  Badge,
  Anchor,
} from "@mantine/core";

interface AboutModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function AboutModal({ opened, onClose }: AboutModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="System Intelligence: IMMUNOMAP v4.0"
      centered
      size="lg"
      overlayProps={{ backgroundOpacity: 0.6, blur: 3 }}
    >
      <Stack gap="md">
        <Text size="sm">
          A personal experimental playground for single-cell transcriptomics.
          This tool visualizes how individual immune cells are clustered based
          on their genetic signatures.
        </Text>

        <Divider label="The Pipeline" labelPosition="center" />
        <Text size="xs" c="dimmed">
          The data was processed using <span className="font-bold">Python</span>{" "}
          in an <span className="font-bold">Anaconda</span> environment. I used{" "}
          <span className="font-bold">Scanpy</span> to perform quality control,
          log-normalization, and UMAP dimensionality reduction on a 10x Genomics
          PBMC dataset.
        </Text>

        <Divider label="Frontend Stack" labelPosition="center" />
        <Group gap="xs" justify="center">
          <Badge variant="dot" color="blue">
            React
          </Badge>
          <Badge variant="dot" color="cyan">
            TypeScript
          </Badge>
          <Badge variant="dot" color="teal">
            Mantine UI
          </Badge>
          <Badge variant="dot" color="indigo">
            TailwindCSS
          </Badge>
        </Group>

        <Divider label="The Markers" labelPosition="center" />
        <Text size="xs" c="dimmed" lh={1.5}>
          The system tracks an expanded suite of canonical lineage markers,
          including Pan-T markers (CD3E, CD3D), B-cell regulators (CD19, MS4A1,
          CD79A), and myeloid-specific transcripts (CD14, LYZ). These genes
          function as "biological ID cards," allowing us to map the UMAP
          coordinates back to high-confidence cell identities—from dominant
          populations like T Cells and Monocytes to rare subsets like Dendritic
          Cells (FCER1A) and Megakaryocytes (PPBP, PF4). By correlating these
          genetic signatures with spatial clustering, we can validate that the
          manifold represents distinct, functional biological populations rather
          than stochastic noise.
        </Text>

        <Divider mt="md" />

        <Text size="xs" ta="center" c="dimmed">
          made with ❤️, bad posture, and yung lean by{" "}
          <Anchor
            href="https://www.nilaerturk.com"
            target="_blank"
            underline="hover"
            fw={700}
            c="dna-teal"
          >
            nila
          </Anchor>
        </Text>
      </Stack>
    </Modal>
  );
}
