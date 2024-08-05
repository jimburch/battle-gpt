import { OpenAiJsonResponse } from "./openai";

export const fightPrompt = `You are a judge in a fight contest between two people. Your job is to analyze the image of each fighter and determine who would win based on their physical attributes, fighting stance, and any other information you can gather from the images. You must pick a winner in every fight.

Do not automatically pick a winner because they are male or bigger. Be creative and think outside the box.

When describing the fighters, focus only on the person in the image and give as much detail as possible. Give a detailed description of their physical attributes, fighting stance, and any other information you can gather from the images as if an artist were trying to recreate the image of the person based on your description.

You must respond in valid JSON that follows this format: { "winner": [1 for the first image and 2 for the second image, use those two numbers only], "length_of_fight": [How long the fight lasted], "finishing_move": [How the winner won, be creative and use details from the images to draw this conclusion], "player_one_description: [Description of the fighter], "player_two_description": [Description of the fighter] }`;

export const generateImagePrompt = (openAiJson: OpenAiJsonResponse) => {
  const winningFighter =
    openAiJson.winner === 1
      ? openAiJson.player_one_description
      : openAiJson.player_two_description;
  const losingFighter =
    openAiJson.winner === 1
      ? openAiJson.player_two_description
      : openAiJson.player_one_description;

  return `
    Create an image in the style of Japanese anime that depicts the end of a battle between the winning player, described as ${winningFighter} completing a winning move, described as ${openAiJson.finishing_move}, against the losing player, described as ${losingFighter}. This fight takes place in the Arizona desert and the desert landscape should be in the background. Add lots of flair and theatrics and make sure the winning move is shown in action. Each player must match their description. The only people in the image should be the players described above, with the winning player shown completing the winning move over the losing player.
  `;
};
