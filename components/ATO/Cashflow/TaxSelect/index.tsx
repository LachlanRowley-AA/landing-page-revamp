'use client';

import { useContext } from 'react';
import { Button, Grid, GridCol, Stack, Title } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_OptionsContext } from '../Context';

type DateSelectProps = {
  onSelect?: () => void; // new callback
};

const options = [
  {
    text: 'Yes',
    value: 0.25
  },
  {
    text: 'No',
    value: 0.30
  }
]

export default function TaxSelect({ onSelect }: DateSelectProps) {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const { setTaxRate } = ctx;

  const handleSelect = (value: number) => {
    setTaxRate(value);
    onSelect?.(); // trigger auto-progress if provided
  };



  return (
    <Stack align="center" justify="center" style={{ minHeight: '50vh', gap: 20 }}>
      <JumboTitle
        order={1}
        fz="xs"
        ta="center"
        style={{ textWrap: 'balance' }}
        c={{ base: 'black', md: 'black' }}
        fw={600}
      >
        Is your company elible for the lower company tax rate
      </JumboTitle>

      <Grid justify="center" gutter="md" style={{ width: '100%', maxWidth: 400 }}>
        {options.map((i) => (
          <GridCol span={6} key={i.value}>
            <Button fullWidth size="md" variant="outline" onClick={() => handleSelect(i.value)}>
              {i.text}
            </Button>
          </GridCol>
        ))}
      </Grid>
    </Stack>
  );
}
