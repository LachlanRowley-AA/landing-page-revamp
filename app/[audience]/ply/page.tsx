import { audienceContent, AudienceKey } from '@/lib/audienceContent';
import HomePageClient from '@/components/Homepage/HomepageClient';
import { colorsTuple, createTheme, MantineProvider, DEFAULT_THEME } from '@mantine/core';
import './styles.css';
import { TT } from '@/assets/fonts/TT/TT';
import { Americane } from '@/assets/fonts/Americane/Americane';

// Create the custom theme
const customTheme = createTheme({
  colors: {
    black: colorsTuple('#333333'), 

    secondary: colorsTuple('#F7F2EA')
  },
  other: {
    bodyColor: '#F7F2EA',
  },
  fontFamily: `${TT.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  headings: {
    fontFamily: `${Americane.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`
  },
  fontSizes: {
    "sm": "1.25rem",
    "md": "1.25rem"
  }

});

export default async function HomePage(props: { params: Promise<{ audience: string, partner: string}>}) {
  const params = await props.params;
  const audience = params.audience as AudienceKey
  const partner = 'ply';
  const content = audienceContent[audience];
 
  return (
    <div style={{ '--mantine-color-body': '#F7F2EA' } as React.CSSProperties}>
      <MantineProvider theme={customTheme}>
        <HomePageClient
          audience={audience}
          partner={partner}
          content={content}
          calculatorValue={60000}
        />
      </MantineProvider>
    </div>
  );
}