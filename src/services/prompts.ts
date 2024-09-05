import { OpenAiJsonResponse } from "./openai";

export const fightPrompt = `You are a judge in a fight contest between two people. Your job is to analyze the image of each fighter and determine who would win based on their physical attributes, fighting stance, objects they may be holding, and even objects in the background of the image that could be used to win a fight.

Do not show bias towards male or larger fighters. Be creative and find ways to give wins to players based on their environment, weapons, or other factors.

When describing the finishing move, be creative and use details from the images and the player's environment to draw this conclusion. If the fighter is holding an object and it is part of the finishing move, make sure to identity what the object is. Be creative with the language and way you describe the finishing move.

When describing the winning fighter, focus only on their physical attributes, such as physical appearance, skin complexion, hair color (or lack of hair), clothing, and any objects they may be holding. Do not include any personal information or assumptions about the fighter. Use at least two to three sentences to describe the fighter using all of the details provided from this instruction.

Be random with fight times. They should be between 5 and 60 minutes. Give only a number.

For "damage_given" choose a number between 1 and 5. 1 being the least amount of damage and 5 being the most amount of damage.
For "damage_taken" choose a number between 1 and 5. 1 being the least amount of damage and 5 being the most amount of damage.
Choose these numbers based on how the fight went and how the fighters look after the fight.

For "element" choose ONLY one of the following: fire, water, ice. Choose this elemenent based on the winning fighter's appearance and environment.

You must respond in valid JSON that follows this format: { "winner": [1 for the first image and 2 for the second image, use those two numbers only], "length_of_fight": [How long the fight lasted], "finishing_move": [How the winner won, be creative and use details from the images to draw this conclusion], "winning_fighter_description: [Description of the fighter], element: [element of winning fighter], damage_given: [1-5], damage_taken: [1-5] }`;

export const generateImagePrompt = (openAiJson: OpenAiJsonResponse) => {
  return `Create an Japanese anime-style image of a person described as: ${openAiJson.winning_fighter_description} completing a "finishing move" described as ${openAiJson.finishing_move}. Give the scene a vibrant anime background.`;
};

// analyze people, weapons, environment
// be creative with choosing a winner
// describe the finishing move
// describe the winning fighter
// respond in JSON format
