import { openai } from "@/utils/openai";
import { APIError } from "openai";
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

export const generateOpenAiJSON = async ({
  playerOneImageUrl,
  playerTwoImageUrl,
}: GenerateOpenAiJsonProps) => {
  const response: any = await openai.chat.completions
    .create({
      model: "gpt-4o-mini",
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
              },
            },
            {
              type: "image_url",
              image_url: {
                url: playerTwoImageUrl,
              },
            },
          ],
        },
      ],
    })
    .catch(async (err) => {
      if (err instanceof APIError) {
        console.log(err.status); // 400
        console.log(err.name); // BadRequestError
        console.log(err.headers); // {server: 'nginx', ...}
      } else {
        throw err;
      }
    });

  if (!response) {
    throw new Error();
  }

  return response.choices[0].message.content;
};

export const generateFightImageUrl = async (openAiJson: OpenAiJsonResponse) => {
  const imagePrompt = generateImagePrompt(openAiJson);
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: imagePrompt,
    size: "1024x1024",
    style: "vivid",
  });

  if (!image) {
    throw new Error();
  }

  return image.data[0];
};
