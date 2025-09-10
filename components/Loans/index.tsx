'use client';

import { useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconChevronRight } from '@tabler/icons-react';
import { Button, Card, Container, Divider, Group, Image, Stack, Switch, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { JumboTitle } from '@/components/JumboTitle/JumboTitle';
import BalloonSlider from './BalloonSlider';
import { CalculatorContextProvider } from './Context';
import CriteriaDisplay from './Criteria/CriteriaDisplay';
import { CriteriaHandler } from './Criteria/CriteriaHandler';
import Slider from './Slider';

interface LoanProps {
  calculatorIndex?: number;
}
export function Loans({ calculatorIndex }: LoanProps) {
  const Header = (
    <Group align="center" justify="center" mb="md">
      <Image src="/Default/logo_black.png" maw={{ base: '25vw', md: '8vw' }} py={0} my={0} />
      <JumboTitle order={2} ta="center" style={{ textWrap: 'balance' }} fw={700} pb="xs">
        Vehicle Finance Calculator
      </JumboTitle>
    </Group>
  );
  const [privateChecked, setPrivateChecked] = useState(false);

  return (
    <CalculatorContextProvider>
      <Container size="lg" py="xl" px="xs">
        <Card
          shadow="md"
          radius="xl"
          withBorder
          p={{ base: 'md', md: 'xl' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {Header}

          <Divider my="sm" />

          <Stack gap="xs">
            <CriteriaHandler>
              <CriteriaDisplay index={calculatorIndex ? calculatorIndex : 0} />
            </CriteriaHandler>
            <Divider />
            <Group justify="center">
              <Text my="">Dealership</Text>
              <Switch
                width="500px"
                size='xl'
                styles={{
                  track: {
                    backgroundColor: 'lightblue',
                    width: '300px',
                  },
                }}
                onClick={((event) => setPrivateChecked(event.currentTarget.checked))}
                c="red"
                checked={privateChecked}
                thumbIcon={
                  privateChecked ? (
                    <IconArrowRight size={20} color="green" />
                  ) : (
                    <IconArrowLeft size={20} color='green'/>
                  )
                }
              />
              <Text>Private Sale</Text>
            </Group>
            <Slider />
            <BalloonSlider />
          </Stack>

          <Divider my="sm" />

          <Group justify="flex-end" mt="md">
            <Button radius="xl" rightSection={<IconChevronRight size={18} />}>
              Calculate
            </Button>
          </Group>
        </Card>
      </Container>
    </CalculatorContextProvider>
  );
}

export default Loans;
