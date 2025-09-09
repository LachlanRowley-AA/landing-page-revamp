import { IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import { Group, Image, Stack, Text, ThemeIcon, Paper } from '@mantine/core';

const criteriaList = [
  { text: '2 Year ABN' },
  { text: '5 Year term length' },
];

export default function Criteria() {
  return (
    <Paper withBorder p="md" radius="md" mb="lg" bg="gray.0">
      <Stack gap="sm">
        {criteriaList.map((i) => (
          <Group key={i.text}>
            <ThemeIcon size="lg" radius="xl" color="teal">
              <IconRosetteDiscountCheckFilled size={18} />
            </ThemeIcon>
            <Text size="sm" fw={500}>{i.text}</Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
