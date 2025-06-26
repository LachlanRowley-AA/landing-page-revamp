import { Container, Title, Text, Stack, Box, ThemeIcon, Group } from '@mantine/core';
import { IconX, IconCreditCard, IconAlertTriangle } from '@tabler/icons-react';

export function ProblemStatement() {
  return (
    <Container size="md" py="xl">
      <Stack >
        <Box ta="center">
          <Title order={2} c="red.7" mb="md">
            The Challenge Your Business Faces
          </Title>
          <Text size="lg" c="dimmed">
            Lost opportunities are costing you revenue every single day
          </Text>
        </Box>

        <Stack >
          <Group  align="flex-start">
            <ThemeIcon size="lg" color="red" variant="light">
              <IconX size={20} />
            </ThemeIcon>
            <Box flex={1}>
              <Text fw={500} mb="xs">Daily Revenue Loss</Text>
              <Text c="dimmed">
                Valuable sales slip away when customers hit their credit limits, face rejection, 
                or fall behind on payments. Each declined transaction represents lost revenue.
              </Text>
            </Box>
          </Group>

          <Group  align="flex-start">
            <ThemeIcon size="lg" color="orange" variant="light">
              <IconCreditCard size={20} />
            </ThemeIcon>
            <Box flex={1}>
              <Text fw={500} mb="xs">The Credit Policy Dilemma</Text>
              <Text c="dimmed">
                Your strict credit policies protect your business, but they also mean 
                turning away good customers who are ready and willing to purchase from you.
              </Text>
            </Box>
          </Group>
        </Stack>

        <Box 
          p="md" 
          style={{ 
            backgroundColor: 'var(--mantine-color-red-0)', 
            borderLeft: '4px solid var(--mantine-color-red-6)',
            borderRadius: '4px'
          }}
        >
          <Text fw={500} c="red.8" mb="xs">
            The Bottom Line
          </Text>
          <Text c="red.7">
            Every declined sale is a missed opportunity. Your business deserves a solution 
            that protects you from risk while keeping revenue flowing.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}