"use client";

import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";
import { Flex, Heading, Spinner, Image, Text, Button } from "@chakra-ui/react";
import { FightDataRecord } from "@/services/supabase";
import { RiFireFill } from "react-icons/ri";
import { IoIosWater } from "react-icons/io";
import { FaRegSnowflake, FaHeart } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";

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
      {cardFront ? (
        <Flex
          direction="column"
          bg="green"
          borderRadius={5}
          width={400}
          padding={4}
        >
          <Flex>
            <LuSwords />
            <Heading>{fightData?.winner}</Heading>
          </Flex>
          <Image src={fightData?.fight_img_url} alt="fight image" width={375} />
          <Flex justify="space-between">
            <Flex gap={1}>
              <RiFireFill />
              <RiFireFill />
              <RiFireFill />
            </Flex>
            <Flex gap={1}>
              <FaHeart />
              <FaHeart />
              <FaHeart />
            </Flex>
          </Flex>
          <Text>{fightData?.length_of_fight}</Text>
          <Text>{fightData?.winning_move}</Text>
          <Button onClick={() => setCardFront(!cardFront)}>Flip</Button>
        </Flex>
      ) : (
        <Flex></Flex>
      )}
    </Flex>
  );
}
