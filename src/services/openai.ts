import { openai } from "@/utils/openai";
import { fightPrompt, generateImagePrompt } from "./prompts";

interface GenerateOpenAiJsonProps {
  playerOneImageUrl: string;
  playerTwoImageUrl: string;
}

export interface OpenAiJsonResponse {
  winner: number;
  length_of_fight: string;
  finishing_move: string;
  winning_fighter_description: string;
}

const NODE_ENV = process.env.VERCEL_ENV;
const OPENAI_TEXT_MODEL = "gpt-4o-mini";
const OPENAI_IMAGE_MODEL = NODE_ENV === "development" ? "dall-e-2" : "dall-e-3";
const OPENAI_IMAGE_DETAIL = "low";

export const generateOpenAiJSON = async ({
  playerOneImageUrl,
  playerTwoImageUrl,
}: GenerateOpenAiJsonProps) => {
  const response: any = await openai.chat.completions.create({
    model: OPENAI_TEXT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: fightPrompt,
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
              url: playerOneImageUrl,
              detail: OPENAI_IMAGE_DETAIL,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: playerTwoImageUrl,
              detail: OPENAI_IMAGE_DETAIL,
            },
          },
        ],
      },
    ],
  });

  if (!response) {
    throw new Error();
  }

  return response.choices[0].message.content;
};

export const generateFightImageUrl = async (openAiJson: OpenAiJsonResponse) => {
  const imagePrompt = generateImagePrompt(openAiJson);
  const image = await openai.images.generate({
    model: OPENAI_IMAGE_MODEL,
    prompt: imagePrompt,
    size: "1024x1024",
  });

  if (!image) {
    throw new Error();
  }

  return image.data[0];
};
