'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  rem, 
  Card, 
  TextInput, 
  Button,
  Group,
  ThemeIcon,
  useMantineTheme 
} from '@mantine/core';
import { motion } from 'motion/react';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconBuilding, 
  IconCurrencyDollar,
  IconSend,
  IconCheck,
  IconRefresh
} from '@tabler/icons-react';
import { createClient } from "@supabase/supabase-js"

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  price: string;
}

const formFields = [
  {
    key: 'name' as keyof FormData,
    label: 'Full Name',
    placeholder: 'Enter your full name',
    icon: IconUser,
    type: 'text'
  },
  {
    key: 'email' as keyof FormData,
    label: 'Email Address',
    placeholder: 'Enter your email address',
    icon: IconMail,
    type: 'email'
  },
  {
    key: 'phoneNumber' as keyof FormData,
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    icon: IconPhone,
    type: 'tel'
  },
  {
    key: 'businessName' as keyof FormData,
    label: 'Business Name',
    placeholder: 'Enter your business name',
    icon: IconBuilding,
    type: 'text'
  },
  {
    key: 'price' as keyof FormData,
    label: 'Amount Required',
    placeholder: 'Enter amount required',
    icon: IconCurrencyDollar,
    type: 'text'
  }
];

export const ContactForm = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    price: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/createQuery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          businessName: formData.businessName,
          price: formData.price,
          phoneNumber: formData.phoneNumber // Assuming phone number maps to amount
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Form submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Form submission failed', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      businessName: '',
      price: ''
    });
    setError(null);
  };

  return (
    <Box
      bg="white"
      py={{ base: rem(60), md: rem(30) }}
      px={{ base: "0px", md: "xl" }}
      style={{ 
        minHeight: "60vh",
      }}
    >
      <Container size="md" px={{base: "0px"}}>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          <Stack align="center" gap="lg" mb={{ base: rem(40), md: rem(40) }}>
            <JumboTitle 
              order={2} 
              fz="md" 
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="#01E194"
              fw={700}
              mb="sm"
            >
              {isSuccess ? "Application Submitted!" : "Apply now to confirm eligibility"}
            </JumboTitle>
            <Text 
              size="lg" 
              c="rgba(0, 0, 0, 0.7)" 
              ta="center"
              maw={600}
              style={{ lineHeight: 1.6 }}
            >
              {isSuccess 
                ? "Thank you for your application. We'll review your details and get back to you within 24 hours." 
                : "Tell us about your business needs and we'll get back to you ASAP."
              }
            </Text>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card 
            padding="xl" 
            radius="lg" 
            bg="rgba(20, 20, 20, 0.05)"
            style={{ 
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            {!isSuccess ? (
              // Show form when not successful
              <form onSubmit={handleSubmit}>
                <Stack gap="lg">
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.key}
                      initial={{ opacity: 0.0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        ease: 'easeInOut', 
                        delay: index * 0.1 
                      }}
                      viewport={{ once: true }}
                    >
                      <TextInput
                        label={field.label}
                        placeholder={field.placeholder}
                        type={field.type}
                        size="lg"
                        radius="md"
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        leftSection={
                          <ThemeIcon
                            size={20}
                            radius="md"
                            variant="transparent"
                            color="#01E194"
                          >
                            <field.icon size={20} />
                          </ThemeIcon>
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  ))}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Text 
                        size="sm" 
                        c="red" 
                        ta="center"
                        p="sm"
                        bg="rgba(255, 0, 0, 0.1)"
                        style={{ borderRadius: rem(8) }}
                      >
                        {error}
                      </Text>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0.0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Button
                      type="submit"
                      size="xl"
                      radius="lg"
                      fullWidth
                      loading={isSubmitting}
                      leftSection={<IconSend size={20} />}
                      styles={{
                        root: {
                          background: "linear-gradient(135deg, #01E194 0%, #00C878 100%)",
                          border: "none",
                          padding: `${rem(16)} ${rem(24)}`,
                          height: rem(56),
                          marginTop: rem(20),
                          fontSize: rem(18),
                          fontWeight: 600,
                          transition: "all 0.3s ease",
                          '&:hover': {
                            background: "linear-gradient(135deg, #00C878 0%, #01E194 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 32px rgba(1, 225, 148, 0.3)",
                          },
                          '&:active': {
                            transform: "translateY(0px)",
                          }
                        },
                        label: {
                          color: 'black',
                        }
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                    </Button>
                  </motion.div>
                </Stack>
              </form>
            ) : (
              // Show success message when successful
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Stack align="center" gap="xl" py="xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <ThemeIcon
                      size={80}
                      radius="50%"
                      variant="light"
                      color="#01E194"
                      bg="rgba(1, 225, 148, 0.1)"
                    >
                      <IconCheck size={40} stroke={2} />
                    </ThemeIcon>
                  </motion.div>

                  <Stack align="center" gap="md">
                    <Text 
                      size="xl" 
                      fw={600} 
                      c="black"
                      ta="center"
                    >
                      Your application has been submitted successfully!
                    </Text>
                    
                    <Text 
                      size="md" 
                      c="rgba(0, 0, 0, 0.7)" 
                      ta="center"
                      maw={400}
                      style={{ lineHeight: 1.5 }}
                    >
                      We've received your details and our team will review your application. 
                      Expect to hear from us within 24 hours.
                    </Text>
                  </Stack>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    style={{ width: '100%' }}
                  >
                    <Button
                      onClick={resetForm}
                      size="lg"
                      radius="lg"
                      fullWidth
                      leftSection={<IconRefresh size={20} />}
                      variant="outline"
                      styles={{
                        root: {
                          border: "2px solid #01E194",
                          color: "#01E194",
                          height: rem(48),
                          fontSize: rem(16),
                          fontWeight: 600,
                          transition: "all 0.3s ease",
                          '&:hover': {
                            background: "#01E194",
                            color: 'black',
                            transform: "translateY(-1px)",
                          }
                        }
                      }}
                    >
                      Submit Another Application
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.8 }}
          viewport={{ once: true }}
        >
          {/* <Stack align="center" gap="sm" mt="xl">
            <Group gap="xs">
              {[...Array(5)].map((_, i) => (
                <Text key={i} size="lg" c="#01E194">★</Text>
              ))}
            </Group>
            <Text 
              size="sm" 
              c="rgba(0, 0, 0, 0.6)" 
              ta="center"
            >
              Trusted by hundreds of Australian businesses
            </Text>
          </Stack> */}
        </motion.div>
      </Container>
    </Box>
  );
};