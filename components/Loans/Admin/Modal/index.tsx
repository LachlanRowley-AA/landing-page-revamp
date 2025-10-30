'use client';

import { useEffect, useState } from 'react';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import NumberInputWithText from '@/components/NumberInputWithText';
import { FormatValue, balloonCalcMethodValues, brokerageCalcMethodValues } from '@/lib/calculatorMethods';


interface Props {
  opened: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
  initial?: any;
}

export default function LenderModal({ opened, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<any>({
    Title: '',
    Rate: 0,
    MaxPrice: 0,
    MinDeposit: 0,
    MaxBalloon: 0,
    FinanceFee: 0,
    PrivateSaleFee: 0,
    PrivateSaleUplift: 0,
    ABN: 0,
    GST: 0,
    Property: false,
    Misc: [''],
    BalloonCalcMethod: 'ExFee' as balloonCalcMethodValues,
    BrokerageCalcMethod: 'TakesFinal' as brokerageCalcMethodValues,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        Title: initial.title || '',
        Rate: initial.rate || 0,
        MaxPrice: initial.max_price || 0,
        MinDeposit: initial.min_deposit || 0,
        MaxBalloon: initial.max_balloon || 0,
        FinanceFee: initial.finance_fee || 0,
        PrivateSaleFee: initial.private_sale_fee || 0,
        PrivateSaleUplift: initial.private_sale_uplift || 0,
        ABN: initial.abn ?? 0,
        GST: initial.gst ?? 0,
        Property: initial.property ?? false,
        Misc: initial.Misc?.length ? [...initial.Text.Misc] : [''],
        BalloonCalcMethod: initial.balloon_calc_method || 'ExFee',
        BrokerageCalcMethod: initial.brokerage_calc_method || 'TakesFinal',
        id: initial.id,
      });
    } else {
      setForm({
        Title: '',
        Rate: 0,
        MaxPrice: 0,
        MinDeposit: 0,
        MaxBalloon: 0,
        FinanceFee: 0,
        PrivateSaleFee: 0,
        PrivateSaleUplift: 0,
        ABN: 0,
        GST: 0,
        Property: false,
        Misc: [''],
      });
    }
  }, [initial]);

  const handleChange = (field: string, value: any) =>
    setForm((f: any) => ({ ...f, [field]: value }));

  const handleMiscChange = (index: number, value: string) => {
    const updated = [...form.Misc];
    updated[index] = value;
    setForm((f: any) => ({ ...f, Misc: updated }));
  };

  const addMisc = () => setForm((f: any) => ({ ...f, Misc: [...f.Misc, ''] }));

  const removeMisc = (index: number) => {
    const updated = form.Misc.filter((_: string, i: number) => i !== index);
    setForm((f: any) => ({ ...f, Misc: updated.length ? updated : [''] }));
  };

  const handleSubmit = () => {
    const record = {
      id: form.id,
      title: form.Title,
      rate: Number(form.Rate),
      max_price: Number(form.MaxPrice),
      max_balloon: Number(form.MaxBalloon),
      min_deposit: Number(form.MinDeposit),
      finance_fee: Number(form.FinanceFee),
      private_sale_fee: Number(form.PrivateSaleFee),
      private_sale_uplift: Number(form.PrivateSaleUplift),
      abn: Number(form.ABN),
      gst: Number(form.GST),
      property: form.Property,
      misc: form.Misc.filter((m: string) => m.trim() !== ''),
      balloon_calc_method: form.BalloonCalcMethod as balloonCalcMethodValues,
      brokerage_calc_method: form.BrokerageCalcMethod as brokerageCalcMethodValues,
    };
    onSave(record);
    fetch('/api/updatelender', {
      method: 'POST',
      body: JSON.stringify(record),
    }).then((res) => res.json()).then((data) => {
      console.log('Lender updated:', data);
    }).catch((error) => {
      console.error('Error updating lender:', error);
    });
  };

  const balloonCalcMethodOptions: balloonCalcMethodValues[] = ['TakesFinal', 'Additional', 'OnTop', '']; 
  const brokerageCalcMethodOptions: brokerageCalcMethodValues[] = ['ExFee', 'IncFee', 'PMTDiff', 'Trains', 'Advance', '']; 

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={initial ? 'Edit Lender' : 'Add Lender'}
      size="lg"
    >
      <Stack>
        <TextInput
          label="Lender"
          value={form.Title}
          onChange={(e) => handleChange('Title', e.currentTarget.value)}
        />

        <Group grow>
          <NumberInput
            label="Rate (%)"
            value={form.Rate}
            onChange={(val) => handleChange('Rate', val)}
            min={0}
            step={0.01}
          />
          <NumberInput
            label="Max Price ($)"
            value={form.MaxPrice}
            onChange={(val) => handleChange('MaxPrice', val)}
            min={0}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Max Balloon (%)"
            value={form.MaxBalloon}
            onChange={(val) => handleChange('MaxBalloon', val)}
            min={0}
            max={100}
          />
          <NumberInput
            label="Finance Fee ($)"
            value={form.FinanceFee}
            onChange={(val) => handleChange('FinanceFee', val)}
            min={0}
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Private Sale Fee ($)"
            value={form.PrivateSaleFee}
            onChange={(val) => handleChange('PrivateSaleFee', val)}
            min={0}
          />
          <NumberInput
            label="Private Sale Uplift (%)"
            value={form.PrivateSaleUplift}
            onChange={(val) => handleChange('PrivateSaleUplift', val)}
            min={0}
            max={100}
          />
        </Group>

        <Group grow>
          <NumberInputWithText
            formattedText={FormatValue('ABN', form.ABN)}
            value={form.gst}
            onIncrement={(val) => handleChange('ABN', val)}
            onDecrement={(val) => handleChange('ABN', val)}
          />

          <NumberInputWithText
            formattedText={FormatValue('GST', form.GST)}
            value={form.gst}
            onIncrement={(val) => handleChange('GST', val)}
            onDecrement={(val) => handleChange('GST', val)}
          />
        </Group>
        <Switch
          label="Property Owner"
          checked={form.Property}
          onChange={(e) => handleChange('Property', e.currentTarget.checked)}
        />

        <Stack gap="xs">
          <Text fw={500}>Misc Conditions</Text>
          {form.Misc.map((item: string, index: number) => (
            <Group key={index}>
              <TextInput
                placeholder="Condition text"
                value={item}
                onChange={(e) => handleMiscChange(index, e.currentTarget.value)}
                flex={1}
              />
              <ActionIcon color="red" variant="light" onClick={() => removeMisc(index)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}
          <Button
            leftSection={<IconPlus size={14} />}
            variant="light"
            onClick={addMisc}
            size="xs"
            w="fit-content"
          >
            Add Condition
          </Button>
        </Stack>
        <Group>
          <Select
            label="Balloon Calculation Method"
            data={balloonCalcMethodOptions.map((val) => ({ value: val, label: val }))}
            value={form.BalloonCalcMethod}
          />            
          <Select
            label="Brokerage Calculation Method"
            data={brokerageCalcMethodOptions.map((val) => ({ value: val, label: val }))}
            value={form.BrokerageCalcMethod}
          />            
        </Group>


        <Button fullWidth onClick={handleSubmit}>
          Save
        </Button>
      </Stack>
    </Modal>
  );
}
