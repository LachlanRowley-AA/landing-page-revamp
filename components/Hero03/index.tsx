'use client';
import { JumboTitle } from '../JumboTitle/JumboTitle';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Container,
  ContainerProps,
  Flex,
  Image,
  Rating,
  Stack,
  Text,
  TextInput,
  Button
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import NextImage from 'next/image';
import classes from './index.module.css';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type ImageItem = { src: string; alt: string };

type Hero03Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string;
  rating?: number;
  ratingLabel?: string;
};

export const Hero03 = ({
  badge = 'Build faster with AI-powered tools',
  title = 'Pay Over Time \n Not Upfont',
  description = 'No financials required, Approvals in 24-28 hours. Credit score safe ',
  ...containerProps
}: Hero03Props) => {
  const searchParams = useSearchParams();
  const search = searchParams.get('p');

  return (
    <Container pos="relative" h="80vh" mah={950} style={{ overflow: 'hidden' }} fluid>
      <Container component="section" h="80vh" mah={950} mx="auto" size="xl" {...containerProps}>
        <Box
          pos="absolute"
          top={0}
          left={0}
          h="100%"
          w="100%"
          className={classes['vertical-backdrop']}
        />
        <Flex h="100%" align="center" pos="relative" justify="center">
          <Stack
            pt={{ base: 'xl', sm: 0 }}
            maw="var(--mantine-breakpoint-md)"
            align="center"
            gap="lg"
            style={{ zIndex: 1 }}
          >
            {badge && (
              <Suspense>

              <Image
                variant="default"
                p="md"
                bg="var(--mantine-color-body)"
                src={`/${search || 'default'}/logo_black.png`}
                mb="lg"
                style={{ textTransform: 'none' }}
              />
              </Suspense>

            )}
            <motion.div
              initial={{ opacity: 0.0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <JumboTitle ta="center" order={1} fz="lg" style={{ textWrap: 'balance' }}>
                {title}
              </JumboTitle>
            </motion.div>
            <Text
              ta="center"
              maw="var(--mantine-breakpoint-xs)"
              fz="xl"
              style={{ textWrap: 'balance' }}
            >
              {description}
            </Text>
            <Button
              size="lg"
              bg="rgba(1, 225, 148, 0.2)"
              mt="xl"
              c="#01E194"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#01E194';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(1, 225, 148, 0.2)';
                e.currentTarget.style.color = '#01E194';
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Container>
  );
};