import { Roboto } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import '@fontsource/instrument-serif';

import { Providers } from 'contexts/Providers';

import 'styles/custom-table.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Seneca',
  description: 'Seneca is DeFi made stable',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
