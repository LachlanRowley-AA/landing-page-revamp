'use client';
import { Box, Card, Container, Flex, Grid, Stack, Text, Group } from '@mantine/core';
import {
  IconAlertTriangle,
  IconClockX,
  IconTrendingDown,
  IconCreditCardOff,
  IconArrowRight,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

type UseCase = {
  icon: ReactNode;
  problem: string;
  solution: string;
  accentColor: string;
};

const USE_CASES: UseCase[] = [
  {
    icon: <IconCreditCardOff size={24} stroke={1.5} />,
    problem: 'Supplier won\'t provide an account due to your track record',
    solution: 'Get materials immediately without supplier approval',
    accentColor: '#01E194',
  },
  {
    icon: <IconAlertTriangle size={24} stroke={1.5} />,
    problem: 'Supplier only partially approved your account',
    solution: 'Access full funding regardless of their restrictions',
    accentColor: '#01E194',
  },
  {
    icon: <IconTrendingDown size={24} stroke={1.5} />,
    problem: 'Supplier is capping your account limit too low',
    solution: 'Break through barriers and fund larger projects',
    accentColor: '#01E194',
  },
  {
    icon: <IconClockX size={24} stroke={1.5} />,
    problem: 'Waiting on outstanding invoices to be paid',
    solution: 'Keep projects moving while waiting for payments',
    accentColor: '#01E194',
  },
] as const;

type JumboTitleProps = {
  children: ReactNode;
  order?: number;
  fz?: string;
  style?: React.CSSProperties;
};

const JumboTitle = ({ children, fz = 'md', style = {} }: JumboTitleProps) => (
  <Text
    size={fz === 'md' ? '3rem' : fz}
    fw={700}
    ta="center"
    mb="xl"
    c="#000"
    style={{ textWrap: 'balance', ...style }}
  >
    {children}
  </Text>
);

const ProblemSolutionCard = ({
  icon,
  problem,
  solution,
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
      {/* Problem Box */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ flex: 1 }}
      >
        <Card
          radius="lg"
          p={{base: "xs", md:"xl"}}
          h="100%"
          style={{
            backgroundColor: 'white',
            border: '1px solid #ebebeb',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.15)';
            e.currentTarget.style.borderColor = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.borderColor = '#ebebeb';
          }}
        >
          <Stack gap="md" h="100%">
            <Group gap="sm">
              <Flex
                w={32}
                h={32}
                justify="center"
                align="center"
                style={{
                  backgroundColor: '#ff6b6b15',
                  borderRadius: '6px',
                  color: '#ff6b6b',
                }}
              >
                {icon}
              </Flex>
              <Text size="sm" fw={500} c="#ff6b6b" tt="uppercase">
                Problem
              </Text>
            </Group>
            <Text size="md" c="#333" lh={1.4} style={{ flex: 1 }}>
              {problem}
            </Text>
          </Stack>
        </Card>
      </motion.div>

      {/* Arrow in Gap */}
      <Flex justify="center" align="center" style={{ minWidth: '20px' }}>
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IconArrowRight size={28} color={accentColor} stroke={2} />
        </motion.div>
      </Flex>

      {/* Solution Box */}
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
            <Group gap="sm">
              <Flex
                w={32}
                h={32}
                justify="center"
                align="center"
                style={{
                  backgroundColor: '#01E19415',
                  borderRadius: '6px',
                  color: '#01E194',
                }}
              >
                <Box w={8} h={8} style={{ backgroundColor: '#01E194', borderRadius: '50%' }} />
              </Flex>
              <Text size="sm" fw={500} c="#01E194" tt="uppercase">
                Solution
              </Text>
            </Group>
            <Text size="md" c="#333" lh={1.4} fw={500} style={{ flex: 1 }}>
              {solution}
            </Text>
          </Stack>
        </Card>
      </motion.div>
    </Flex>
  </motion.div>
);

const Timeline = ({ useCases }: { useCases: UseCase[] }) => (
  <Container size="md" px={0}>
    {useCases.map((useCase, index) => (
      <motion.div
        key={useCase.problem}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 * index }}
        viewport={{ once: true }}
      >
        <Flex gap="xl" mb={index < useCases.length - 1 ? "xl" : 0}>
          {/* Timeline dot */}
          <Box style={{ position: 'relative', minWidth: '40px' }}>
            <Flex
              w={40}
              h={40}
              justify="center"
              align="center"
              style={{
                backgroundColor: useCase.accentColor,
                borderRadius: '50%',
                color: 'white',
              }}
            >
              {useCase.icon}
            </Flex>
            {index < useCases.length - 1 && (
              <Box
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '40px',
                  width: '2px',
                  height: '60px',
                  backgroundColor: '#ebebeb',
                  transform: 'translateX(-50%)',
                }}
              />
            )}
          </Box>

          {/* Content */}
          <Box style={{ flex: 1, paddingBottom: index < useCases.length - 1 ? '40px' : '0' }}>
            <Text size="lg" fw={600} mb="xs" c="#000">
              Problem: {useCase.problem}
            </Text>
            <Group gap="sm" mb="sm">
              <Text size="sm" c="#01E194" fw={500}>
                Our Solution:
              </Text>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <IconArrowRight size={16} color="#01E194" />
              </motion.div>
            </Group>
            <Text size="md" c="#666" lh={1.5}>
              {useCase.solution}
            </Text>
          </Box>
        </Flex>
      </motion.div>
    ))}
  </Container>
);

type UseCasesProps = {
  title?: string;
  style?: 'cards' | 'timeline';
  useCases?: UseCase[];
};

export const UseCases = ({
  title = 'Common Challenges We Solve',
  style = 'cards',
  useCases = USE_CASES,
}: UseCasesProps) => (
  <Container
    py={{ base: 40, xs: 60, lg: 80 }}
    fluid
    style={{ backgroundColor: '#f6f6f6' }}
  >
    <Container size="lg" px={0}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <JumboTitle order={2} fz="md">
          {title}
        </JumboTitle>
      </motion.div>
    </Container>
    
    <Container size="lg" p={0} mt="xl" px={{base: "xs", md: "md"}}>
      {style === 'timeline' ? (
        <Timeline useCases={useCases} />
      ) : (
        <Grid gutter="xl" px={{base: "0px", md: "md"}}>
          {useCases.map((useCase, index) => (
            <Grid.Col key={useCase.problem} span={{ base: 12 }}>
              <ProblemSolutionCard
                icon={useCase.icon}
                problem={useCase.problem}
                solution={useCase.solution}
                accentColor={useCase.accentColor}
                index={index}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  </Container>
);