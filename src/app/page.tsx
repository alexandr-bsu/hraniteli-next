import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { Psychologist_cards } from "@/views";

export default async function Home() {
  try {
    const data = await getPsychologistAll();
    console.log('Page data:', data);

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format:', data);
      return <div>Ошибка загрузки данных</div>;
    }

    return (
      <div className="w-full h-full flex max-lg:items-center max-lg:flex-col min-lg:justify-center">
        <Psychologist_cards data={data} />
      </div>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return <div>Произошла ошибка при загрузке данных</div>;
  }
}
