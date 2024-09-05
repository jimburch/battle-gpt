import { NextRequest, NextResponse } from "next/server";
import { saveFightToSupabase, uploadFiletoSupabase } from "@/services/supabase";
import { generateFightImageUrl, generateOpenAiJSON } from "@/services/openai";
import supabase from "@/utils/supabase";
import { nanoid } from "nanoid";

export interface PostResponse {
  textResponse: {
    winner: string;
    length_of_fight: string;
    finishing_move: string;
    winning_fighter_description: string;
    element: string;
    damage_given: string;
    damage_taken: string;
  };
  imageResponse: {
    revised_prompt: string;
    url: string;
  };
}

const NODE_ENV = process.env.VERCEL_ENV || "development";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const channelId = formData.get("channelId") as string;
  const playerOneName = formData.get("playerOneName") as string;
  const playerTwoName = formData.get("playerTwoName") as string;
  const playerOneImage = formData.get("playerOneImage") as File;
  const playerTwoImage = formData.get("playerTwoImage") as File;

  const channel = supabase.channel(channelId);

  const playerOneImageUrl = await uploadFiletoSupabase({
    imageName: playerOneName,
    playerImage: playerOneImage,
  });

  const playerTwoImageUrl = await uploadFiletoSupabase({
    imageName: playerTwoName,
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

  const winningFighterName =
    parsedTextResponse.winner === 1 ? playerOneName : playerTwoName;

  const battleSlug = nanoid();

  let winningFighterImage;
  if (imageResponse.url) {
    winningFighterImage = await uploadFiletoSupabase({
      imageName: winningFighterName,
      playerImage: imageResponse.url,
    });
  }

  const savedFight = await saveFightToSupabase({
    player_one_name: playerOneName,
    player_one_img_url: playerOneImageUrl,
    player_two_name: playerTwoName,
    player_two_img_url: playerTwoImageUrl,
    winner: winningFighterName,
    winner_description: parsedTextResponse.winning_fighter_description,
    length_of_fight: parsedTextResponse.length_of_fight,
    winning_move: parsedTextResponse.finishing_move,
    fight_img_url: winningFighterImage,
    element: parsedTextResponse.element,
    damage_given: parsedTextResponse.damage_given,
    damage_taken: parsedTextResponse.damage_taken,
    slug: battleSlug,
    env: NODE_ENV,
  });

  supabase.removeChannel(channel);
  return NextResponse.json({
    textResponse: parsedTextResponse,
    imageResponse,
    savedFight,
  });
}
