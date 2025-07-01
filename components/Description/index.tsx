'use client';

import { Title, Stack, Container, Text, Highlight, Card, Box, Mark } from '@mantine/core';
import { textContent, textKey } from '@/lib/audienceContent';

type DynamicTextDisplayProps = {
  type: textKey;
};

export const DynamicTextDisplay = ({ type = 'empty' }: DynamicTextDisplayProps) => {
  const content = textContent[type];
  if (type === 'empty') return null;

  return (
    <Box
      w="100%"
      py={80}
      px="lg"
      style={{
        background: 'linear-gradient(to bottom, #0f0f0f, #1a1a1a)',
        color: 'white',
      }}
    >
      <Container size="lg">
        <Stack align="center">
          <Text ta="center" fw={500} fz={{ base: 'xl', sm: '2xl', md: '30px' }}>
            <Text c="#01E194" span inherit>Building a brand </Text> that truly represents you shouldn’t mean compromising on quality,
            so you shouldn't let a limited budget hold you back. We're here to help you get a brand
            worth owing.
         </Text>
          <Title
            fw={800}
            fz={{ base: 'xl', sm: '2xl', md: '30px'}}           
          >
            This is an <Text c="#01E194" span inherit> investment in yourself </Text>
          </Title>
        </Stack>
      </Container>
    </Box>
  );
};
