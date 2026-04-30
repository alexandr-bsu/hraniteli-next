import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../shared/styles/globals.css";
import '../shared/styles/main.scss';
import { Providers } from "@/shared/Providers/Providers";
import YandexMetrikaContainer from "@/components/yandex/YandexMetrikaContainer";
import { Suspense } from "react";
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import ReactPlugin from '@stagewise-plugins/react';
import Script from "next/script";


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
        <Script id="mailru-counter" strategy="afterInteractive">
          {`(function (d, w, id) {
  w._tmr = w._tmr || [];
  w._tmr.push({ type: 'pageView', id: 3503497, start: new Date().getTime() });
  if (d.getElementById(id)) return;
  var ts = d.createElement('script');
  ts.type = 'text/javascript';
  ts.async = true;
  ts.id = id;
  ts.src = 'https://top-fwz1.mail.ru/js/code.js';
  var s = d.getElementsByTagName('script')[0];
  if (s && s.parentNode) s.parentNode.insertBefore(ts, s);
})(document, window, 'tmr-code');`}
        </Script>
      </head>
      <body
        className={`${open_sans.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      </body>
    </html>
  );
}
