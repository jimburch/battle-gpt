import { Flex, Heading, Text, Image } from "@chakra-ui/react";

interface WinnerProps {
  name: string;
  imageUrl: string;
  lengthOfFight: string;
  finishingMove: string;
}

const Winner = ({ name, imageUrl, finishingMove }: WinnerProps) => {
  return (
    <Flex
      direction={{ base: "column-reverse", md: "row" }}
      width={{ base: "100%", md: 800 }}
      justifyContent="space-evenly"
      alignItems="center"
      gap={10}
      boxShadow={{ base: "none", md: "lg" }}
      padding={{ base: 0, md: 8 }}
    >
      <Flex
        direction="column"
        width={{ base: 375, md: "50%" }}
        gap={2}
        justify="center"
        textAlign="center"
      >
        <Heading size="3xl">{`${name}!`}</Heading>
        <Text fontSize="xl">{`Finishing move: ${finishingMove}`}</Text>
      </Flex>
      <Image
        src={imageUrl}
        alt={name}
        height={{ base: 375, md: 400 }}
        width={{ base: 375, md: 400 }}
      />
    </Flex>
  );
};

export default Winner;
