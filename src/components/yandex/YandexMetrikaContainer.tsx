"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";


import useYandexMetrika from "./useYandexMetrika";
import YandexMetrikaInitializer from "./YandexMetrikaInitializer";

type Props = {
  enabled: boolean;
  counter_id: number
};

const YandexMetrikaContainer: React.FC<Props> = ({ enabled, counter_id }) => {
  const pathname = usePathname();
  const search = useSearchParams();
  const { hit } = useYandexMetrika(counter_id);

  useEffect(() => {
    hit(`${pathname}${search.size ? `?${search}` : ""}${window.location.hash}`);
  }, [hit, pathname, search]);

  if (!enabled) return null;

  return (
    <YandexMetrikaInitializer
      id={counter_id}
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      }}
    />
  );
};

export default YandexMetrikaContainer;
