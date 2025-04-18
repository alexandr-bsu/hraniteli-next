import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { Psychologist_cards } from "@/views";

export default async function Home() {
  const data = await getPsychologistAll();
  console.log(data) 
  return (
    <div className="w-full h-full flex max-lg:items-center  max-lg:flex-col min-lg:justify-center">
        <Psychologist_cards data={data} />
    </div>
  );
}
