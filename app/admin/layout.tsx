import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { GoogleAnalytics} from '@next/third-parties/google'


import { Providers } from '../providers';

export default function AdminLayout({ children }: {children: any}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
    <meta name="google-site-verification" content="gFnL_l0_VGDHNfIeo7SIS2GvdPEO2YbpG-QGNnmjHBk" />      
    <body>
        <Providers>
          <MantineProvider theme={theme}>{children}</MantineProvider>          
        </Providers>
      </body>
    </html>
  );
}
