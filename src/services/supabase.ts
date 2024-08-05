import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

interface UploadFiletoSupabaseProps {
  playerName: string;
  playerImage: File;
}

const DB_PROJECT_URL = process.env.DB_PROJECT_URL as string;
const DB_API_KEY = process.env.DB_API_KEY as string;

const supabase = createClient(DB_PROJECT_URL, DB_API_KEY);

export const uploadFiletoSupabase = async ({
  playerName,
  playerImage,
}: UploadFiletoSupabaseProps) => {
  const playerNameSlug = slugify(playerName, { lower: true });
  const playerImageName = `${playerNameSlug}-${uuidv4()}`;

  const playerImageBuffer = await playerImage.arrayBuffer();
  const playerImagePng = await sharp(Buffer.from(playerImageBuffer))
    .rotate()
    .resize({ height: 400 })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true,
    })
    .toBuffer();

  const { data, error } = await supabase.storage
    .from("images")
    .upload(`${playerImageName}.png`, playerImagePng, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/png",
    });

  if (error) {
    throw new Error(error.message);
  }

  return `${DB_PROJECT_URL}/storage/v1/object/public/${data.fullPath}`;
};
