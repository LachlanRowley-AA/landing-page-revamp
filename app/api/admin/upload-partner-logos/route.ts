// app/api/admin/upload-partner-logos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth.config'; // Adjust path as needed

interface FileBuffer {
  originalname: string;
  buffer: Buffer;
}

interface UploadResponse {
  success?: boolean;
  processedCount?: number;
  combinedImages?: string[];
  error?: string;
}

// Paths configuration
const YOUR_LOGO = path.join(process.cwd(), 'assets/standard/logo_black.png');
const OUTPUT_DIR = path.join(process.cwd(), 'public/output');

// Design constants
const LOGO_HEIGHT = 80;
const BAR_WIDTH = 2; // Width of the vertical bar in pixels
const BAR_COLOR = { r: 0, g: 0, b: 0, alpha: 1 }; // Black bar color
const SPACING = 20; // Space between logo and bar on each side

// Ensure directories exist
function ensureDirectoriesExist() {
  [path.dirname(YOUR_LOGO), OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Create a vertical bar SVG
function createVerticalBar(height: number): Buffer {
  const barHeight = Math.round(height * 1.25); // 25% larger than logo height
  const svg = `
    <svg width="${BAR_WIDTH}" height="${barHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${BAR_WIDTH}" height="${barHeight}" fill="rgb(${BAR_COLOR.r},${BAR_COLOR.g},${BAR_COLOR.b})" />
    </svg>
  `;
  return Buffer.from(svg);
}

async function processLogos(partnerFiles: FileBuffer[]): Promise<string[]> {
  const combinedImages: string[] = [];
  
  try {
    // Ensure directories exist
    ensureDirectoriesExist();
    
    // Check if standard images exist
    if (!fs.existsSync(YOUR_LOGO)) {
      throw new Error(`Your logo not found at: ${YOUR_LOGO}`);
    }
    
    // Process standard logo once
    const yourLogo = await sharp(YOUR_LOGO).resize({ height: LOGO_HEIGHT }).toBuffer();
    const yourLogoMeta = await sharp(yourLogo).metadata();
    
    if (!yourLogoMeta.width || !yourLogoMeta.height) {
      throw new Error('Could not read logo dimensions');
    }
    
    // Process each partner logo
    for (const file of partnerFiles) {
      try {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const outputFilename = `combined-${timestamp}-${safeName}`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);
        
        // Process partner logo to same height
        const partnerLogo = await sharp(file.buffer).resize({ height: LOGO_HEIGHT }).toBuffer();
        const partnerMeta = await sharp(partnerLogo).metadata();
        
        if (!partnerMeta.width || !partnerMeta.height) {
          console.error(`Could not read dimensions for ${file.originalname}`);
          continue;
        }
        
        // Create vertical bar
        const barSvg = createVerticalBar(LOGO_HEIGHT);
        const barBuffer = await sharp(barSvg).png().toBuffer();
        const barMeta = await sharp(barBuffer).metadata();
        
        if (!barMeta.width || !barMeta.height) {
          console.error(`Could not read bar dimensions`);
          continue;
        }
        
        // Calculate total dimensions
        const totalWidth = yourLogoMeta.width + (SPACING * 2) + BAR_WIDTH + (SPACING * 2) + partnerMeta.width;
        const totalHeight = Math.max(LOGO_HEIGHT, barMeta.height);
        
        // Calculate vertical centering positions
        const logoVerticalOffset = Math.round((totalHeight - LOGO_HEIGHT) / 2);
        const barVerticalOffset = Math.round((totalHeight - barMeta.height) / 2);
        
        // Calculate horizontal positions
        const yourLogoLeft = 0;
        const barLeft = yourLogoMeta.width + SPACING;
        const partnerLogoLeft = barLeft + BAR_WIDTH + SPACING;
        
        // Create final composite
        await sharp({
          create: {
            width: totalWidth,
            height: totalHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          }
        })
        .composite([
          { 
            input: yourLogo, 
            top: logoVerticalOffset, 
            left: yourLogoLeft 
          },
          { 
            input: barBuffer, 
            top: barVerticalOffset, 
            left: barLeft 
          },
          { 
            input: partnerLogo, 
            top: logoVerticalOffset, 
            left: partnerLogoLeft 
          }
        ])
        .png()
        .toFile(outputPath);
        
        combinedImages.push(outputFilename);
        console.log(`Successfully created: ${outputFilename}`);
      } catch (err) {
        console.error(`Failed to process ${file.originalname}:`, err);
        // Continue processing other files even if one fails
      }
    }
  } catch (err) {
    console.error('Failed to process standard logos:', err);
    throw err;
  }
  
  return combinedImages;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Check authentication
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const files = formData.getAll('partnerLogos') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ 
          error: `File ${file.name} is not an image` 
        }, { status: 400 });
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        return NextResponse.json({ 
          error: `File ${file.name} is too large (max 10MB)` 
        }, { status: 400 });
      }
    }

    // Convert files to buffer format
    const fileBuffers: FileBuffer[] = await Promise.all(
      files.map(async (file: File) => ({
        originalname: file.name,
        buffer: Buffer.from(await file.arrayBuffer()),
      }))
    );

    // Process the logos
    const combinedImages = await processLogos(fileBuffers);

    if (combinedImages.length === 0) {
      return NextResponse.json({ 
        error: 'No images were successfully processed' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      processedCount: combinedImages.length,
      combinedImages: combinedImages,
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process images';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}