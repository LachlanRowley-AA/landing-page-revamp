import '@mantine/core/styles.css';
import '@mantine/charts/styles.css'

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../theme';
import { GoogleAnalytics} from '@next/third-parties/google'



export const metadata = {
  title: 'Asset Alley',
  description: 'Power your business with Asset Alley!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta name="google-site-verification" content="gFnL_l0_VGDHNfIeo7SIS2GvdPEO2YbpG-QGNnmjHBk" />   
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <GoogleAnalytics gaId="G-DV75N3M26V" />
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
