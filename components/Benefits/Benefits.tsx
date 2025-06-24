'use client';
import { Box, Card, Container, Flex, Grid, Stack, Text, Group, useMantineTheme } from '@mantine/core';
import {
  IconAlertTriangle,
  IconClockX,
  IconTrendingDown,
  IconCreditCardOff,
  IconArrowRight,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { JumboTitle } from '../JumboTitle/JumboTitle';

type UseCase = {
  icon: ReactNode;
  benefit: string;
  accentColor: string;
};

const USE_CASES: UseCase[] = [
  {
    icon: <IconCreditCardOff size={24} stroke={1.5} />,
    benefit: 'Repayments are calculated over 5 years',
    accentColor: '#01E194',
  },
  {
    icon: <IconAlertTriangle size={24} stroke={1.5} />,
    benefit: 'Only charged on use. No charge if setup but not used',
    accentColor: '#01E194',
  },
  {
    icon: <IconTrendingDown size={24} stroke={1.5} />,
    benefit: 'No setup cost',
    accentColor: '#01E194',
  },
  {
    icon: <IconClockX size={24} stroke={2} />,
    benefit: 'No additional security',
    accentColor: '#01E194',
  },
] as const;

type JumboTitleProps = {
  children: ReactNode;
  order?: number;
  fz?: string;
  style?: React.CSSProperties;
};


const ProblemSolutionCard = ({
  benefit,
  accentColor,
  index = 1,
}: UseCase & {
  index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 * index, ease: 'easeOut' }}
    viewport={{ once: true }}
  >
    <Flex gap="lg" align="stretch">
      {/* Arrow in Gap */}
      <Flex justify="center" align="center" style={{ minWidth: '20px' }}>
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IconArrowRight size={50} color={accentColor} stroke={2} />
        </motion.div>
      </Flex>

      {/* benefit Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ flex: 1 }}
      >
        <Card
          radius="lg"
          p={{base: "sm", md:"xl"}}
          h="100%"
          style={{
            backgroundColor: 'white',
            border: '1px solid #ebebeb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(1, 225, 148, 0.15)';
            e.currentTarget.style.borderColor = '#01E194';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.borderColor = '#ebebeb';
          }}
        >
          <Stack gap="md" h="100%">
            <Text size="xl" c="#333" lh={1.4} fw={500} style={{ flex: 1 }}>
              {benefit}
            </Text>
          </Stack>
        </Card>
      </motion.div>
    </Flex>
  </motion.div>
);

type UseCasesProps = {
  title?: string;
  style?: 'cards' | 'timeline';
  useCases?: UseCase[];
};

export const UseCases = ({
  title = 'Benefits',
  useCases = USE_CASES,
}: UseCasesProps) => {
  const theme = useMantineTheme();
  return(
  <Container
    py={{ base: 40, xs: 60, lg: 80 }}
    fluid
    style={{ backgroundColor: theme.colors.secondary[0] }}
  >
    <Container size="lg" px={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <JumboTitle order={2} fz="md" c="black" ta="center">
          {title}
        </JumboTitle>
      </motion.div>
    </Container>
    
    <Container size="lg" p={0} mt="xl" px={{base: "xs", md: "md"}}>
        <Grid gutter="xl" px={{base: "0px", md: "md"}}>
          {useCases.map((useCase, index) => (
            <Grid.Col key={useCase.benefit} span={{ base: 12 }}>
              <ProblemSolutionCard
                icon={useCase.icon}
                benefit={useCase.benefit}
                accentColor={useCase.accentColor}
                index={index}
              />
            </Grid.Col>
          ))}
        </Grid>
    </Container>
  </Container>
)};