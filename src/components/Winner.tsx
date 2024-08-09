import { Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";

interface WinnerProps {
  name: string;
  imageUrl: string;
  lengthOfFight: string;
  finishingMove: string;
}

const Winner = ({
  name,
  imageUrl,
  lengthOfFight,
  finishingMove,
}: WinnerProps) => {
  return (
    <Flex
      direction="row"
      width={800}
      justifyContent="space-evenly"
      alignItems="center"
      gap={10}
      boxShadow="lg"
      padding={8}
    >
      <Flex direction="column" width={500} gap={2} justify="center">
        <Heading size="3xl">{`${name}!`}</Heading>
        <Text fontSize="xl">{`Finishing move: ${finishingMove}`}</Text>
      </Flex>
      <Image
        src={imageUrl}
        alt={name}
        height={400}
        width={400}
        placeholder="blur"
        blurDataURL="./placeholder.webp"
      />
    </Flex>
  );
};

export default Winner;
