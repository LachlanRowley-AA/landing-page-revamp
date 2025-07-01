'use client';

import { Title, Stack, Container, Text, Highlight, Card } from '@mantine/core';
import { textContent, textKey } from '@/lib/audienceContent';
import ReactMarkdown from 'react-markdown';

type DynamicTextDisplayProps = {
  type: textKey;
  darkMode?: boolean;
};

export const DynamicTextDisplay = ({ type = 'empty', darkMode=false }: DynamicTextDisplayProps) => {
  const content = textContent[type];
  if(type === 'empty') {
    return(<></>);
  }
  return (
      <Stack>
        <Text ta="center" fz="xl" fw={600}>Build your desired brand without cutting corners.</Text>
        <Text ta="center" fz="xl" fw={600}>Don't let budget hold you back from making the impact you want.</Text>
        <Text ta="center" fz="xl" fw={600}>Allow us to help you build a brand worth owning.</Text>
        <Highlight
          highlight="investment in yourself"
          color="#01E194"
          fw={700}
          size="xl"
          ta="center"
        >
          This is an investment in yourself
        </Highlight>
      </Stack>
  );
};
