import supabase from "@/utils/supabase";
import sharp from "sharp";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const NODE_ENV = process.env.VERCEL_ENV;
const DB_BUCKET = NODE_ENV === "development" ? "images_dev" : "images";
const DB_PROJECT_URL = process.env.NEXT_PUBLIC_DB_PROJECT_URL as string;

interface UploadFiletoSupabaseProps {
  imageName: string;
  playerImage: File | string;
}

interface FightData {
  player_one_name: string;
  player_one_img_url: string;
  player_two_name: string;
  player_two_img_url: string;
  winner: string;
  winner_description: string;
  length_of_fight: string;
  winning_move: string;
  fight_img_url: string | undefined;
  slug: string;
  env: string;
}

export interface FightDataRecord extends FightData {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
}

export const uploadFiletoSupabase = async ({
  imageName,
  playerImage,
}: UploadFiletoSupabaseProps) => {
  const imageNameSlug = slugify(imageName, { lower: true });
  const playerImageName = `${imageNameSlug}-${uuidv4()}`;

  let playerImageBuffer: ArrayBuffer;

  if (typeof playerImage === "string") {
    console.log("is this a string?");
    const response = await fetch(playerImage);
    if (!response.ok) {
      throw new Error("Failed to fetch image from URL");
    }
    playerImageBuffer = await response.arrayBuffer();
  } else {
    console.log("is this a file?");
    playerImageBuffer = await playerImage.arrayBuffer();
  }

  const playerImagePng = await sharp(Buffer.from(playerImageBuffer))
    .rotate()
    .resize({ height: 600 })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true,
    })
    .toBuffer();

  const { data, error } = await supabase.storage
    .from(DB_BUCKET)
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

export const saveFightToSupabase = async (fightData: FightData) => {
  const { data, error } = await supabase
    .from("fights")
    .insert([fightData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);
  return data[0] as FightDataRecord;
};
