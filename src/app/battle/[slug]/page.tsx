import { Metadata, ResolvingMetadata } from "next";
import supabase from "@/utils/supabase";
import { FightDataRecord } from "@/services/supabase";
import BattleReport from "./BattleReport";

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
  };
}

export default async function Page({ params }: Props) {
  const fightData = await fetchFightData(params.slug);

  if (!fightData) {
    return <div>Fight data not found</div>;
  }

  return <BattleReport initialFightData={fightData} slug={params.slug} />;
}
