import type { Metadata, ResolvingMetadata } from "next";
import { Flex, Heading, Image, Text, Button } from "@chakra-ui/react";
import { RiFireFill } from "react-icons/ri";
import { IoIosWater } from "react-icons/io";
import { FaRegSnowflake, FaHeart } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { RiFlipHorizontal2Fill } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import Link from "next/link";
import supabase from "@/utils/supabase";
import { FightDataRecord } from "@/services/supabase";

type Props = {
  params: { slug: string };
};

async function fetchFightData(slug: string): Promise<FightDataRecord | null> {
  const { data, error } = await supabase
    .from("fights")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const fightData = await fetchFightData(params.slug);

  if (!fightData) {
    return {
      title: "Battle Report Not Found",
    };
  }

  const title = `Battle Report: ${fightData.winner} wins!`;
  const description = `See how ${fightData.winner} won the fight and share the Battle Report`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [fightData.fight_img_url || ""],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fightData.fight_img_url || ""],
    },
  };
}

export default async function Page({ params }: Props) {
  const fightData = await fetchFightData(params.slug);

  if (!fightData) {
    return <div>Fight data not found</div>;
  }

  const renderDamageIcons = () => {
    const IconComponent = {
      fire: RiFireFill,
      water: IoIosWater,
      ice: FaRegSnowflake,
    }[fightData.element || ""];

    if (!IconComponent) return null;

    const damageCount = parseInt(fightData.damage_given || "0", 10);
    const coloredCount = Math.min(Math.max(damageCount, 0), 5);

    const icons = Array(5)
      .fill(0)
      .map((_, index) => {
        const props =
          index < coloredCount
            ? { color: getElementColor(fightData.element) }
            : { color: "gray" };
        return <IconComponent key={index} {...props} />;
      });

    return icons;
  };

  const getElementColor = (element?: string): string => {
    const colors: { [key: string]: string } = {
      fire: "orange",
      water: "cyan",
      ice: "white",
    };
    return colors[element || ""] || "gray";
  };

  const renderHealthIcons = () => {
    const damageCount = parseInt(fightData.damage_given || "0", 10);
    const coloredCount = Math.min(Math.max(damageCount, 0), 5);

    const icons = Array(5)
      .fill(0)
      .map((_, index) => {
        const color = index < coloredCount ? "red" : "gray";
        return <FaHeart key={index} color={color} />;
      });

    return icons;
  };

  return (
    <Flex direction="column" alignItems="center" width={600} gap={8}>
      <Heading>Battle Report</Heading>
      <Flex
        direction="column"
        bg="navy"
        borderRadius={5}
        width={400}
        padding={4}
        color="gray.100"
        border="8px solid"
        borderColor="gray.300"
        position="relative"
      >
        <Flex direction="column" gap={2}>
          <Flex align="center" gap={2}>
            <LuSwords size={30} />
            <Heading size="lg">{fightData.winner}</Heading>
          </Flex>
          <Image src={fightData.fight_img_url} alt="fight image" width={375} />
          <Flex justify="space-between">
            <Flex gap={1}>{renderDamageIcons()}</Flex>
            <Flex gap={1}>{renderHealthIcons()}</Flex>
          </Flex>
          <Text>{`Defeats opponents in ${fightData.length_of_fight} mins`}</Text>
          <Text>{fightData.winning_move}</Text>
        </Flex>
        <Button
          width="fit-content"
          size="sm"
          position="absolute"
          alignSelf="end"
        >
          <RiFlipHorizontal2Fill size={24} />
        </Button>
      </Flex>
      <Flex gap={2}>
        <Button leftIcon={<IoCopyOutline />}>Copy</Button>
        <Button as={Link} href="/">
          New Fight
        </Button>
      </Flex>
    </Flex>
  );
}
