import '@/styles/globals.scss';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';
import { Roboto_Mono } from 'next/font/google';

const roboto = Roboto_Mono({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html, body, a, input {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}
