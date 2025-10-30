'use client';

import { useContext, useState } from 'react';
import { IconCar, IconCarOff, IconSparkles } from '@tabler/icons-react';
import { Card, Grid, GridCol, Group, Radio, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import { CalculatorContext } from '../Context';
import { useCriteria } from '../Criteria/CriteriaHandler';
import { useDisplay } from '../DisplayContext';

interface PrivateSaleSliderProps {
  index: number;
}

export default function VehicleAgeMenu({ index }: PrivateSaleSliderProps) {
  const theme = useMantineTheme();
  const displayCtx = useDisplay();
  const { isMobile } = displayCtx;
  const ctx = useContext(CalculatorContext);
  const criteria = useCriteria();

  if (!criteria || !ctx) return null;

  const { setVehicleAgeToggle } = ctx;

  const data = [
    {
      text: 'Less than 3 years old',
      icon: <IconSparkles size={28} stroke={1.5} />,
      val: false,
    },
    {
      text: '3 or more years old',
      icon: <IconCar size={28} stroke={1.5} />,
      val: true,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>(data[0].text);

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
            setVehicleAgeToggle(item.val);
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
        Vehicle Age
      </Title>

      <Radio.Group value={selectedOption} onChange={setSelectedOption}>
        <Grid gutter={{ base: 'xs', md: 'xs' }}>{cards}</Grid>
      </Radio.Group>
    </Stack>
  );
}
