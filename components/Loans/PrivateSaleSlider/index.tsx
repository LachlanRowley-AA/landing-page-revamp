'use context';

import { useContext, useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconBuilding, IconUser } from '@tabler/icons-react';
import {
  Card,
  Grid,
  GridCol,
  Group,
  Radio,
  Slider,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContext } from '../Context';
import { Criteria, useCriteria } from '../Criteria/CriteriaHandler';
import { useDisplay } from '../DisplayContext';

// function  setLoan_InterestRate(
//     isPrivateSale ? calculator.Rate + calculator.PrivateSaleUplift : calculator.Rate
//   );

interface PrivateSaleSliderProps {
  index: number;
}
export default function PrivateSaleSlider({ index }: PrivateSaleSliderProps) {
  const ctx = useContext(CalculatorContext);
  const criteria = useCriteria();
  if (!criteria) {
    return;
  }
  if (!ctx) {
    return;
  }
  const { setLoanInterestRate, setIsPrivateSale } = ctx;
  const calculator = criteria[index];

  const theme = useMantineTheme();

  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;

  function toggleIsPrivateSale(value: boolean) {
    setIsPrivateSale(value);
    setLoanInterestRate(value ? calculator.Rate + calculator.PrivateSaleUplift : calculator.Rate);
  }

  const data = [
    {
      text: 'Private Sale',
      icon: <IconUser size={28} stroke={1.5} />,
      val: true,
    },
    {
      text: 'Dealership',
      icon: <IconBuilding size={28} stroke={1.5} />,
      val: false,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>(data[1].text);

  const cards = data.map((item) => {
    const isSelected = selectedOption === item.text;
    return (
      <GridCol span={6} key={item.text}>
        <Card
          withBorder
          shadow={isSelected ? 'md' : 'xs'}
          radius="lg"
          padding="xs"
          style={{
            cursor: 'pointer',
            borderColor: isSelected ? theme.colors.blue[6] : theme.colors.gray[3],
            backgroundColor: isSelected ? theme.colors.blue[0] : theme.white,
            transition: 'all 150ms ease',
          }}
          onClick={() => {
            setSelectedOption(item.text);
            toggleIsPrivateSale(item.val);
          }}
          h="100%"
        >
          <Group gap="xs" align="center" wrap="nowrap" h="100%">
            {item.icon}
            <Text fw={isSelected ? 700 : 600} c={isSelected ? 'blue' : 'dark'}>
              {item.text}
            </Text>
          </Group>
        </Card>
      </GridCol>
    );
  });

  return (
    <Stack gap={0}>
      <Title
        fz="xl"
        ta="center"
        style={{ textWrap: 'balance' }}
        c={{ base: 'black', md: 'black' }}
        fw={600}
        pb="xs"
      >
        Sale Type
      </Title>

      <Radio.Group value={selectedOption} onChange={setSelectedOption}>
        <Grid gutter={{ base: 'xs', md: 'xs' }}>{cards}</Grid>
      </Radio.Group>
    </Stack>
  );
}
