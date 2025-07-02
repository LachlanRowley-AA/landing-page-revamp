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
          {/* <Text ta="center" fw={500} fz={{ base: 'xl', sm: '2xl', md: '30px' }}>
            <Text c="#01E194" span inherit>Building a brand </Text> that truly represents you shouldn’t mean compromising on quality,
            so you shouldn't let a limited budget hold you back. We're here to help you get a brand
            worth owning.
         </Text> */}
           <Text ta="center" fw={500} fz={{ base: 'xl', sm: '2xl', md: '30px' }}>
          Build your desired brand <Text inherit span fw={800}> without cutting corners. </Text>
          </Text>
           <Text ta="center" fw={500} fz={{ base: 'xl', sm: '2xl', md: '30px' }}>
           Don't let budget hold you back from <Text inherit span fw={800}> making the impact you want. </Text>
          </Text>
           <Text ta="center" fw={500} fz={{ base: 'xl', sm: 'h2', md: '30px' }}>
          Allow us to help you <Text inherit span fw={800}>build a brand worth owning. </Text>
          </Text>

          <Title
            fw={800}
            fz={{ base: 'h2', sm: '2xl', md: '30px'}}   
            ta="center"        
          >
            This is an <Text c="#01E194" span inherit> investment in yourself. </Text>
          </Title>
        </Stack>
      </Container>
    </Box>
  );
};
