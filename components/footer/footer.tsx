'use client';

import { Box, Container, Flex, Image, Text } from '@mantine/core';
import NextImage from 'next/image';
import classes from './footer.module.css';

export const Footer01 = () => (
  <Container component="footer" className={classes.container} fluid>
    <Container
      size="xl"
      px={0}
      pt={5}
      mt={0}
    >
      <Flex justify={{ sm: 'space-between' }} wrap="wrap" gap="xl">
        <Box maw={{ sm: 300 }}>
          <Text mt="md" size="md" c="{var(--mantine-colors-dark)}">
            ABN: 84 636 666 709
          </Text>
          <Text mt="xs" size="md" c="{var(--mantine-colors-dark)}">
            © 2025 Asset Alley. All rights reserved.
          </Text>
        </Box>
      </Flex>
    </Container>
  </Container>
);