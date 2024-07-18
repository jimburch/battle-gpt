import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const { playerOneName, playerOneImage, playerTwoName, playerTwoImage } =
    await req.json();
  console.log(playerOneName);
  return NextResponse.json({ message: "Hello, world!" });
}

// export async function POST() {
//   const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-4o",
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text: "Who would win in a fight between the people depicted in these images?",
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//             },
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
//             },
//           },
//         ],
//       },
//     ],
//   });

//   if (!chatCompletion) {
//     return NextResponse.error();
//   }

//   return NextResponse.json(chatCompletion.choices[0].message.content);
// }
