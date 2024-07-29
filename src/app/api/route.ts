import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const DB_PROJECT_URL = process.env.DB_PROJECT_URL as string;
const DB_API_KEY = process.env.DB_API_KEY as string;
// const DB_SERVICE_KEY = process.env.DB_SERVICE_KEY as string;

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

  console.log(playerOneUrl, playerTwoUrl);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Who would win between these two people in a fight? You must give an answer that picks one of the two people from the images given. Be creative with attributes that would make one person win over the other. Tell me how that winner would win.",
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

  console.log(response.choices[0]);

  return NextResponse.json({ message: "Hello, world!" });
}
