'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Center,
  Stack,
  Box,
  Loader,
  ThemeIcon,
  Group,
  Divider,
  rem
} from '@mantine/core';
import { IconBrandGoogle, IconShield, IconLock } from '@tabler/icons-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (session) {
      router.push('/admin');
    }
  }, [session, router]);

  const handleSignIn = () => {
    signIn('google', {
      callbackUrl: '/admin'
    });
  };

  if (status === 'loading') {
    return (
      <Center h="100vh" bg="gradient-to-br from-blue-50 to-indigo-100">
        <Stack align="center" gap="md">
          <Loader size="lg" color="blue" type="dots" />
          <Text size="lg" c="dimmed" fw={500}>
            Loading authentication...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: rem(20)
      }}
    >
      <Container size={420} my={40}>
        <Paper
          withBorder
          shadow="xl"
          p={40}
          radius="lg"
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Stack gap="xl">
            {/* Header Section */}
            <Stack gap="md" align="center">
              <ThemeIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'indigo' }}
              >
                <IconShield size={32} stroke={1.5} />
              </ThemeIcon>
              
              <Title
                order={1}
                size="h2"
                fw={700}
                ta="center"
                style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Secure Access
              </Title>
              
              <Text c="dimmed" size="md" ta="center" maw={300}>
                Sign in with your authorized Google account to access the admin dashboard
              </Text>
            </Stack>

            <Divider
              label={
                <Group gap="xs">
                  <IconLock size={16} />
                  <Text size="sm" c="dimmed">
                    Authentication Required
                  </Text>
                </Group>
              }
              labelPosition="center"
            />

            {/* Sign In Button */}
            <Button
              onClick={handleSignIn}
              size="lg"
              radius="xl"
              fullWidth
              leftSection={<IconBrandGoogle size={20} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'indigo' }}
              style={{
                height: rem(56),
                fontSize: rem(16),
                fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                  }
                }
              }}
            >
              Continue with Google
            </Button>

            {/* Security Notice */}
            <Paper
              p="md"
              radius="md"
              bg="blue.0"
              style={{ border: '1px solid rgba(59, 130, 246, 0.1)' }}
            >
              <Group gap="sm">
                <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
                  <IconShield size={12} />
                </ThemeIcon>
                <Text size="xs" c="blue.7" fw={500}>
                  Your account access is protected and monitored for security
                </Text>
              </Group>
            </Paper>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}