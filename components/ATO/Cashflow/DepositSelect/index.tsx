'use client';

import { useContext } from 'react';
import { Button, Grid, GridCol, Stack } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { ATO_OptionsContext } from '../Context';

type DepositSelectProps = {
  onSelect?: () => void;
};

export default function DepositSelect({ onSelect }: DepositSelectProps) {
  const ctx = useContext(ATO_OptionsContext);
  if (!ctx) {
    throw new Error('ATO_OptionsContext is not provided');
  }

  const {
    setLoanDeposit,
    isMobile,
    amountOwed,
  } = ctx;

  const minDeposit = amountOwed * 0.05;

  const handleDepositOption = (useDeposit: boolean) => {
    // You can set context values or trigger navigation here
    if (useDeposit) {
      setLoanDeposit(true);
    } else {
      setLoanDeposit(false);
    }
    onSelect?.();
  };

  return (
    <Stack align="center" justify="center" mih={{ md: '50vh' }} style={{ gap: 24 }}>
      <JumboTitle
        order={isMobile ? 3 : 1}
        fz="xs"
        ta="center"
        style={{ textWrap: 'balance' }}
        c="black"
        fw={600}
      >
        The ATO will require an upfront deposit of{' '}
        {minDeposit.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD',
        })}
        <br /><br />
        Would you like to apply the same deposit to the finance option?
      </JumboTitle>

      <Grid justify="center" gutter="md" w="100%" maw={400}>
        <GridCol span={6}>
          <Button
            fullWidth
            size={isMobile ? 'sm' : 'md'}
            variant="filled"
            color="teal"
            onClick={() => handleDepositOption(true)}
          >
            Include Deposit
          </Button>
        </GridCol>
        <GridCol span={6}>
          <Button
            fullWidth
            size={isMobile ? 'sm' : 'md'}
            variant="outline"
            color="teal"
            onClick={() => handleDepositOption(false)}
          >
            No Deposit
          </Button>
        </GridCol>
      </Grid>
    </Stack>
  );
}
