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
    text: 'Yes, less than $50 million',
    value: 0.25,
  },
  {
    text: 'No, more than $50 million',
    value: 0.3,
  },
];

export default function TaxSelect({ onSelect }: DateSelectProps) {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const { setTaxRate, isMobile } = ctx;

  const handleSelect = (value: number) => {
    setTaxRate(value);
    onSelect?.(); // trigger auto-progress if provided
  };

  return (
    <Stack align="center" justify="center" mih={{ md: '50vh' }} style={{ gap: 20 }} maw='800px'>
      <JumboTitle
        order={isMobile ? 3 : 1}
        fz="xs"
        ta="center"
        style={{ textWrap: 'balance', lineBreak: 'normal' }}
        c="black"
        fw={600}
      >
        Does your business have a turnover of less than $50 million?
      </JumboTitle>

      <Grid justify="center" gutter="md" style={{ width: '100%', maxWidth: 600 }}>
        {options.map((i) => (
          <GridCol span={6} key={i.value}>
            <Button
              fullWidth
              size="md"
              variant="outline"
              onClick={() => handleSelect(i.value)}
              style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}
            >
              <div style={{ whiteSpace: 'normal', display: 'block', overflowWrap: 'anywhere' }}>
                {i.text}
              </div>
            </Button>
          </GridCol>
        ))}
      </Grid>
    </Stack>
  );
}
