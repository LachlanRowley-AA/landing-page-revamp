'use client';

import { Title, Stack, Container } from '@mantine/core';
import { textContent, textKey } from '@/lib/audienceContent';
import ReactMarkdown from 'react-markdown';

type DynamicTextDisplayProps = {
  type: textKey;
  darkMode?: boolean;
};

export const DynamicTextDisplay = ({ type = 'empty', darkMode=false }: DynamicTextDisplayProps) => {
  const content = textContent[type];

  return (
    <Container size="xl" py={0} w="100%">
      <Stack align="center">
        <div
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            lineHeight: '2',
            maxWidth: 1300,
            fontFamily: 'fantasy',
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p style={{ marginBottom: '1rem', color: darkMode ? '#000000': "#FFFFFF" }}>{children}</p>
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
