'use client';

import { useEffect, useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Grid,
  GridCol,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import {
  balloonCalcMethodValues,
  brokerageCalcMethodValues,
  calculateEffectiveRepayment,
  findEffectiveInterestRate,
} from '@/lib/calculatorMethods';

interface Props {
  opened: boolean;
  onClose: () => void;
  initial?: any;
}

export default function LenderTestCalcModal({ opened, onClose, initial }: Props) {
  const [form, setForm] = useState<any>({
    Rate: 0,
    Price: 0,
    Fee: 0,
    Balloon: 0,
    TermLength: 60,
    BalloonCalcMethod: 'TakesFinal' as balloonCalcMethodValues,
    BrokerageCalcMethod: 'ExFee' as brokerageCalcMethodValues,
    AKF: 0,
  });
  const [results, setResults] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);

  useEffect(() => {
    if (initial) {
      setForm({
        Rate: initial.Rate || 0,
        Price: initial.Price || 0,
        Fee: initial.FinanceFee || 0,
        Balloon: initial.Balloon || 0,
        TermLength: initial.TermLength || 60,
        BalloonCalcMethod: initial.BalloonCalcMethod || 'TakesFinal',
        BrokerageCalcMethod: initial.BrokerageCalcMethod || 'ExFee',
        AKF: initial.AKF || 0,
      });
    } else {
      setForm({
        Rate: 0,
        Price: 0,
        Fee: 0,
        Balloon: 0,
        TermLength: 60,
        BalloonCalcMethod: 'TakesFinal',
        BrokerageCalcMethod: 'ExFee',
      });
    }
  }, [initial]);

  const handleChange = (field: string, value: any) =>
    setForm((f: any) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    //display calculation results
    const repay =       calculateEffectiveRepayment(
        form.Price,
        form.Fee,
        form.Rate,
        form.TermLength,
        form.Balloon,
        form.BalloonCalcMethod,
        form.BrokerageCalcMethod,
        0.03,
        form.AKF
      )
    setResults(
      repay
    );
    setInterest(
      findEffectiveInterestRate(
        form.Price,
        form.Fee,
        -repay,
        form.TermLength,
        form.Balloon,
        form.BalloonCalcMethod
      ).annualRatePercent || 0
    );
    console.log(
      'interest',
      form.Price,
      form.Fee,
      -repay,
      form.TermLength,
      form.Balloon,
      form.BalloonCalcMethod,
      findEffectiveInterestRate(
        form.Price,
        form.Fee,
        -repay,
        form.TermLength,
        form.Balloon,
        form.BalloonCalcMethod
      ).annualRatePercent
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Test Lender'
      size="lg"
    >
      <Stack>
        <Group grow>
          <NumberInput
            label="Amount to Finance ($)"
            value={form.Price}
            onChange={(val) => handleChange('Price', val)}
            min={0}
          />
          <NumberInput
            label="Balloon (%)"
            value={form.Balloon}
            onChange={(val) => handleChange('Balloon', val)}
            min={0}
          />
          <NumberInput
            label="Term Length (months)"
            value={form.TermLength}
            onChange={(val) => handleChange('TermLength', val)}
            min={0}
          />
        </Group>
        <Grid>
          <GridCol span={6}>
            <Text>Monthly Payment</Text>
            <Text>
              $
              {results.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </Text>
          </GridCol>
          <GridCol span={6}>
            <Text>Effective APR</Text>
            <Text>
              {interest.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
              %
            </Text>
          </GridCol>
        </Grid>
      </Stack>
      <Button fullWidth onClick={handleSubmit}>
        Test
      </Button>
    </Modal>
  );
}
