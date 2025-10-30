'use client';

import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button, Container, Loader, Title } from '@mantine/core';
import LenderDashboard from '@/components/Loans/Admin/Dashboard';
import LenderModal from '@/components/Loans/Admin/Modal';
import LenderTestCalcModal from '@/components/Loans/Admin/TestModal';
import CriteriaList from '@/components/Loans/Criteria/CriteriaList.json';

export default function DashboardPage() {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const [calcOpened, setCalcOpened] = useState(false);

  useEffect(() => {
    const fetchLenders = async () => {
      try {
        const res = await fetch('/api/getLenders');
        const data = await res.json(); // parse JSON directly
        console.log('Fetched lenders:', data);

        // Set the data state with the fetched lenders
        setData(data.data as Record<string, any>);
      } catch (error) {
        console.error('Error fetching lenders:', error);
      }
    };

    fetchLenders();
  }, []);

  const handleSave = (record: any) => {
    setData((prev) => {
      const newData = { ...prev };
      if (record.id) {
        newData[record.id] = record;
      } else {
        const nextKey = String(Math.max(...Object.keys(newData).map(Number)) + 1);
        newData[nextKey] = record;
      }
      return newData;
    });
    setOpened(false);
    setSelected(null);
  };

  if (!data) {
    return <Loader />;
  }

  return (
    <Container py="lg" w="100%" maw="100%">
      <Title order={2} mb="md">
        Lender Dashboard
      </Title>
      <Button
        leftSection={<IconPlus size={16} />}
        mb="md"
        onClick={() => {
          setSelected(null);
          setOpened(true);
        }}
      >
        Add Lender Scenario
      </Button>

      <LenderDashboard
        data={data}
        onEdit={(item) => {
          setSelected(item);
          setOpened(true);
        }}
        onTest={(item) => {
          setSelected(item);
          setCalcOpened(true);
        }}
      />

      <LenderModal
        opened={opened}
        onClose={() => setOpened(false)}
        onSave={handleSave}
        initial={selected}
      />
      <LenderTestCalcModal
        opened={calcOpened}
        onClose={() => setCalcOpened(false)}
        initial={selected}
      />
    </Container>
  );
}
