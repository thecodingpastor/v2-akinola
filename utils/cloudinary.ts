import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveImageInCloud = async (
  imageBase64String: string,
  folder?: string
) => {
  const result = await cloudinary.uploader.upload(imageBase64String, {
    upload_preset: process.env.CLOUDINARY_PRESET,
    folder: folder ? folder : "akinola",
  });

  if (!result) return null;

  return {
    url: result.secure_url,
    fileId: result.public_id,
  };
};

export const deleteImageInCloud = async (imageCloudId: string) => {
  const result = await cloudinary.uploader.destroy(imageCloudId);
    
  if (result.result !== "ok") return null;
  return true;
};

export default cloudinary;
