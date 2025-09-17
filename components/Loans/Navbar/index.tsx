'use client';

import { Container, Group, Image } from '@mantine/core';

export default function Navbar() {
  return (
    <header
      style={{
        borderBottom: '1px solid #e9ecef',
        padding: '0.5rem 0',
        backgroundColor: 'white',
      }}
    >
      <Container size="lg">
        <Group justify="space-between" align="center">
          <Image
            src="/Default/logo_black.png"
            alt="Company Logo"
            height={40}
            fit="contain"
          />
        </Group>
      </Container>
    </header>
  );
}
