'use client';

import { useContext } from 'react';
import { Button, Grid, GridCol, Stack, Title } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_OptionsContext } from '../Context';

type DateSelectProps = {
  dates: number[];
  setATO: boolean;
  onSelect?: () => void; // new callback
};

export default function DateSelect({ dates, setATO, onSelect }: DateSelectProps) {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const { setATO_paymentTermLength, setLoan_paymentTermLength } = ctx;

  const handleSelect = (value: number) => {
    if (setATO) {
      setATO_paymentTermLength(value);
    } else {
      setLoan_paymentTermLength(value);
    }
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
        {setATO
          ? 'Select your payment term length with the ATO'
          : 'Select your desired finance term length'}
      </JumboTitle>

      <Grid justify="center" gutter="md" style={{ width: '100%', maxWidth: 400 }}>
        {dates.map((i) => (
          <GridCol span={6} key={i}>
            <Button fullWidth size="md" variant="outline" onClick={() => handleSelect(i)}>
              {i} Months
            </Button>
          </GridCol>
        ))}
      </Grid>
    </Stack>
  );
}
