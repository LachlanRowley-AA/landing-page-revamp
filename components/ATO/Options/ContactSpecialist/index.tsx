import { Stack } from '@mantine/core';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';


export default function ContactSpecialist() {
    return (
        <InlineWidget url='https://calendly.com/louiedib/website-app-development-finance' styles={{height: '400px'}}/>
    )
}
