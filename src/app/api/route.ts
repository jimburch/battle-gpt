import { NextRequest, NextResponse } from "next/server";
import { uploadFiletoSupabase } from "@/services/supabase";
import { generateFightImageUrl, generateOpenAiJSON } from "@/services/openai";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const playerOneName = formData.get("playerOneName") as string;
  const playerTwoName = formData.get("playerTwoName") as string;
  const playerOneImage = formData.get("playerOneImage") as File;
  const playerTwoImage = formData.get("playerTwoImage") as File;

  const playerOneImageUrl = await uploadFiletoSupabase({
    playerName: playerOneName,
    playerImage: playerOneImage,
  });

  const playerTwoImageUrl = await uploadFiletoSupabase({
    playerName: playerTwoName,
    playerImage: playerTwoImage,
  });

  if (!playerOneImageUrl || !playerTwoImageUrl) {
    return NextResponse.error();
  }

  const response = await generateOpenAiJSON({
    playerOneImageUrl,
    playerTwoImageUrl,
  });

  console.log(response);

  if (!response) {
    return NextResponse.error();
  }

  const imageReponse = await generateFightImageUrl(JSON.parse(response));
  console.log(imageReponse);

  return NextResponse.json(response);
}
