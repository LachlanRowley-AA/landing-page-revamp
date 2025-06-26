import { Metadata } from 'next'
import { HeroA } from '@/components/wholesaler/HeroA'
import { HeroB } from '@/components/wholesaler/HeroB'
import { QrCode } from '@/components/wholesaler/QrCode';
import { ProblemStatement } from '@/components/wholesaler/Problem'
import { colorsTuple, MantineProvider, createTheme, Title } from '@mantine/core';

export const metadata : Metadata = {
    title: 'Alternative Options with Asset Alley'
}

const theme = createTheme({
    colors: {
        black: colorsTuple("#000000")
    },
    components: {
        Title: {
            defaultProps: {
                c: 'white'
            }
        }
    }
})

export default async function HomePage() {
    return(
        <>
        <MantineProvider theme={theme}>
            {/* <HeroA/> */}
            <HeroB/>
            <ProblemStatement/>
            <QrCode/>
        </MantineProvider>
        </>
    );
}