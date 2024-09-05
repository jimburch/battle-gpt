"use client";

import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Flex, Heading, Spinner, Image, Text, Button } from "@chakra-ui/react";
import { FightDataRecord } from "@/services/supabase";
import { RiFireFill } from "react-icons/ri";
import { IoIosWater } from "react-icons/io";
import { FaRegSnowflake, FaHeart } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { RiFlipHorizontal2Fill } from "react-icons/ri";

export default function Page({ params }: { params: { slug: string } }) {
  const [fightData, setFightData] = useState<FightDataRecord>();
  const [isLoading, setIsLoading] = useState(true);
  const [cardFront, setCardFront] = useState(true);

  useEffect(() => {
    const fetchFightData = async () => {
      let { data, error } = await supabase
        .from("fights")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (error) {
        // we need better error handling here
        console.log(error);
        return;
      }

      setFightData(data);
      setIsLoading(false);
      return;
    };

    fetchFightData();
  }, [params.slug]);

  if (isLoading) return <Spinner />;

  return (
    <Flex direction="column" alignItems="center" width={600} gap={8}>
      <Heading>Battle Report</Heading>
      <Flex
        direction="column"
        bg="navy"
        borderRadius={5}
        width={400}
        // height={700}
        padding={4}
        color="gray.100"
        border="8px solid"
        borderColor="gray.300"
        position="relative"
      >
        {cardFront ? (
          <Flex direction="column" gap={2}>
            <Flex align="center" gap={2}>
              <LuSwords size={30} />
              <Heading size="lg">{fightData?.winner}</Heading>
            </Flex>
            <Image
              src={fightData?.fight_img_url}
              alt="fight image"
              width={375}
            />
            <Flex justify="space-between">
              <Flex gap={1}>
                <RiFireFill color="orange" />
                <RiFireFill />
                <RiFireFill />
              </Flex>
              <Flex gap={1}>
                <FaHeart color="red" />
                <FaHeart />
                <FaHeart />
              </Flex>
            </Flex>
            <Text>{`Defeats opponents in ${fightData?.length_of_fight} mins`}</Text>
            <Text>{fightData?.winning_move}</Text>
          </Flex>
        ) : (
          <Flex direction="column" gap={2}>
            <Flex align="center" gap={2}>
              <LuSwords size={30} />
              <Heading size="lg">The Fighters</Heading>
            </Flex>
            <Flex justify="space-between">
              <Flex direction="column" align="center" gap={1}>
                <Image
                  src={fightData?.player_one_img_url}
                  alt="player one image"
                  width={165}
                />
                <Heading size="md">{fightData?.player_one_name}</Heading>
              </Flex>
              <Flex direction="column" align="center" gap={1}>
                <Image
                  src={fightData?.player_two_img_url}
                  alt="player two image"
                  width={165}
                />
                <Heading size="md">{fightData?.player_two_name}</Heading>
              </Flex>
            </Flex>
            <Text>OpenAI described the winning fighter as:</Text>
            <Text>{fightData?.winner_description}</Text>
          </Flex>
        )}
        <Button
          onClick={() => setCardFront(!cardFront)}
          width="fit-content"
          size="sm"
          position="absolute"
          alignSelf="end"
        >
          <RiFlipHorizontal2Fill size={24} />
        </Button>
      </Flex>
      <Flex gap={2}>
        <Button>Copy</Button>
        <Button>New Fight</Button>
      </Flex>
    </Flex>
  );
}
