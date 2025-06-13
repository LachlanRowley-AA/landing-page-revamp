'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import { Box, Container, Stack, Text, rem, Card, Accordion, Group, ThemeIcon, useMantineTheme, Button } from '@mantine/core';
import { motion } from 'motion/react';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconCreditCard, 
  IconClock, 
  IconFileText, 
  IconShield, 
  IconTrendingUp, 
  IconRocket 
} from '@tabler/icons-react';

const faqData = [
  {
    question: "Will this impact my credit file?",
    answer: "No. To confirm your eligibility, there will be no impact to your credit file.",
    icon: IconCreditCard,
    color: "#01E194"
  },
  {
    question: "Can I pay off early?",
    answer: "Yes, you can.",
    icon: IconRocket,
    color: "#01E194"
  },
  {
    question: "Do you look at financials?",
    answer: "No. We are only looking at your business bank statements",
    icon: IconFileText,
    color: "#01E194"
  },
  {
    question: "Is this a secured loan?",
    answer: "No. This is an unsecured loan.",
    icon: IconShield,
    color: "#01E194"
  },
  {
    question: "How do the rates compare to a major bank?",
    answer: "The rates are very similar to an unsecured bank overdraft. In some cases, even better!",
    icon: IconTrendingUp,
    color: "#01E194"
  },
  {
    question: "How long does this take?",
    answer: "Normally 2-3 business days.",
    icon: IconClock,
    color: "#01E194"
  }
];

const FAQItem = ({ 
  question, 
  answer, 
  icon: Icon, 
  color, 
  index 
}: { 
  question: string; 
  answer: string; 
  icon: any; 
  color: string; 
  index: number; 
}) => (
  <motion.div
    initial={{ opacity: 0.0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeInOut', delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Card 
      padding="xl" 
      radius="lg" 
      bg="rgba(255, 255, 255, 0.20)"
      style={{ 
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        cursor: "default"
      }}
      className="faq-card"
    >
      <Group align="flex-start" gap="lg">
        <ThemeIcon
          size={48}
          radius="md"
          variant="light"
          color={color}
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            border: `1px solid ${color}40`,
            minWidth: 48
          }}
        >
          <Icon size={24} color={color} />
        </ThemeIcon>
        
        <Stack gap="sm" style={{ flex: 1 }}>
          <Text 
            size="lg" 
            fw={600} 
            c="white"
            style={{ lineHeight: 1.3 }}
          >
            {question}
          </Text>
          <Text 
            size="md" 
            c="rgba(255, 255, 255, 0.8)"
            style={{ lineHeight: 1.5 }}
          >
            {answer}
          </Text>
        </Stack>
      </Group>
    </Card>
    
    <style jsx>{`
      .faq-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(1, 225, 148, 0.1);
        border-color: rgba(1, 225, 148, 0.2);
      }
    `}</style>
  </motion.div>
);

const AccordionFAQ = () => {
  return (
    <Accordion
      variant="separated"
      radius="lg"
      styles={{
        root: {
          backgroundColor: 'transparent',
        },
        item: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          '&[data-active]': {
            backgroundColor: 'rgba(1, 225, 148, 0.05)',
            borderColor: 'rgba(1, 225, 148, 0.2)',
          },
        },
        control: {
          padding: rem(20),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
        },
        label: {
          color: 'white',
          fontSize: rem(18),
          fontWeight: 600,
        },
        content: {
          padding: `0 ${rem(20)} ${rem(20)}`,
        },
        panel: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: rem(16),
          lineHeight: 1.6,
        },
        chevron: {
          color: '#01E194',
          '&[data-rotate]': {
            transform: 'rotate(180deg)',
          },
        },
      }}
    >
      {faqData.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut', delay: index * 0.08 }}
          viewport={{ once: true }}
        >
          <Accordion.Item value={`faq-${index}`}>
            <Accordion.Control>
              <Group gap="md">
                <ThemeIcon
                  size={32}
                  radius="md"
                  variant="light"
                  color={faq.color}
                  style={{
                    background: `linear-gradient(135deg, ${faq.color}40, ${faq.color}40)`,
                    border: `1px solid ${faq.color}40`,
                  }}
                >
                  <faq.icon size={18} color={faq.color} />
                </ThemeIcon>
                {faq.question}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>{faq.answer}</Accordion.Panel>
          </Accordion.Item>
        </motion.div>
      ))}
    </Accordion>
  );
};

export const FAQ = ({ variant = 'cards' }: { variant?: 'cards' | 'accordion' }) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  return (
    <Box
      bg="black"
      py={{ base: rem(60), md: rem(100) }}
      px={{ base: "md", md: "xl" }}
      style={{ 
        minHeight: "100vh",
        background: "radial-gradient(ellipse at center, rgba(1, 225, 148, 0.03) 0%, black 20%)"
      }}
    >
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          <Stack align="center" gap="lg" mb={{ base: rem(40), md: rem(60) }}>
            <JumboTitle 
              order={2} 
              fz="md"
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="white"
              fw={700}
            >
              Frequently Asked
            </JumboTitle>
            <JumboTitle 
              order={2} 
              fz="md" 
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="#01E194"
              fw={700}
              mb="md"
            >
              Questions
            </JumboTitle>
            <Text 
              size="lg" 
              c="rgba(255, 255, 255, 0.7)" 
              ta="center"
              maw={600}
              style={{ lineHeight: 1.6 }}
            >
              Get quick answers to common questions about our finance options and application process.
            </Text>
          </Stack>
        </motion.div>
        
        {variant === 'accordion' ? (
          <AccordionFAQ />
        ) : (
          <Stack gap="lg">
            {faqData.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                icon={faq.icon}
                color={faq.color}
                index={index}
              />
            ))}
          </Stack>
        )}
        
        <motion.div
          initial={{ opacity: 0.0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            size="xl"
            radius="lg"
            variant="light"
            fullWidth
            styles={{
              root: {
                background: "linear-gradient(135deg, rgba(1, 225, 148, 0.2) 0%, rgba(1, 225, 148, 0.2) 100%)",
                border: "1px solid rgba(1, 225, 148, 0.2)",
                padding: rem(24),
                height: "auto",
                marginTop: rem(40),
                transition: "all 0.3s ease",
                '&:hover': {
                  background: "rgba(1, 225, 148, 0.3)",
                  transform: "translateY(-2px)",
                }
              },
              inner: {
                flexDirection: "column",
                gap: rem(12),
              },
              label: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: rem(12),
                whiteSpace: "normal"
              }
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(1, 225, 148, 0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(1, 225, 148, 0.2)";
            }}

          >
            <Stack align="center" gap="md">
              <Text size="xl" fw={600} c="#01E194" ta="center">
                Still have questions?
              </Text>
                <Text size="md" c="rgba(255, 255, 255, 0.8)" w="100%" ta="center" style={{wordWrap: "break-word", }}>
                Our team is here to help you understand how we can work for your specific situation.
                </Text>
            </Stack>
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};