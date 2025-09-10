import { Box, Card, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import Navbar from '@/components/Loans/Calculator';
import { CriteriaHandler } from '@/components/Loans/Criteria/CriteriaHandler';
import ListView from '@/components/Loans/Criteria/ListView';

export default function Page() {
  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: '#e2e1e1ff', height: '100vh', paddingTop: '40px' }}>
        <CriteriaHandler>
          <Card h="100%" bg="white" py="xl" mx={200}>
            <Group align="stretch" gap="sm">
              <Box w={6} bg="#01E194" style={{ borderRadius: 2 }} />
              <Stack gap={0} w="95%">
                <Title order={2} ta="center">
                  Vehicle Finance Calculators
                </Title>
                <Text fz='sm' fw="bold" ta='center'>
                  for vehicles up to 5 years old
                </Text>

                <Text fz={24} fw="bold" py="md">
                  Choose the category which fits you best
                </Text>
              </Stack>
            </Group>

            <Divider />
            <ListView />
          </Card>
        </CriteriaHandler>
      </div>
    </div>
  );
}
