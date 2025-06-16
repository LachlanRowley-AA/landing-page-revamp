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
import { motion } from 'motion/react';
import classes from './index.module.css';
import { Suspense, useEffect, useState } from 'react';

type ImageItem = { src: string; alt: string };

type Hero03Props = ContainerProps & {
  avatarItems?: ImageItem[];
  badge?: string;
  title?: string;
  description?: string;
  rating?: number;
  ratingLabel?: string;
  partner?: string;
};

export const Hero03 = ({
  badge = 'Build faster with AI-powered tools',
  title = 'Pay Over Time \n Not Upfont',
  description = 'No financials required, Approvals in 24-28 hours. Credit score safe ',
  partner,
  ...containerProps
}: Hero03Props) => {
  const [has_black, setBlack] = useState(false);
  const [has_white, setWhite] = useState(false);

  useEffect(() => {
    if (!partner) {return};
    console.log(partner);
    fetch(`/${partner}/logo_black.png`, { method: 'HEAD' })
      .then((res) => {
        const contentLength = res.headers.get('content-length');
        const isValidImage = res.ok && contentLength && parseInt(contentLength, 10) > 0;
        if (isValidImage) {
          setBlack(true);
          console.log(res);
        } else {
          // If black logo not found, check white logo
          console.log('not found')
          fetch(`/${partner}/logo_white.png`, { method: 'HEAD' })
            .then((res) => {
              const contentLength = res.headers.get('content-length');
              const isValidImage = res.ok && contentLength && parseInt(contentLength, 10) > 0;
              if (isValidImage) {
                setWhite(true);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        // Optional: fallback to white if black request errors out
        fetch(`/${partner}/logo_white.png`, { method: 'HEAD' })
          .then((res) => {
            if (res.ok) {
              setWhite(true);
            }
          })
          .catch(() => {});
      });
  }, [partner]);

  // Determine if we should use dark theme (black background, white text)
  const useDarkTheme = has_white && !has_black;

  return (
    <Container
      pos="relative"
      h="80vh"
      mah={950}
      style={{
        overflow: 'hidden',
        backgroundColor: useDarkTheme ? 'black' : undefined,
      }}
      fluid
    >
      <Container
        component="section"
        h="80vh"
        mah={950}
        mx="auto"
        size="xl"
        {...containerProps}
      >
        <Box
          pos="absolute"
          top={0}
          left={0}
          h="100%"
          w="100%"
        />
        <Flex h="100%" align="center" pos="relative" justify="center">
          <Stack
            pt={{ base: 'xl', sm: 0 }}
            maw="var(--mantine-breakpoint-md)"
            align="center"
            gap="lg"
            style={{ zIndex: 1 }}
          >
            {badge && partner && (has_black || has_white) && (
              <Suspense>
                <Image
                  variant="default"
                  p="md"
                  bg={useDarkTheme ? 'rgba(255, 255, 255, 0)' : 'var(--mantine-color-body)'}
                  src={
                    has_black
                      ? `/${partner}/logo_black.png`
                      : `/${partner}/logo_white.png`
                  }
                  mb="lg"
                  style={{
                    textTransform: 'none',
                  }}
                />
              </Suspense>
            )}

            <motion.div
              initial={{ opacity: 0.0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <JumboTitle
                ta="center"
                order={1}
                fz="lg"
                style={{
                  textWrap: 'balance',
                  color: useDarkTheme ? 'white' : undefined,
                }}
              >
                {title}
              </JumboTitle>
            </motion.div>

            <Text
              ta="center"
              maw="var(--mantine-breakpoint-xs)"
              fz="xl"
              style={{
                textWrap: 'balance',
                color: useDarkTheme ? 'white' : undefined,
              }}
            >
              {description}
            </Text>

            <Button
              size="lg"
              bg={useDarkTheme ? 'white' : 'rgba(1, 225, 148, 0.2)'}
              mt="xl"
              c={useDarkTheme ? 'black' : '#01E194'}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = useDarkTheme ? '#ccc' : '#01E194';
                e.currentTarget.style.color = useDarkTheme ? 'black' : 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = useDarkTheme ? 'white' : 'rgba(1, 225, 148, 0.2)';
                e.currentTarget.style.color = useDarkTheme ? 'black' : '#01E194';
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