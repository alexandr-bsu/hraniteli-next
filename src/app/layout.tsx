import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../shared/styles/globals.css";
import '../shared/styles/main.scss';
import { Providers } from "@/shared/Providers/Providers";
import YandexMetrikaContainer from "@/components/yandex/YandexMetrikaContainer";
import { Suspense } from "react";

const open_sans = Open_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Подбор психолога онлайн, запись на сессию и консультацию к выбранному психологу",
  description: 'Психологи сообщества "Хранители" - удобный подбор психолога по фильтрам и параметрам под ваш запрос. Запись на консультацию и сессию к профессиональному психологу.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" >
      <head>
        <Suspense>
          <YandexMetrikaContainer
            counter_id={102105189}
            enabled
          />
        </Suspense>
      </head>
      <body
        className={`${open_sans.className} antialiased`}
      >


        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
