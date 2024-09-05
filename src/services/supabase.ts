import supabase from "@/utils/supabase";
import sharp from "sharp";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const NODE_ENV = process.env.VERCEL_ENV;
const DB_BUCKET = NODE_ENV === "development" ? "images_dev" : "images";
const DB_PROJECT_URL = process.env.NEXT_PUBLIC_DB_PROJECT_URL as string;

interface UploadFiletoSupabaseProps {
  playerName: string;
  playerImage: File;
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
  playerName,
  playerImage,
}: UploadFiletoSupabaseProps) => {
  const playerNameSlug = slugify(playerName, { lower: true });
  const playerImageName = `${playerNameSlug}-${uuidv4()}`;

  const playerImageBuffer = await playerImage.arrayBuffer();
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
