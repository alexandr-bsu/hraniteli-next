'use client';

import useYandexMetrika from '@/components/yandex/useYandexMetrika';
import { vkBotWriteUrl } from '@/shared/constants/hraniBot';

export type FinalStageAnalyticsSource =
  | 'application'
  | 'cards'
  | 'diagnoses'
  | 'help_hand'
  | 'help_hand_confirm';

type Props = {
  ticketId: string;
  analyticsSource: FinalStageAnalyticsSource;
  className?: string;
  showVkButton?: boolean;
};

const BTN =
  'w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 rounded-[50px] font-normal text-[18px] leading-[25px] bg-[#116466]';

export function FinalStageBotButtons({ ticketId, analyticsSource, className, showVkButton = true }: Props) {
  const { reachGoal, hit } = useYandexMetrika(102105189);

  const openVk = () => {
    hit(`/virtual/final-bot/vk?source=${encodeURIComponent(analyticsSource)}`);
    reachGoal('final_stage_vk', { source: analyticsSource });
    window.open(vkBotWriteUrl(ticketId), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex w-full flex-col gap-[10px] ${className ?? ''}`}>
      {showVkButton && (
        <button type="button" onClick={openVk} className={BTN}>
          Перейти в VK бот
        </button>
      )}
    </div>
  );
}
