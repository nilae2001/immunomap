import {
  Group,
  Title,
  Text,
  Badge,
  Container,
  Anchor,
  Box,
  Stack,
  ActionIcon,
} from "@mantine/core";
import AboutModal from "./AboutModal";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
export const Header = () => {
  const [aboutOpened, setAboutOpened] = useState(false);
  return (
    <Box
      component="header"
      className="border-b border-slate-800 bg-black/40 backdrop-blur-md sticky top-0 z-50"
    >
      <Container size="lg" py="md">
        <Group justify="space-between">
          <Stack gap={0}>
            <Group gap="xs">
              <Title
                order={2}
                className="text-dna-teal tracking-tighter font-black"
              >
                IMMUNOMAP
              </Title>
              <Badge variant="outline" color="cyan" size="sm">
                v4.0
              </Badge>
            </Group>
            <Text c="dimmed" size="xs" fw={500} tt="uppercase" lts={1}>
              Single-Cell RNA-Seq Visualizer
            </Text>
          </Stack>

          <Group gap="xl" visibleFrom="sm">
            <AboutModal
              opened={aboutOpened}
              onClose={() => setAboutOpened(false)}
            />
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setAboutOpened(true)}
              size="lg"
            >
              <IconInfoCircle size={22} />
            </ActionIcon>
            <Anchor href="#" c="dna-teal" size="sm" fw={700}>
              GitHub
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};
