import { Container, Group, Text, Divider, Stack, Box } from "@mantine/core";

export const Footer = () => {
  return (
    <Box component="footer" mt={60} pb={10}>
      <Container size="lg">
        <Divider opacity={0.1} mb="xl" />
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text fw={700} size="sm" className="text-dna-teal">
              IMMUNOMAP
            </Text>
            <Text size="xs" c="dimmed" style={{ maxWidth: 300 }}>
              Advanced genomic visualization for immunology research. Built with
              React, Mantine, and HTML5 Canvas.
            </Text>
          </Stack>
        </Group>

        <Text size="xs" c="dimmed" mt={40} ta="center">
          © {new Date().getFullYear()} ImmunoMap Project. For research use only.
        </Text>
      </Container>
    </Box>
  );
};
