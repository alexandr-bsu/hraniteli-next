import type { Metadata } from "next";
import Script from "next/script";
import { Open_Sans } from "next/font/google";
import "../shared/styles/globals.css";
import '../shared/styles/main.scss';
import { Providers } from "@/shared/Providers/Providers";

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
        {/* <!-- /Yandex.Metrika counter --> */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(102105189, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   }
            `,
          }}
        />
        {/* <!-- /Yandex.Metrika counter --> */}

      </head>
      <body
        className={`${open_sans.className} antialiased`}
      >

        <noscript
          dangerouslySetInnerHTML={{
            __html: `
      <div><img src="https://mc.yandex.ru/watch/102105189" style="position:absolute; left:-9999px;" alt="" /></div>
    `,
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
