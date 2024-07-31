import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const DB_PROJECT_URL = process.env.DB_PROJECT_URL as string;
const DB_API_KEY = process.env.DB_API_KEY as string;

const supabase = createClient(DB_PROJECT_URL, DB_API_KEY);

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const playerOneName = formData.get("playerOneName") as string;
  const playerTwoName = formData.get("playerTwoName") as string;
  const playerOneImage = formData.get("playerOneImage") as File;
  const playerTwoImage = formData.get("playerTwoImage") as File;

  const playerOneImageName = `${playerOneName}-${uuidv4()}`;
  const playerTwoImageName = `${playerTwoName}-${uuidv4()}`;

  const { data: data1, error: error1 } = await supabase.storage
    .from("images")
    .upload(playerOneImageName, playerOneImage, {
      cacheControl: "3600",
      upsert: false,
    });

  const { data: data2, error: error2 } = await supabase.storage
    .from("images")
    .upload(playerTwoImageName, playerTwoImage, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error1 || error2) {
    return NextResponse.error();
  }

  const playerOneUrl = `${DB_PROJECT_URL}/storage/v1/object/public/${data1.fullPath}`;
  const playerTwoUrl = `${DB_PROJECT_URL}/storage/v1/object/public/${data2.fullPath}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a judge in a fight contest between two people. Your job is to analyze the image of each fighter and determine who would win based on their physical attributes, fighting stance, and any other information you can gather from the images. You must pick a winner in every fight. Do not automatically pick a winner because they are male or bigger. Be creative and think outside the box. You must respond in valid JSON that follows this format: { "winner": [1 for the first image and 2 for the second image, use those two numbers only], "length_of_fight": [How long the fight lasted], "finishing_move": [How the winner won, be creative and use details from the images to draw this conclusion] }`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Who would win between these two people in a fight? Respond using JSON.",
          },
          {
            type: "image_url",
            image_url: {
              url: playerOneUrl,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: playerTwoUrl,
            },
          },
        ],
      },
    ],
  });

  if (!response) {
    return NextResponse.error();
  }

  return NextResponse.json(response.choices[0]);
}
