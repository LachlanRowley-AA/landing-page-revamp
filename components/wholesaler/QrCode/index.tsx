'use client';
import { useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Box,
  TextInput,
  Card,
  Badge,
  Grid,
  ThemeIcon,
} from '@mantine/core';
import {
  IconQrcode,
  IconDownload,
  IconRefresh,
} from '@tabler/icons-react';

export function QrCode() { 
  // QR Code states
  const [partnerName, setPartnerName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [generatedQrCodes, setGeneratedQrCodes] = useState<Array<{
    partnerName: string;
    url: string;
    timestamp: string;
  }>>([]);

  const { Canvas } = useQRCode();
  const currentQRCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Function to add green border to QR code canvas
  const addBorderToCanvas = (canvas: HTMLCanvasElement, borderWidth: number = 10, borderColor: string = '#01E194') => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('ctx error');
      return;
    };

    // Get the original image data
    const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create new canvas with border
    const newWidth = canvas.width + (borderWidth * 2);
    const newHeight = canvas.height + (borderWidth * 2);
    
    // Resize the canvas
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Fill with border color
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);
    
    // Put the original QR code in the center
    ctx.putImageData(originalImageData, borderWidth, borderWidth);
  };


  const generateQRCode = () => {
    if (!partnerName.trim()) {
      return;
    }

    // Create the URL with partner name and tracking data
    const baseUrl = 'https://assetalley.netlify.app/wholesaler/';
    const trackingParams = new URLSearchParams({
      utm_source: 'invoice',
      utm_medium: 'qr',
      utm_campaign: 'partner_referral',
    });
    
    const fullUrl = `${baseUrl}${encodeURIComponent(partnerName)}?${trackingParams.toString()}`;
    setQrCodeUrl(fullUrl);

    // Add to generated QR codes list
    const newQrCode = {
      partnerName: partnerName,
      url: fullUrl,
      timestamp: new Date().toLocaleString()
    };
    
    setGeneratedQrCodes(prev => [newQrCode, ...prev]);
  };

const downloadQRCode = (partnerName: string) => {
  // Find the canvas element in the DOM - the useQRCode Canvas component renders a canvas
  const canvas = document.querySelector('canvas') as HTMLCanvasElement;
  
  if (canvas) {
    // Create a copy of the canvas to avoid modifying the original
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      console.log('Could not get canvas context');
      return;
    }
    
    // Copy the original canvas content
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Add border to the copy
    addBorderToCanvas(tempCanvas, 10, '#01E194');
    
    // Download the modified canvas
    const link = document.createElement('a');
    link.download = `qr-code-${partnerName.replace(/\s+/g, '_')}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
  } else {
    console.log('QR Code canvas not found');
  }
};

  const clearQRCode = () => {
    setPartnerName('');
    setQrCodeUrl('');
  };
  return (
    <Box
      p={{ base: '0px', md: 'md'}}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Container size="xl" p={{ base: "0px", md: "md" }}>
        <Stack gap="xl">
          {/* QR Code Generator Section */}
          <Paper p={{base:"xs", md:"md"}} radius="lg" shadow="sm">
            <Stack gap="lg">
              <Group>
                <Stack gap="xs">
                  <Title order={2} size="h3">
                    QR Code Generator
                  </Title>
                  <Text c="dimmed" size="sm">
                    Generate your QR code
                  </Text>
                </Stack>
              </Group>

              <Card
                withBorder
                p="lg"
                radius="md"
                style={{
                  background: 'linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)',
                  border: '2px dashed #10b981'
                }}
              >
                <Stack gap="md">
                  <TextInput
                    label="Your Business' Name"
                    placeholder="Enter business name..."
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.currentTarget.value)}
                    leftSection={<IconQrcode size={16} />}
                    size="md"
                    radius="md"
                  />
                  
                  <Group>
                    <Button
                      onClick={generateQRCode}
                      disabled={!partnerName.trim()}
                      variant="gradient"
                      gradient={{ from: 'teal', to: 'green' }}
                      leftSection={<IconQrcode size={16} />}
                      size="md"
                    >
                      Generate QR Code
                    </Button>
                    <Button
                      onClick={clearQRCode}
                      variant="light"
                      color="gray"
                      leftSection={<IconRefresh size={16} />}
                      size="md"
                    >
                      Clear
                    </Button>
                  </Group>

                  {qrCodeUrl && (
                    <Card withBorder p="lg" bg="white" mt="md">
                      <Title order={4} mb="md">
                        Generated QR Code
                      </Title>
                      <Grid>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                          <Box style={{ textAlign: 'center' }}>
                            <Canvas
                              key={`qr-${partnerName.replace(/\s+/g, '_')}`}
                              text={qrCodeUrl}
                              options={{
                                width: 200,
                                margin: 2,
                                color: {
                                  dark: '#000000',
                                  light: '#FFFFFF',
                                },
                              }}
                            />
                          </Box>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                          <Stack gap="sm">
                            <Group>
                              <Badge variant="light" color="green" size="lg">
                                {partnerName}
                              </Badge>
                            </Group>
                            <Text size="xs" c="dimmed" style={{ wordBreak: 'break-all' }}>
                              {qrCodeUrl}
                            </Text>
                            <Button
                              onClick={() => downloadQRCode(partnerName)}
                              variant="filled"
                              color="green"
                              leftSection={<IconDownload size={16} />}
                              size="sm"
                              mt="md"
                            >
                              Download QR Code
                            </Button>
                          </Stack>
                        </Grid.Col>
                      </Grid>
                    </Card>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
