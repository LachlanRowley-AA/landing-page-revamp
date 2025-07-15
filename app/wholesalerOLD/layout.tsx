import type { Metadata } from "next";
import "../globals.css";

import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme} from '@mantine/core';

export const metadata: Metadata = {
  title: "Partner with Asset Alley",
  description: "Partner with Asset Alley",
};

const theme = {
  fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  headings: {
    fontFamily: 'Cera Pro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" {...mantineHtmlProps}>
        <head>
          <ColorSchemeScript />
        </head>
        <body>
          <MantineProvider theme={theme}>
            {children}
          </MantineProvider>
        </body>
      </html>
  );
}
