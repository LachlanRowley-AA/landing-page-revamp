'use client';

import { Title, Stack, Container } from '@mantine/core';
import { textContent, textKey } from '@/lib/audienceContent';
import ReactMarkdown from 'react-markdown';

type DynamicTextDisplayProps = {
  type: textKey;
};

export const DynamicTextDisplay = ({ type = 'empty' }: DynamicTextDisplayProps) => {
  const content = textContent[type];

  return (
    <Container size="xl" py="md" w="100%">
      <Stack align="center">
        <Title order={2} ta="center">
          {content.heading}
        </Title>
        <div
          style={{
            textAlign: 'center',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            maxWidth: 800,
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p style={{ marginBottom: '1rem' }}>{children}</p>
              ),
              ul: ({ children }) => (
                <ul
                  style={{
                    listStyleType: 'disc',
                    paddingLeft: '1.5rem',
                    textAlign: 'left',
                    margin: '1rem 0',
                  }}
                >
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '0.5rem' }}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 600 }}>{children}</strong>
              ),
            }}
          >
            {content.body}
          </ReactMarkdown>
        </div>
      </Stack>
    </Container>
  );
};
