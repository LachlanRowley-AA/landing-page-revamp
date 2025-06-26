'use client'
import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "motion/react";
import { Button, Container, Stack, Text, Title, Group } from "@mantine/core";

function HeroB() {
  const [titleNumber, setTitleNumber] = useState(0);
  const previousTitle = useRef<number>(0);
  
  const titles = useMemo(
    () => ["Zero Risk", "Zero Admin", "Zero Friction", "More Sales"],
    []
  );
  
  const longestString: string = titles.reduce((a, b) => (a.length > b.length ? a : b), "");
  
  // Generate particles once and memoize them
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5,
      animationDuration: 3 + Math.random() * 4
    }));
  }, []); // Empty dependency array means this only runs once
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      previousTitle.current = titleNumber;
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);
  
  return (
    <Container size="xl" px={0}>
      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <Group align="flex-start" wrap="nowrap">
          <div style={{ flex: 1 }}>
            <Stack 
              gap="xl" 
              py="xl" 
              px={{ base: 0, md: "xl" }}
              align="center"
              justify="center"
              style={{ minHeight: '50vh' }}
            >
              <Stack gap="md" align="center">
                <Title
                  order={1}
                  size="4rem"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                    maxWidth: '64rem',
                    lineHeight: 1.1,
                  }}
                >
                  <span style={{ 
                    position: 'relative', 
                    display: 'inline-block', 
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    {/* Invisible static placeholder that takes up the correct space */}
                    <span style={{
                      visibility: 'hidden',
                      fontWeight: 600,
                      textAlign: 'center',
                      color: '#01E194'
                    }}>
                      {longestString}
                    </span>
                    
                    {/* Animated title absolutely positioned over the placeholder */}
                    {titles.map((title, index) => {
                      // Split title into words
                      const words = title.split(' ');
                      const isZeroTitle = words[0] === 'Zero';
                      const isMoreSales = title === 'More Sales';
                      
                      return (
                        <motion.span
                          key={index}
                          style={{
                            position: 'absolute',
                            top: 0,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            color: '#01E194',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            lineHeight: 'none',
                            background: '#01E194',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                          initial={{ opacity: 0, y: "100%" }}
                          animate={
                            titleNumber === index
                              ? { y: "0%", opacity: 1 } // current entering
                              : index === previousTitle.current
                              ? { y: "100%", opacity: 0 } // outgoing (slide up)
                              : { y: "-100%", opacity: 0 } // default (below)
                          }
                          transition={{ type: "spring", stiffness: 80 }}
                        >
                          {isZeroTitle && !isMoreSales ? (
                            <>
                              <motion.span
                                initial={{ opacity: 1 }}
                                animate={{ 
                                  opacity: titleNumber === index ? 1 : 0 
                                }}
                                transition={{ 
                                  delay: titleNumber === index ? 0 : 0,
                                  duration: 0.3 
                                }}
                              >
                                {title}
                              </motion.span>
                            </>
                          ) : (
                            title
                          )}
                        </motion.span>
                      );
                    })}
                  </span>
                </Title>
                
                <Text
                  size="lg"
                  style={{
                    fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                    color: 'white',
                    maxWidth: '64rem',
                    textAlign: 'center',
                  }}
                >
                  Unlock growth for you and your clients with our innovative finance partnership model.
                </Text>
              </Stack>
              
              <Group gap="sm" hiddenFrom="md">
                <Button 
                  size="lg" 
                  style={{ backgroundColor: '#01E194' }}
                >
                  Get Started
                </Button>
              </Group>
            </Stack>
          </div>
        </Group>
      </div>
    </Container>
  );
}

export { HeroB };