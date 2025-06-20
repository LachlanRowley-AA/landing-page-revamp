'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  Loader,
  TextInput,
  Card,
  Badge,
  Grid,
  FileInput,
  Progress,
  Alert,
  Avatar,
  ActionIcon,
  ThemeIcon,
  SimpleGrid,
  Image,
  rem,
  Flex
} from '@mantine/core';
import {
  IconQrcode,
  IconDownload,
  IconUser,
  IconMail,
  IconLogout,
  IconPhoto,
  IconCheck,
  IconAlertCircle,
  IconHistory,
  IconCloudUpload,
  IconRefresh,
  IconPhotoSearch
} from '@tabler/icons-react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState<string[]>([]);
  
  // QR Code states
  const [partnerName, setPartnerName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [generatedQrCodes, setGeneratedQrCodes] = useState<Array<{
    partnerName: string;
    url: string;
    timestamp: string;
  }>>([]);

  // Image loading states
  const [loadingImages, setLoadingImages] = useState(false);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');

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

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Updated getImage function with better error handling
  const getImages = async () => {
    try {
      setLoadingImages(true);
      setImageError('');

      const response = await fetch('/api/admin/getImages');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText || 'Failed to fetch images'}`);
      }
      
      const responseText = await response.text();
      let imageData;
      
      try {
        imageData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text:', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
      // Handle different response formats
      if (Array.isArray(imageData)) {
        const imageUrls = imageData.map((img) => {
          if (typeof img === 'string') {
            return img; // Direct URL
          } else if (img.secure_url) {
            return img.secure_url; // Cloudinary format
          } else if (img.url) {
            return img.url; // Alternative format
          }
          return null;
        }).filter(Boolean);
        
        setFetchedImages(imageUrls);
        return imageUrls;
      }
        console.error('Unexpected response format:', imageData);
        throw new Error('Unexpected response format from server');
    } catch (error) {
      console.error('Error fetching images:', error);
      setImageError(`Failed to load images: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    } finally {
      setLoadingImages(false);
    }
  };

  // Load images on component mount (with error handling)
  useEffect(() => {
    if (session) {
      // Don't block the UI if image loading fails
      getImages().catch(console.error);
    }
  }, [session]);

  const handleFileUpload = async (files: File[] | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('Uploading and processing images...');

    try {
      const formData = new FormData();
      files.forEach((file: File) => {
        formData.append('partnerLogos', file);
      });

      const response = await fetch('/api/admin/upload-partner-logos', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json() as {
        processedCount: number;
        combinedImages?: string[];
        error?: string;
      };

      if (response.ok) {
        setUploadStatus(`✅ Successfully processed ${result.processedCount} images`);
        setUploadedFiles(result.combinedImages || []);
      } else {
        setUploadStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setUploadStatus(`Upload failed`);
    } finally {
      setIsUploading(false);
    }
  };

  const generateQRCode = () => {
    if (!partnerName.trim()) {
      return;
    }

    // Create the URL with partner name and tracking data
    const baseUrl = 'https://assetalley.netlify.app/website/';
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

  // Updated uploadToCloudinary function to handle file URLs
  const uploadToCloudinary = async (fileUrl: string, partner: string) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Extract filename from URL for the public_id
      const filename = fileUrl.split('/').pop() || 'logo_black';
      const baseFilename = filename.replace(/\.[^/.]+$/, ""); // Remove extension
      
      const file = new File([blob], filename, { type: blob.type });

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dhfd1vdsy/upload`;
      const fd = new FormData();
      fd.append('upload_preset', 'standard');
      fd.append('tags', 'browser_upload, logo_black');
      fd.append('file', file);
      fd.append('asset_folder', partnerName);
      fd.append('public_id', baseFilename); // Use the base filename without extension

      const uploadResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: fd,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Cloudinary upload failed: ${uploadResponse.status}`);
      }

      const result = await uploadResponse.json();
      console.log('Upload successful:', result);
      
      // Refresh the images list after successful upload (with error handling)
      await getImages().catch(console.error);
      
      return result;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Handler function for the upload button
  const handleUploadToCloudinary = async (filename: string, partner: string) => {
    try {
      // Add filename to uploading state
      setUploadingToCloudinary(prev => [...prev, filename]);
      
      const fileUrl = `/output/${filename}`;
      await uploadToCloudinary(fileUrl, partner);
      
      // Show success message
      setUploadStatus(`✅ Successfully uploaded ${filename} to Cloudinary`);
    } catch (error) {
      // Show error message
      setUploadStatus(`❌ Failed to upload ${filename} to Cloudinary`);
      console.error('Upload error:', error);
    } finally {
      // Remove filename from uploading state
      setUploadingToCloudinary(prev => prev.filter(f => f !== filename));
    }
  };
  

  if (status === 'loading') {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" color="white" type="dots" />
          <Text size="lg" c="white" fw={500}>
            Loading dashboard...
          </Text>
        </Stack>
      </Box>
    );
  }

  if (!session) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text size="lg" c="white" fw={500}>
          Redirecting to login...
        </Text>
      </Box>
    );
  }

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
          {/* Header */}
          <Paper
            p="xl"
            radius="lg"
            shadow="sm"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Group justify="space-between" align="center">
              <Group>
                <Avatar
                  src={session.user?.image}
                  size="lg"
                  radius="xl"
                  style={{ border: '3px solid rgba(255, 255, 255, 0.3)' }}
                />
                <Stack gap="xs">
                  <Title order={1} size="h2" c="white">
                    Admin Dashboard
                  </Title>
                  <Group gap="xs">
                    <IconUser size={16} />
                    <Text size="sm" c="white" opacity={0.9}>
                      {session.user?.name}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconMail size={16} />
                    <Text size="xs" c="white" opacity={0.7}>
                      {session.user?.email}
                    </Text>
                  </Group>
                </Stack>
              </Group>
              
              <Button
                leftSection={<IconLogout size={18} />}
                variant="white"
                color="red"
                size="md"
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }}
              >
                Sign Out
              </Button>
            </Group>
          </Paper>

          {/* QR Code Generator Section */}
          <Paper p={{base:"xs", md:"md"}} radius="lg" shadow="sm">
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'teal', to: 'green' }}>
                  <IconQrcode size={24} />
                </ThemeIcon>
                <Stack gap="xs">
                  <Title order={2} size="h3">
                    Partner QR Code Generator
                  </Title>
                  <Text c="dimmed" size="sm">
                    Generate branded QR codes for partner tracking
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
                    label="Partner Name"
                    placeholder="Enter partner name..."
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

          {/* QR Code History */}
          {generatedQrCodes.length > 0 && (
            <Paper p="xl" radius="lg" shadow="sm">
              <Group mb="lg">
                <ThemeIcon size="xl" variant="light" color="blue">
                  <IconHistory size={24} />
                </ThemeIcon>
                <Stack gap="xs">
                  <Title order={2} size="h3">
                    QR Code History
                  </Title>
                  <Text c="dimmed" size="sm">
                    Recently generated QR codes
                  </Text>
                </Stack>
              </Group>

              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                {generatedQrCodes.slice(0, 6).map((qr, index) => (
                  <Card key={index} withBorder p="md" radius="md">
                    <Group justify="space-between" mb="sm">
                      <Text fw={500} truncate>
                        {qr.partnerName}
                      </Text>
                      <Badge variant="light" size="xs">
                        {qr.timestamp.split(' ')[0]}
                      </Badge>
                    </Group>
                    
                    <Flex justify="space-between" align="center">
                      <Canvas
                        text={qr.url}
                        options={{
                          width: 60,
                          margin: 1,
                          color: {
                            dark: '#000000',
                            light: '#FFFFFF',
                          },
                        }}
                      />
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        size="lg"
                        onClick={() => downloadQRCode(qr.partnerName)}
                      >
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Flex>
                  </Card>
                ))}
              </SimpleGrid>
            </Paper>
          )}

          {/* Image Upload Section */}
          <Paper p="xl" radius="lg" shadow="sm">
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'indigo' }}>
                  <IconPhoto size={24} />
                </ThemeIcon>
                <Stack gap="xs">
                  <Title order={2} size="h3">
                    Partner Logo Processor
                  </Title>
                  <Text c="dimmed" size="sm">
                    Upload and combine partner logos with the Asset Alley Logo
                  </Text>
                </Stack>
              </Group>

              <Card
                withBorder
                p="lg"
                radius="md"
                style={{
                  background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '2px dashed #3b82f6'
                }}
              >
                <Stack gap="md" align="center">
                  <ThemeIcon size={60} variant="light" color="blue">
                    <IconCloudUpload size={30} />
                  </ThemeIcon>
                  
                  <FileInput
                    placeholder="Select partner logo files"
                    label="Upload Images"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    size="md"
                    style={{ width: '100%', maxWidth: '400px' }}
                  />

                  {isUploading && (
                    <Box style={{ width: '100%', maxWidth: '400px' }}>
                      <Progress value={100} animated color="blue" />
                      <Text size="sm" c="dimmed" ta="center" mt="xs">
                        Processing images...
                      </Text>
                    </Box>
                  )}
                </Stack>
              </Card>

              {uploadStatus && (
                <Alert
                  icon={uploadStatus.includes('✅') ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
                  color={uploadStatus.includes('✅') ? 'green' : 'red'}
                  variant="light"
                >
                  {uploadStatus}
                </Alert>
              )}

              {uploadedFiles.length > 0 && (
                <Stack gap="md">
                  <Title order={4}>Generated Combined Logos</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
                    {uploadedFiles.map((file, index) => (
                      <Card key={index} withBorder p="md" radius="md">
                        <Stack gap="sm">
                          <Image
                            src={`/output/${file}`}
                            alt={`Combined logo ${index + 1}`}
                            h={80}
                            fit="contain"
                            radius="sm"
                          />
                          <Text size="xs" c="dimmed" truncate>
                            {file}
                          </Text>
                          <Button
                            component="a"
                            href={`/output/${file}`}
                            download
                            variant="light"
                            size="xs"
                            leftSection={<IconDownload size={14} />}
                          >
                            Download
                          </Button>
                          <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconCloudUpload size={14} />}
                            onClick={() => handleUploadToCloudinary(file, 'test')}
                            loading={uploadingToCloudinary.includes(file)}
                            disabled={uploadingToCloudinary.includes(file)}
                          >
                            {uploadingToCloudinary.includes(file) ? 'Uploading...' : 'Upload to DB'}
                          </Button>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Database Images Gallery Section */}
          <Paper p="xl" radius="lg" shadow="sm">
            <Stack gap="lg">
              <Group justify="space-between">
                <Group>
                  <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'violet', to: 'purple' }}>
                    <IconPhotoSearch size={24} />
                  </ThemeIcon>
                  <Stack gap="xs">
                    <Title order={2} size="h3">
                      Database Images
                    </Title>
                    <Text c="dimmed" size="sm">
                      Images stored in your Cloudinary database
                    </Text>
                  </Stack>
                </Group>
                
                <Button
                  onClick={getImages}
                  variant="light"
                  color="purple"
                  leftSection={<IconRefresh size={16} />}
                  loading={loadingImages}
                  disabled={loadingImages}
                >
                  Refresh Images
                </Button>
              </Group>

              {loadingImages && (
                <Card withBorder p="lg" radius="md">
                  <Stack align="center" gap="md">
                    <Loader size="lg" color="purple" />
                    <Text c="dimmed">Loading images from database...</Text>
                  </Stack>
                </Card>
              )}

              {imageError && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  variant="light"
                >
                  {imageError}
                </Alert>
              )}

              {!loadingImages && fetchedImages.length === 0 && !imageError && (
                <Card withBorder p="lg" radius="md" style={{ textAlign: 'center' }}>
                  <Stack align="center" gap="md">
                    <ThemeIcon size={60} variant="light" color="gray">
                      <IconPhoto size={30} />
                    </ThemeIcon>
                    <Text c="dimmed">No images found in database</Text>
                  </Stack>
                </Card>
              )}

              {fetchedImages.length > 0 && (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                  {fetchedImages.map((imageUrl, index) => (
                    <Card key={index} withBorder p="md" radius="md">
                      <Stack gap="sm">
                        <Image
                          src={imageUrl}
                          alt={`Database image ${index + 1}`}
                          h={120}
                          fit="contain"
                          radius="sm"
                          style={{ background: '#f8f9fa' }}
                        />
                        <Text size="xs" c="dimmed" truncate title={imageUrl}>
                          {imageUrl.split('/').pop()}
                        </Text>
                        <Button
                          component="a"
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="light"
                          size="xs"
                          leftSection={<IconDownload size={14} />}
                        >
                          View Full Size
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              )}

              {fetchedImages.length > 0 && (
                <Text size="sm" c="dimmed" ta="center">
                  Showing {fetchedImages.length} image{fetchedImages.length !== 1 ? 's' : ''} from database
                </Text>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}