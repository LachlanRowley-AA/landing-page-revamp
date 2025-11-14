'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Anchor, Box, Container, Flex, Stack, Text } from '@mantine/core';

const ToolCell = ({
  toolName,
  description,
  link,
}: {
  toolName: string;
  description: string;
  link: string;
}) => {
  const router = useRouter();
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <Box
        p={{ base: 'md', md: 'lg' }}
        w={{ base: '100%', md: '33%' }}
        onClick={() => router.push(link)}
      >
        <Text fz="lg" fw="bold" component="blockquote" mb={4}>
          {toolName}
        </Text>
        <Text fz="md" component="blockquote">
          {description}
        </Text>
      </Box>
    </Link>
  );
};

export default function PageTool() {
  return <div>Tool Page</div>;
}
