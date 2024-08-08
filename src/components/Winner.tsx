import { Flex, Heading, Image, Text } from "@chakra-ui/react";

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
      width={700}
      justifyContent="space-evenly"
      alignItems="center"
      gap={10}
    >
      <Flex direction="column" width={500} gap={2} justify="center">
        <Heading>{name}</Heading>
        <Text>{`Length of fight: ${lengthOfFight}`}</Text>
        <Text>{`Finishing move: ${finishingMove}`}</Text>
      </Flex>
      <Image src={imageUrl} alt={name} height={400} />
    </Flex>
  );
};

export default Winner;
