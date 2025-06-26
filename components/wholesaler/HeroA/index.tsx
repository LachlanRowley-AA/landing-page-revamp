'use client';
import { JumboTitle } from '../../JumboTitle/JumboTitle';
import {
  Box,
  Container,
  ContainerProps,
  Flex,
  Image,
  Stack,
  Text,
  Button,
  Loader,
  Center
} from '@mantine/core';
import { motion } from 'motion/react';
import classes from './index.module.css';
import { Suspense, useEffect, useState } from 'react';

type ImageItem = { src: string; alt: string };

type HeroAProps = ContainerProps & {
  avatarItems?: ImageItem[];
  titles?: string[];
  description?: string;
  rating?: number;
  ratingLabel?: string;
  partner?: string;
  preloadedData?: {
    has_black: boolean;
    has_white: boolean;
  };
};


export const HeroA = ({
  titles = ['Zero Risk', 'Zero Change', 'More Sales'],
  description = 'No financials required, Approvals in 24-28 hours. Credit score safe ',
  partner,
  preloadedData,
  ...containerProps
}: HeroAProps) => {
  // Use preloaded data if available, otherwise fall back to loading
  const [has_black, setBlack] = useState(preloadedData?.has_black || false);
  const [has_white, setWhite] = useState(preloadedData?.has_white || false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    else {
      console.log('section not found');
    }
  };

  useEffect(() => {
    // If we have preloaded data, use it and skip the API calls
    if (preloadedData) {
      setBlack(preloadedData.has_black);
      setWhite(preloadedData.has_white);
      return;
    }

    // Fallback: do the API calls if no preloaded data (shouldn't happen in normal flow)
    const checkLogos = async () => {
      if (!partner) return;

      console.log(partner);
      
      try {
        const blackResponse = await fetch(`/${partner}/logo_black.png`, { method: 'HEAD' });
        const contentLength = blackResponse.headers.get('content-length');
        const isValidBlackImage = blackResponse.ok && contentLength && parseInt(contentLength, 10) > 0;
        
        if (isValidBlackImage) {
          setBlack(true);
        } else {
          try {
            const whiteResponse = await fetch(`/${partner}/logo_white.png`, { method: 'HEAD' });
            const whiteContentLength = whiteResponse.headers.get('content-length');
            const isValidWhiteImage = whiteResponse.ok && whiteContentLength && parseInt(whiteContentLength, 10) > 0;
            
            if (isValidWhiteImage) {
              setWhite(true);
            }
          } catch (error) {
            console.log('White logo check failed:', error);
          }
        }
      } catch (error) {
        console.log('Logo check failed:', error);
      }
    };

    checkLogos();
  }, [partner, preloadedData]);

  // Determine if we should use dark theme (black background, white text)
  const useDarkTheme = has_white && !has_black;

  return (
    <Container
      pos="relative"
      h="80vh"
      mah={950}
      style={{
        overflow: 'hidden',
        backgroundColor: useDarkTheme ? 'black' : 'var(--mantine-color-body)',
      }}
      fluid
    >
      <Container
        component="section"
        mx="auto"
        size="xl"
        {...containerProps}
        mt={{base: 0, md: 0}}
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
            pt={{ base: 'xs', sm:90 }}
            maw="var(--mantine-breakpoint-md)"
            align="center"
            gap="lg"
            style={{ zIndex: 1 }}
          >
            {partner && (has_black || has_white) && (
              <Suspense>
                <Image
                  variant="default"
                  p={0}
                  bg={useDarkTheme ? 'rgba(255, 255, 255, 0)' : 'var(--mantine-color-body)'}
                  src={
                    has_black
                      ? `/${partner}/logo_black.png`
                      : `/${partner}/logo_white.png`
                  }
                  mb={{base: 0, md:100}}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)} // Consider loaded even on error
                  style={{
                    textTransform: 'none',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  maw={{base: "100vw", md:"50vw"}}
                />
              </Suspense>
            )}

            {!partner && (
              <Suspense>
                <Image
                  variant="default"
                  p="md"
                  bg={useDarkTheme ? 'rgba(255, 255, 255, 0)' : 'var(--mantine-color-body)'}
                  src={`/Default/logo_black.png`}
                  mb="lg"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  style={{
                    textTransform: 'none',
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                  maw={{base: "100vw", md:"50vw"}}
                />
              </Suspense>
            )}

            <motion.div
              initial={{ opacity: 0.0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              {titles.map(i => 
              <JumboTitle
                key={i}
                ta="center"
                order={1}
                fz="lg"
                style={{
                  textWrap: 'balance',
                  color: useDarkTheme ? 'white' : 'var(--mantine-color-black)',
                  textAlign: 'left'
                }}
              >
                {i}
              </JumboTitle>
              )}
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
              bg={useDarkTheme ? 'white' : 'rgba(1, 225, 148, 0.8)'}
              mt="xl"
              c={useDarkTheme ? 'black' : 'white'}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = useDarkTheme ? '#ccc' : '#01E194';
                e.currentTarget.style.color = useDarkTheme ? 'black' : 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = useDarkTheme ? 'white' : 'rgba(1, 225, 148, 0.8)';
                e.currentTarget.style.color = useDarkTheme ? 'black' : 'white';
              }}
              onClick={(e:any)=>{e.preventDefault;scrollToSection('footer')}}
            >
              Get Started
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Container>
  );
};