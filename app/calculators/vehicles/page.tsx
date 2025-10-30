'use client';

import { Box, Card, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import ListView from '@/components/Loans/Criteria/ListView';
import { useCriteria } from '@/components/Loans/Criteria/CriteriaHandler';

export default function Page() {
  const criteria = useCriteria();

  return (
    <Container size="lg" px={0}>
      <Card shadow="md" radius="lg" withBorder p={{ base: 'xs', md: 'xl' }} bg="white">
        <Group align="flex-start" gap="md" mb="md">
          <Box w={8} bg="#01E194" style={{ borderRadius: 4 }} />
          <Stack gap={4} w="100%">
            <Title order={2} ta="center" c="dark">
              Vehicle Finance Calculators
            </Title>
            <Text fz="sm" fw={600} ta="center" c="dimmed">
              for vehicles up to 5 years old
            </Text>
            <Text fz="lg" fw="bold" mt="sm">
              Choose the category which fits you best
            </Text>
          </Stack>
        </Group>

        <Divider mb="lg" />

        <ListView />
      </Card>
    </Container>
  );
}
