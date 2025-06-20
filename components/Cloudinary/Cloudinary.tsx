import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResource {
    public_id: string;
    secure_url: string;
}

export async function getImage(): Promise<CloudinaryResource[]> {
    const { resources } = await cloudinary.search.expression('tag=logo_white AND asset_folder=TestPartner').execute();
    return resources.map((res: any) => ({
        public_id: res.public_id,
        secure_url: res.secure_url
    }));
}
