import Link from "./Link";
import HomeLink from "./HomeLink";
import AutoRefresh from "./AutoRefresh";
import { serif } from "./fonts";
import "./global.css";
import Image from 'next/image';

export default function RootLayout({ children }) {
  return (
    <AutoRefresh>
      <html lang="en" className={serif.className}>
        <body className="mx-auto max-w-2xl bg-[--bg] px-5 py-12 text-[--text]">
          <header className="mb-14 flex flex-row place-content-between">
            <HomeLink />
            <span className="relative top-[4px] italic">
              by{" "}
              <Link href="https://github.com/breeze2501" target="_blank">
                  <Image
                    alt="Yipu Zhang"
                    src="/avatar.jpeg"
                    width="0" // useless?
                    height="0" // useless?
                    className="relative -top-1 mx-1 h-8 w-8 inline rounded-full"
                  />
              </Link>
            </span>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </AutoRefresh>
  );
}
