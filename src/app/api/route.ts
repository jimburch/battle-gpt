import { NextRequest, NextResponse } from "next/server";
import { uploadFiletoSupabase } from "@/services/supabase";
import { generateFightImageUrl, generateOpenAiJSON } from "@/services/openai";
import supabase from "@/utils/supabase";

export const runtime = "edge";

export interface PostResponse {
  textResponse: {
    winner: string;
    length_of_fight: string;
    finishing_move: string;
    winning_fighter_description: string;
  };
  imageResponse: {
    revised_prompt: string;
    url: string;
  };
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const playerOneName = formData.get("playerOneName") as string;
  const playerTwoName = formData.get("playerTwoName") as string;
  const playerOneImage = formData.get("playerOneImage") as File;
  const playerTwoImage = formData.get("playerTwoImage") as File;

  const channel = supabase.channel("progress-updates");

  const playerOneImageUrl = await uploadFiletoSupabase({
    playerName: playerOneName,
    playerImage: playerOneImage,
  });

  const playerTwoImageUrl = await uploadFiletoSupabase({
    playerName: playerTwoName,
    playerImage: playerTwoImage,
  });

  channel.send({
    type: "broadcast",
    event: "test",
    payload: { message: "images_uploaded" },
  });

  if (!playerOneImageUrl || !playerTwoImageUrl) {
    supabase.removeChannel(channel);
    return NextResponse.error();
  }

  const textResponse = await generateOpenAiJSON({
    playerOneImageUrl,
    playerTwoImageUrl,
  });

  channel.send({
    type: "broadcast",
    event: "test",
    payload: { message: "fight_json_generated" },
  });

  if (!textResponse) {
    supabase.removeChannel(channel);
    return NextResponse.error();
  }

  const parsedTextResponse = JSON.parse(textResponse);

  const imageResponse = await generateFightImageUrl(parsedTextResponse);

  if (!imageResponse) {
    supabase.removeChannel(channel);
    return NextResponse.error();
  }

  supabase.removeChannel(channel);
  return NextResponse.json({ textResponse: parsedTextResponse, imageResponse });
}
