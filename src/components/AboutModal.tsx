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
          The genes tracked here (<b>CD3E, CD19, MS4A1, GNLY, CD14</b>) are
          canonical lineage markers. They act as "biological ID cards" for T
          cells, B cells, Monocytes, and NK cells, allowing us to validate that
          our UMAP clusters represent real biological populations.
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
