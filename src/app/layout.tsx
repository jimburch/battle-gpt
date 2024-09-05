import type { Metadata } from "next";
import { fonts } from "./fonts";
import { Providers } from "./providers";
import { Flex, Image, Text } from "@chakra-ui/react";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Battle GPT",
  description: "Head-to-head combat, judged by OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>
          <header>
            <Flex direction="column" width="full" align="center" paddingY={6}>
              <Flex
                paddingBottom={4}
                direction="column"
                align="center"
                textAlign="center"
                paddingX={10}
              >
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={{ base: 350, md: 500 }}
                  />
                </Link>
                <Text>
                  Head-to-head combat, judged by OpenAI. Upload photos to see
                  who would win in a fight.
                </Text>
              </Flex>
              {children}
            </Flex>
          </header>
        </Providers>
      </body>
    </html>
  );
}
