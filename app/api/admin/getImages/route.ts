import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

interface CloudinaryResource {
    public_id: string;
    secure_url: string;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getImage(): Promise<CloudinaryResource[]> {
    const { resources } = await cloudinary.search.expression('tags=logo_black AND asset_folder=TestPartner').execute();
    return resources.map((res: any) => ({
        public_id: res.public_id,
        secure_url: res.secure_url
    }));
}

export async function GET() {
    try {
        // First, validate environment variables
        const requiredEnvVars = {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        };

        const missingVars = Object.entries(requiredEnvVars)
            .filter(([_, value]) => !value)
            .map(([key, _]) => key);

        if (missingVars.length > 0) {
            console.error('Missing environment variables:', missingVars);
            return NextResponse.json(
                { 
                    error: 'Configuration error',
                    details: `Missing environment variables: ${missingVars.join(', ')}`,
                    missingVars
                },
                { status: 500 }
            );
        }

        console.log('Cloudinary config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
            api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing'
        });

        const images = await getImage();
        
        console.log(`Successfully fetched ${images.length} images`);
        return NextResponse.json(images);
        
    } catch (error: any) {
        // Enhanced error logging
        console.error('Detailed error information:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        
        // Log Cloudinary-specific error details if available
        if (error.http_code) {
            console.error('Cloudinary HTTP code:', error.http_code);
        }
        if (error.error) {
            console.error('Cloudinary error details:', error.error);
        }

        // Return detailed error response (be careful not to expose sensitive info in production)
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch images',
                details: isDevelopment ? error.message : 'Internal server error',
                errorType: error.name || 'Unknown',
                ...(isDevelopment && {
                    stack: error.stack,
                    cloudinaryError: error.error || null,
                    httpCode: error.http_code || null
                })
            },
            { status: 500 }
        );
    }
}